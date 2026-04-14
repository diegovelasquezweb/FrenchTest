const WORKER_URL = import.meta.env.VITE_SYNC_URL   as string | undefined;
const TOKEN      = import.meta.env.VITE_SYNC_TOKEN as string | undefined;
const TEF_PREFIX = "tef-";

/** In-memory key-value store. Replaces localStorage for all tef-* keys. */
const cache: Record<string, string> = {};

function headers(): HeadersInit {
  return { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` };
}

/** Read a value from the in-memory cache. */
export function getItem(key: string): string | null {
  return Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : null;
}

/** Write a value to the in-memory cache and schedule a push to the Worker. */
export function setItem(key: string, value: string): void {
  cache[key] = value;
  schedulePush();
}

/** Load the Worker snapshot into the cache. Call once before the app renders. */
export async function loadStore(): Promise<void> {
  if (!WORKER_URL || !TOKEN) return;
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
  if (!WORKER_URL || !TOKEN) return;
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

/** Debounced push — waits 2s of inactivity before sending. */
let pushTimer: ReturnType<typeof setTimeout> | null = null;
export function schedulePush(): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { void pushStore(); }, 500);
}
