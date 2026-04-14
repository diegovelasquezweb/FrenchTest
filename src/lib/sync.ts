const URL   = import.meta.env.VITE_SYNC_URL   as string | undefined;
const TOKEN = import.meta.env.VITE_SYNC_TOKEN as string | undefined;

const TEF_PREFIX = "tef-";

function headers(): HeadersInit {
  return { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` };
}

/** Collect all tef-* keys from localStorage into one object. */
function collect(): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(TEF_PREFIX)) {
      out[key] = localStorage.getItem(key) ?? "";
    }
  }
  return out;
}

/** Write a server snapshot into localStorage (server wins on conflict). */
function applySnapshot(snapshot: Record<string, string>) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (key.startsWith(TEF_PREFIX)) {
      localStorage.setItem(key, value);
    }
  }
}

/** Pull data from the Worker and apply to localStorage. Server is source of truth. */
export async function syncPull(): Promise<void> {
  if (!URL || !TOKEN) return;
  try {
    const res = await fetch(URL, { headers: headers() });
    if (!res.ok) return;
    const snapshot = await res.json() as Record<string, string>;
    if (Object.keys(snapshot).length > 0) applySnapshot(snapshot);
  } catch {
    // offline — silently ignore
  }
}

/** Push current localStorage state to the Worker. */
export async function syncPush(): Promise<void> {
  if (!URL || !TOKEN) return;
  try {
    await fetch(URL, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(collect()),
    });
  } catch {
    // offline — silently ignore
  }
}

/** Debounced push — waits 2s of inactivity before sending. */
let pushTimer: ReturnType<typeof setTimeout> | null = null;
export function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { void syncPush(); }, 2000);
}
