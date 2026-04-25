import { getItem, setItem } from "./store";

const KEY = "tef-saved-productions";

export type SavedProduction = {
  id: string;
  promptId: string;
  promptTitle: string;
  section: "A" | "B";
  text: string;
  wordCount: number;
  globalScore: number;
  createdAt: number;
  durationUsedSeconds: number;
};

export function getSavedProductions(): SavedProduction[] {
  try {
    const stored = getItem(KEY);
    if (!stored) return [];
    return JSON.parse(stored) as SavedProduction[];
  } catch {
    return [];
  }
}

export function saveProduction(p: SavedProduction): void {
  const all = getSavedProductions();
  all.unshift(p);
  setItem(KEY, JSON.stringify(all.slice(0, 50)));
}

export function deleteProduction(id: string): void {
  const all = getSavedProductions().filter((p) => p.id !== id);
  setItem(KEY, JSON.stringify(all));
}
