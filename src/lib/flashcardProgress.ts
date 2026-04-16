import type { Flashcard, CardProgress, FlashcardRating } from "../types";
import { getItem, setItem } from "./store";

export function loadProgress(storageKey: string): Record<string, CardProgress> {
  try {
    const raw = getItem(storageKey);
    return raw ? (JSON.parse(raw) as Record<string, CardProgress>) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, CardProgress>, storageKey: string): void {
  setItem(storageKey, JSON.stringify(progress));
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
  // All mastered — show everything in original order
  if (pending.length === 0) return [...cards];
  // Fixed order — same as source array, dominadas skipped
  return pending;
}

export function totalMastered(progress: Record<string, CardProgress>): number {
  return Object.values(progress).filter((p) => p.score === 2).length;
}
