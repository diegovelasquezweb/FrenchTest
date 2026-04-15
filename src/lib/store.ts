import { getSession, isGuest } from "./auth";

const WORKER_URL = import.meta.env.VITE_SYNC_URL as string | undefined;
const TEF_PREFIX = "tef-";

/** In-memory cache — used for authenticated users (Worker-backed). */
const cache: Record<string, string> = {};

function headers(): HeadersInit {
  const session = getSession();
  return { "Content-Type": "application/json", Authorization: `Bearer ${session?.token ?? ""}` };
}

/** Read a value. Guests use localStorage; authenticated users use in-memory cache. */
export function getItem(key: string): string | null {
  if (isGuest()) return localStorage.getItem(key);
  return Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : null;
}

/** Write a value. Guests persist to localStorage; authenticated users push to Worker. */
export function setItem(key: string, value: string): void {
  if (isGuest()) {
    localStorage.setItem(key, value);
    return;
  }
  cache[key] = value;
  schedulePush();
}

/** Load the Worker snapshot into cache. Only called for authenticated users. */
export async function loadStore(): Promise<void> {
  if (!WORKER_URL) return;
  try {
    const res = await fetch(WORKER_URL, { headers: headers() });
    if (!res.ok) return;
    const snapshot = await res.json() as Record<string, string>;
    for (const [key, value] of Object.entries(snapshot)) {
      if (key.startsWith(TEF_PREFIX)) cache[key] = value;
    }
  } catch {
    // offline — start with empty in-memory state
  }
}

/** Push the full cache to the Worker. */
export async function pushStore(): Promise<void> {
  if (!WORKER_URL) return;
  try {
    const body: Record<string, string> = {};
    for (const [key, value] of Object.entries(cache)) {
      if (key.startsWith(TEF_PREFIX)) body[key] = value;
    }
    await fetch(WORKER_URL, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // offline — silently ignore
  }
}

/** Debounced push — waits 500ms of inactivity before sending. */
let pushTimer: ReturnType<typeof setTimeout> | null = null;
export function schedulePush(): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { void pushStore(); }, 500);
}
