const SYNC_KEY = "tef-user-data";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function unauthorized() {
  return new Response("Unauthorized", { status: 401, headers: CORS });
}

function isAuthorized(request, env) {
  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token === env.SYNC_SECRET;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (!isAuthorized(request, env)) return unauthorized();

    // GET — return saved data
    if (request.method === "GET") {
      const data = await env.TEF_SYNC.get(SYNC_KEY);
      return new Response(data ?? "{}", {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // PUT — save data
    if (request.method === "PUT") {
      const body = await request.text();
      await env.TEF_SYNC.put(SYNC_KEY, body);
      return new Response('{"ok":true}', {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405, headers: CORS });
  },
};
