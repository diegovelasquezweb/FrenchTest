import type { Flashcard, CardProgress, FlashcardRating } from "../types";
import { fisherYates } from "./shuffle";

const STORAGE_KEY = "tef-flashcard-progress";

export function loadProgress(): Record<string, CardProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, CardProgress>) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, CardProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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
    score = consecutiveCorrect >= 2 ? 2 : Math.min(score + 1, 1) as 0 | 1;
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
  const byAge = (a: Flashcard, b: Flashcard) =>
    (progress[a.id]?.lastSeen ?? 0) - (progress[b.id]?.lastSeen ?? 0);

  const score0 = cards.filter((c) => (progress[c.id]?.score ?? 0) === 0);
  const score1 = cards.filter((c) => (progress[c.id]?.score ?? 0) === 1);

  const pending = [
    ...fisherYates(score0.sort(byAge), Math.random),
    ...fisherYates(score1.sort(byAge), Math.random),
  ];

  // If everything is mastered, show all again so the user can still practice
  if (pending.length === 0) {
    return fisherYates([...cards], Math.random);
  }

  return pending;
}

export function totalMastered(progress: Record<string, CardProgress>): number {
  return Object.values(progress).filter((p) => p.score === 2).length;
}
