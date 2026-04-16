import { getSession } from "./auth";

const WORKER_URL = process.env.NEXT_PUBLIC_SYNC_URL;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function headers(): HeadersInit {
  const session = getSession();
  return { "Content-Type": "application/json", Authorization: `Bearer ${session?.token ?? ""}` };
}

export async function checkAiKey(): Promise<boolean> {
  if (!WORKER_URL) return false;
  try {
    const res = await fetch(`${WORKER_URL}/aikey`, { headers: headers() });
    if (!res.ok) return false;
    const data = await res.json() as { configured: boolean };
    return data.configured;
  } catch {
    return false;
  }
}

export async function saveAiKey(key: string): Promise<void> {
  if (!WORKER_URL) throw new Error("Worker not configured");
  const res = await fetch(`${WORKER_URL}/aikey`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ key }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur inconnue" })) as { error: string };
    throw new Error(err.error);
  }
}

export async function deleteAiKey(): Promise<void> {
  if (!WORKER_URL) return;
  await fetch(`${WORKER_URL}/aikey`, { method: "DELETE", headers: headers() });
}

export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  if (!WORKER_URL) throw new Error("Worker not configured");
  const res = await fetch(`${WORKER_URL}/chat`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur serveur" })) as { error: string };
    throw new Error(err.error);
  }
  const data = await res.json() as { content: string };
  return data.content;
}
