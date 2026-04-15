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

    return json({ error: "Method not allowed" }, 405);
  },
};
