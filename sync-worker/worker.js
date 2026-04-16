const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

// ── CORS ──────────────────────────────────────────────────────────────────────
function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = (env.ALLOWED_ORIGIN ?? "").split(",").map(s => s.trim()).filter(Boolean);
  if (!allowed.includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin":      origin,
    "Access-Control-Allow-Methods":     "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":     "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}

function json(data, status = 200, cors = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// ── SESSION ───────────────────────────────────────────────────────────────────
async function createSession(env, userId) {
  const token = crypto.randomUUID();
  await env.TEF_SYNC.put(`session:${token}`, String(userId), { expirationTtl: SESSION_TTL });
  return token;
}

async function resolveSession(request, env) {
  // 1. Bearer header (kept for backward compat during transition)
  const header = request.headers.get("Authorization") ?? "";
  if (header.startsWith("Bearer ")) {
    const token = header.slice(7);
    if (/^[0-9a-f-]{36}$/.test(token)) {
      const userId = await env.TEF_SYNC.get(`session:${token}`);
      if (userId) return userId;
    }
  }
  // 2. httpOnly cookie
  const cookie = request.headers.get("Cookie") ?? "";
  const match  = cookie.match(/tef_token=([0-9a-f-]{36})/);
  if (match) return await env.TEF_SYNC.get(`session:${match[1]}`);
  return null;
}

// ── ENCRYPTION (AES-GCM) ──────────────────────────────────────────────────────
async function importKey(secret) {
  const raw = new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 32));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encrypt(plaintext, secret) {
  const key = await importKey(secret);
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const enc = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  const buf = new Uint8Array(iv.byteLength + enc.byteLength);
  buf.set(iv, 0);
  buf.set(new Uint8Array(enc), iv.byteLength);
  return btoa(String.fromCharCode(...buf));
}

async function decrypt(ciphertext, secret) {
  const buf = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const iv  = buf.slice(0, 12);
  const enc = buf.slice(12);
  const key = await importKey(secret);
  const dec = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, enc);
  return new TextDecoder().decode(dec);
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
async function authGitHub(code, env) {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return null;
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${tokenData.access_token}`, "User-Agent": "tef-sync-worker" },
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
      code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri, grant_type: "authorization_code",
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

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      if (!cors) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors });
    }

    if (!cors) return json({ error: "Forbidden" }, 403);

    // ── POST /auth ───────────────────────────────────────────────────────────
    if (request.method === "POST" && url.pathname === "/auth") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid body" }, 400, cors); }
      const { code, provider, redirectUri } = body;
      let result = null;
      if (provider === "github") result = await authGitHub(code, env);
      else if (provider === "google") result = await authGoogle(code, redirectUri, env);
      if (!result) return json({ error: "Auth failed" }, 401, cors);
      const token = await createSession(env, result.userId);
      await env.TEF_SYNC.put(`user:${result.userId}:profile`, JSON.stringify({ login: result.login }));
      return json({ token, login: result.login }, 200, cors);
    }

    // ── POST /logout ─────────────────────────────────────────────────────────
    if (request.method === "POST" && url.pathname === "/logout") {
      // Delete session from KV (both Bearer and cookie paths)
      const header = request.headers.get("Authorization") ?? "";
      const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
      if (bearer && /^[0-9a-f-]{36}$/.test(bearer)) {
        await env.TEF_SYNC.delete(`session:${bearer}`);
      }
      const cookie = request.headers.get("Cookie") ?? "";
      const match  = cookie.match(/tef_token=([0-9a-f-]{36})/);
      if (match) await env.TEF_SYNC.delete(`session:${match[1]}`);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Set-Cookie": "tef_token=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0",
        },
      });
    }

    // ── Authenticated routes ─────────────────────────────────────────────────
    const userId = await resolveSession(request, env);
    if (!userId) return json({ error: "Unauthorized" }, 401, cors);

    const dataKey = `user:${userId}:data`;

    // ── GET /me ──────────────────────────────────────────────────────────────
    if (request.method === "GET" && url.pathname === "/me") {
      const profile = await env.TEF_SYNC.get(`user:${userId}:profile`);
      const { login } = profile ? JSON.parse(profile) : { login: "unknown" };
      return json({ login }, 200, cors);
    }

    // ── GET / ────────────────────────────────────────────────────────────────
    if (request.method === "GET" && url.pathname === "/") {
      const data = await env.TEF_SYNC.get(dataKey);
      return new Response(data ?? "{}", { headers: { ...cors, "Content-Type": "application/json" } });
    }

    // ── PUT / ────────────────────────────────────────────────────────────────
    if (request.method === "PUT" && url.pathname === "/") {
      const body = await request.text();
      await env.TEF_SYNC.put(dataKey, body);
      return json({ ok: true }, 200, cors);
    }

    // ── GET /aikey ───────────────────────────────────────────────────────────
    if (request.method === "GET" && url.pathname === "/aikey") {
      const stored = await env.TEF_SYNC.get(`user:${userId}:aikey`);
      return json({ configured: stored !== null }, 200, cors);
    }

    // ── PUT /aikey ───────────────────────────────────────────────────────────
    if (request.method === "PUT" && url.pathname === "/aikey") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid body" }, 400, cors); }
      const { key } = body;
      if (!key || typeof key !== "string" || !key.startsWith("sk-ant-")) {
        return json({ error: "Invalid Anthropic API key" }, 400, cors);
      }
      if (!env.ENCRYPTION_SECRET) return json({ error: "Server misconfigured" }, 500, cors);
      const encrypted = await encrypt(key, env.ENCRYPTION_SECRET);
      await env.TEF_SYNC.put(`user:${userId}:aikey`, encrypted, { expirationTtl: 60 * 60 * 24 * 365 });
      return json({ ok: true }, 200, cors);
    }

    // ── DELETE /aikey ────────────────────────────────────────────────────────
    if (request.method === "DELETE" && url.pathname === "/aikey") {
      await env.TEF_SYNC.delete(`user:${userId}:aikey`);
      return json({ ok: true }, 200, cors);
    }

    // ── POST /chat ───────────────────────────────────────────────────────────
    if (request.method === "POST" && url.pathname === "/chat") {
      const stored = await env.TEF_SYNC.get(`user:${userId}:aikey`);
      if (!stored) return json({ error: "No API key configured" }, 402, cors);
      if (!env.ENCRYPTION_SECRET) return json({ error: "Server misconfigured" }, 500, cors);

      let apiKey;
      try { apiKey = await decrypt(stored, env.ENCRYPTION_SECRET); } catch {
        return json({ error: "Failed to read API key" }, 500, cors);
      }

      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid body" }, 400, cors); }

      const { messages } = body;
      if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
        return json({ error: "Invalid messages" }, 400, cors);
      }
      for (const m of messages) {
        if (!m || typeof m !== "object") return json({ error: "Invalid message" }, 400, cors);
        if (!["user", "assistant"].includes(m.role)) return json({ error: "Invalid role" }, 400, cors);
        if (typeof m.content !== "string" || m.content.length > 4000) {
          return json({ error: "Invalid content" }, 400, cors);
        }
      }

      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
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
        return json({ error: err.error?.message ?? "Anthropic error" }, anthropicRes.status, cors);
      }
      const data = await anthropicRes.json();
      return json({ content: data.content[0]?.text ?? "" }, 200, cors);
    }

    return json({ error: "Method not allowed" }, 405, cors);
  },
};
