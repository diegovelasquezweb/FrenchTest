const KEY = "tef-favorite-cards";

export function getFavoriteCards(): Set<string> {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored) as string[]);
  } catch {
    return new Set();
  }
}

export function saveFavoriteCards(ids: Set<string>): void {
  localStorage.setItem(KEY, JSON.stringify([...ids]));
}
