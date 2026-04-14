import { getItem, setItem } from "./store";

const KEY = "tef-weak-verbs";

export function getWeakVerbs(): Set<string> {
  try {
    const stored = getItem(KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored) as string[]);
  } catch {
    return new Set();
  }
}

export function saveWeakVerbs(verbs: Set<string>): void {
  setItem(KEY, JSON.stringify([...verbs]));
}
