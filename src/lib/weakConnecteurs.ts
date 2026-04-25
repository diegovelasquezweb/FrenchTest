import { getItem, setItem } from "./store";

const KEY = "tef-weak-connecteurs";

export function getWeakConnecteurs(): Set<string> {
  try {
    const stored = getItem(KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored) as string[]);
  } catch {
    return new Set();
  }
}

export function saveWeakConnecteurs(ids: Set<string>): void {
  setItem(KEY, JSON.stringify([...ids]));
}
