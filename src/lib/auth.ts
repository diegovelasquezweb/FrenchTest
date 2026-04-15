const WORKER_URL      = import.meta.env.VITE_SYNC_URL          as string | undefined;
const GITHUB_CLIENT   = import.meta.env.VITE_GITHUB_CLIENT_ID  as string | undefined;
const GOOGLE_CLIENT   = import.meta.env.VITE_GOOGLE_CLIENT_ID  as string | undefined;
const SESSION_KEY = "tef-session";

export interface Session {
  token: string;
  login: string;
}

export function getSession(): Session | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? (JSON.parse(stored) as Session) : null;
  } catch { return null; }
}

export function saveSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("tef-guest");
}

export function enterGuestMode(): void {
  localStorage.setItem("tef-guest", "1");
}

export function isGuest(): boolean {
  return localStorage.getItem("tef-guest") === "1";
}

export function redirectToGitHub(): void {
  if (!GITHUB_CLIENT) return;
  const params = new URLSearchParams({ client_id: GITHUB_CLIENT, scope: "read:user", state: "github" });
  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}

export function redirectToGoogle(): void {
  if (!GOOGLE_CLIENT) return;
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: "code",
    scope: "openid email profile",
    state: "google",
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCode(code: string, provider: string): Promise<Session> {
  if (!WORKER_URL) throw new Error("Worker URL not configured");
  const res = await fetch(`${WORKER_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      provider,
      redirectUri: `${window.location.origin}/auth/callback`,
    }),
  });
  if (!res.ok) throw new Error("Auth failed");
  const data = await res.json() as { token: string; login: string };
  const session: Session = { token: data.token, login: data.login };
  saveSession(session);
  return session;
}
