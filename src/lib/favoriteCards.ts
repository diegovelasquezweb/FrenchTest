import { getItem, setItem } from "./store";

const KEY = "tef-favorite-cards";

export function getFavoriteCards(): Set<string> {
  try {
    const stored = getItem(KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored) as string[]);
  } catch {
    return new Set();
  }
}

export function saveFavoriteCards(ids: Set<string>): void {
  setItem(KEY, JSON.stringify([...ids]));
}
