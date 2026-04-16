import { getSession, isGuest } from "./auth";

const WORKER_URL = process.env.NEXT_PUBLIC_SYNC_URL;
const TEF_PREFIX = "tef-";

const cache: Record<string, string> = {};

const listeners = new Set<() => void>();

export function subscribeToStore(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notifyListeners(): void {
  listeners.forEach(fn => fn());
}

export function getItem(key: string): string | null {
  if (isGuest()) return localStorage.getItem(key);
  return Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : null;
}

export function setItem(key: string, value: string): void {
  if (isGuest()) {
    localStorage.setItem(key, value);
    notifyListeners();
    return;
  }
  cache[key] = value;
  notifyListeners();
  schedulePush();
}

function authHeaders(): HeadersInit {
  const session = getSession();
  return { "Content-Type": "application/json", Authorization: `Bearer ${session?.token ?? ""}` };
}

export async function loadStore(): Promise<void> {
  if (!WORKER_URL) return;
  try {
    const res = await fetch(WORKER_URL + "/", { headers: authHeaders() });
    if (!res.ok) return;
    const snapshot = await res.json() as Record<string, string>;
    const workerKeys = Object.keys(snapshot).filter(k => k.startsWith(TEF_PREFIX));

    let cacheUpdated = false;
    for (const [key, value] of Object.entries(snapshot)) {
      if (key.startsWith(TEF_PREFIX)) { cache[key] = value; cacheUpdated = true; }
    }

    // One-time migration: if Worker KV is empty, move existing localStorage data to Worker.
    // After this runs once, all data lives in Worker KV and localStorage is no longer used.
    if (workerKeys.length === 0) {
      let migrated = false;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(TEF_PREFIX) && key !== "tef-session" && key !== "tef-guest") {
          const val = localStorage.getItem(key);
          if (val) { cache[key] = val; migrated = true; }
        }
      }
      if (migrated) { cacheUpdated = true; void pushStore(); }
    }

    if (cacheUpdated) notifyListeners();
  } catch {
    // offline
  }
}

export async function pushStore(): Promise<void> {
  if (!WORKER_URL) return;
  try {
    const body: Record<string, string> = {};
    for (const [key, value] of Object.entries(cache)) {
      if (key.startsWith(TEF_PREFIX)) body[key] = value;
    }
    await fetch(WORKER_URL + "/", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // offline
  }
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;
export function schedulePush(): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { void pushStore(); }, 500);
}
