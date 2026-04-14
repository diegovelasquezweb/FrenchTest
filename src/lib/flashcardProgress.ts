import type { Flashcard, CardProgress, FlashcardRating } from "../types";
import { fisherYates } from "./shuffle";

export function loadProgress(storageKey: string): Record<string, CardProgress> {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Record<string, CardProgress>) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, CardProgress>, storageKey: string): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function applyRating(
  progress: Record<string, CardProgress>,
  id: string,
  rating: FlashcardRating
): Record<string, CardProgress> {
  const current: CardProgress = progress[id] ?? { score: 0, consecutiveCorrect: 0, lastSeen: 0 };
  let { score, consecutiveCorrect } = current;

  if (rating === 2) {
    consecutiveCorrect += 1;
    score = 2;
  } else if (rating === 1) {
    consecutiveCorrect = 0;
    score = 1;
  } else {
    consecutiveCorrect = 0;
    score = 0;
  }

  return {
    ...progress,
    [id]: { score: score as 0 | 1 | 2, consecutiveCorrect, lastSeen: Date.now() },
  };
}

export function buildDeck(
  cards: Flashcard[],
  progress: Record<string, CardProgress>
): Flashcard[] {
  const pending = cards.filter((c) => (progress[c.id]?.score ?? 0) < 2);

  // If everything is mastered, show all again so the user can still practice
  if (pending.length === 0) {
    return fisherYates([...cards], Math.random);
  }

  return fisherYates(pending, Math.random);
}

export function totalMastered(progress: Record<string, CardProgress>): number {
  return Object.values(progress).filter((p) => p.score === 2).length;
}
