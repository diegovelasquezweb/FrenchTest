const WORKER_URL    = import.meta.env.VITE_SYNC_URL         as string | undefined;
const GITHUB_CLIENT = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined;
const GOOGLE_CLIENT = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const SESSION_KEY = "tef-session";

export interface Session {
  token: string;
  login: string;
}

let _session: Session | null = null;

export function getSession(): Session | null { return _session; }

export function setSession(s: Session): void {
  _session = s;
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export function clearSession(): void {
  _session = null;
  localStorage.removeItem(SESSION_KEY);
}

export function restoreSession(): Session | null {
  if (_session) return _session;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.token || !parsed.login) return null;
    _session = parsed;
    return _session;
  } catch {
    return null;
  }
}

export function isGuest(): boolean {
  return localStorage.getItem("tef-guest") === "1";
}

export function enterGuestMode(): void {
  localStorage.setItem("tef-guest", "1");
}

export function clearGuestMode(): void {
  localStorage.removeItem("tef-guest");
}

export async function logout(): Promise<void> {
  const token = _session?.token;
  clearSession();
  clearGuestMode();
  if (!WORKER_URL || !token) return;
  try {
    await fetch(`${WORKER_URL}/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // offline — session already cleared
  }
}

export function redirectToGitHub(): void {
  if (!GITHUB_CLIENT) return;
  const nonce = crypto.randomUUID();
  sessionStorage.setItem("oauth-nonce", nonce);
  sessionStorage.setItem("oauth-provider", "github");
  const params = new URLSearchParams({ client_id: GITHUB_CLIENT, scope: "read:user", state: nonce });
  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}

export function redirectToGoogle(): void {
  if (!GOOGLE_CLIENT) return;
  const nonce = crypto.randomUUID();
  sessionStorage.setItem("oauth-nonce", nonce);
  sessionStorage.setItem("oauth-provider", "google");
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: "code",
    scope: "openid email profile",
    state: nonce,
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export function validateOAuthCallback(state: string): string {
  const nonce    = sessionStorage.getItem("oauth-nonce");
  const provider = sessionStorage.getItem("oauth-provider");
  sessionStorage.removeItem("oauth-nonce");
  sessionStorage.removeItem("oauth-provider");
  if (!nonce || state !== nonce) throw new Error("CSRF validation failed");
  return provider ?? "github";
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
  setSession(session);
  return session;
}
