const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

async function createSession(env, userId) {
  const token = crypto.randomUUID();
  await env.TEF_SYNC.put(`session:${token}`, String(userId), {
    expirationTtl: 60 * 60 * 24 * 30,
  });
  return token;
}

async function resolveSession(request, env) {
  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  return await env.TEF_SYNC.get(`session:${token}`);
}

async function authGitHub(code, env) {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return null;

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "tef-sync-worker",
    },
  });
  const user = await userRes.json();
  if (!user.id) return null;
  return { userId: `gh:${user.id}`, login: user.login };
}

async function authGoogle(code, redirectUri, env) {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return null;

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();
  if (!user.id) return null;
  return { userId: `go:${user.id}`, login: user.name || user.email };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ── POST /auth ─────────────────────────────────────────────────────────
    if (request.method === "POST" && url.pathname === "/auth") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid body" }, 400); }

      const { code, provider, redirectUri } = body;
      let result = null;

      if (provider === "github") result = await authGitHub(code, env);
      else if (provider === "google") result = await authGoogle(code, redirectUri, env);

      if (!result) return json({ error: "Auth failed" }, 401);

      const sessionToken = await createSession(env, result.userId);
      return json({ token: sessionToken, login: result.login });
    }

    // ── Authenticated routes ───────────────────────────────────────────────
    const userId = await resolveSession(request, env);
    if (!userId) return json({ error: "Unauthorized" }, 401);

    const dataKey = `user:${userId}:data`;

    if (request.method === "GET") {
      const data = await env.TEF_SYNC.get(dataKey);
      return new Response(data ?? "{}", {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    if (request.method === "PUT") {
      const body = await request.text();
      await env.TEF_SYNC.put(dataKey, body);
      return json({ ok: true });
    }

    // ── GET /aikey ─────────────────────────────────────────────────────────
    if (request.method === "GET" && url.pathname === "/aikey") {
      const key = await env.TEF_SYNC.get(`user:${userId}:aikey`);
      return json({ configured: key !== null });
    }

    // ── PUT /aikey ─────────────────────────────────────────────────────────
    if (request.method === "PUT" && url.pathname === "/aikey") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid body" }, 400); }
      const { key } = body;
      if (!key || typeof key !== "string" || !key.startsWith("sk-ant-")) {
        return json({ error: "Invalid Anthropic API key" }, 400);
      }
      await env.TEF_SYNC.put(`user:${userId}:aikey`, key, {
        expirationTtl: 60 * 60 * 24 * 365,
      });
      return json({ ok: true });
    }

    // ── DELETE /aikey ──────────────────────────────────────────────────────
    if (request.method === "DELETE" && url.pathname === "/aikey") {
      await env.TEF_SYNC.delete(`user:${userId}:aikey`);
      return json({ ok: true });
    }

    // ── POST /chat ─────────────────────────────────────────────────────────
    if (request.method === "POST" && url.pathname === "/chat") {
      const apiKey = await env.TEF_SYNC.get(`user:${userId}:aikey`);
      if (!apiKey) return json({ error: "No API key configured" }, 402);

      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid body" }, 400); }

      const { messages } = body;
      if (!Array.isArray(messages)) return json({ error: "messages required" }, 400);

      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: `Tu es un assistant spécialisé dans le français langue seconde et la préparation au TEF Canada.
Tu aides avec: traduction (français ↔ anglais/espagnol), correction grammaticale, vocabulaire TEF, expressions idiomatiques, conjugaison et accord.
Réponds toujours en français sauf si l'utilisateur écrit en anglais ou espagnol.
Sois concis et pédagogique.`,
          messages,
        }),
      });

      if (!anthropicRes.ok) {
        const err = await anthropicRes.json().catch(() => ({}));
        return json({ error: err.error?.message ?? "Anthropic error" }, anthropicRes.status);
      }

      const data = await anthropicRes.json();
      return json({ content: data.content[0]?.text ?? "" });
    }

    return json({ error: "Method not allowed" }, 405);
  },
};
