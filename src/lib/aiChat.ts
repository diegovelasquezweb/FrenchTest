import { getSession } from "./auth";

const WORKER_URL = import.meta.env.VITE_SYNC_URL as string | undefined;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function authHeaders(): HeadersInit {
  const session = getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.token ?? ""}`,
  };
}

export async function checkAiKey(): Promise<boolean> {
  if (!WORKER_URL) return false;
  try {
    const res = await fetch(`${WORKER_URL}/aikey`, { headers: authHeaders() });
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
    headers: authHeaders(),
    body: JSON.stringify({ key }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error desconocido" })) as { error: string };
    throw new Error(err.error);
  }
}

export async function deleteAiKey(): Promise<void> {
  if (!WORKER_URL) return;
  await fetch(`${WORKER_URL}/aikey`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  if (!WORKER_URL) throw new Error("Worker not configured");
  const res = await fetch(`${WORKER_URL}/chat`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error del servidor" })) as { error: string };
    throw new Error(err.error);
  }
  const data = await res.json() as { content: string };
  return data.content;
}
