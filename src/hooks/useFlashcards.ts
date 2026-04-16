import { useReducer, useCallback, useEffect } from "react";
import type { Flashcard, CardProgress, FlashcardRating } from "../types";
import { loadProgress, saveProgress, applyRating, buildDeck, totalMastered } from "../lib/flashcardProgress";
import { fisherYates } from "../lib/shuffle";


interface FlashcardsState {
  phase: "idle" | "session" | "complete";
  deck: Flashcard[];
  currentIndex: number;
  sessionResults: { id: string; rating: FlashcardRating }[];
  progress: Record<string, CardProgress>;
}

type FlashcardsAction =
  | { type: "START" }
  | { type: "RATE"; payload: FlashcardRating }
  | { type: "BACK" }
  | { type: "SKIP" }
  | { type: "RESTART" }
  | { type: "RESET" }
  | { type: "HOME" };

function makeInitialState(storageKey: string): FlashcardsState {
  return {
    phase: "idle",
    deck: [],
    currentIndex: 0,
    sessionResults: [],
    progress: loadProgress(storageKey),
  };
}

function makeReducer(cards: Flashcard[], storageKey: string, randomize: boolean) {
  function makeDeck(progress: Record<string, CardProgress>): Flashcard[] {
    return randomize ? fisherYates([...cards], Math.random) : buildDeck(cards, progress);
  }
  return function reducer(state: FlashcardsState, action: FlashcardsAction): FlashcardsState {
    switch (action.type) {
      case "HOME":
        return { ...makeInitialState(storageKey), progress: state.progress };
      case "RESET": {
        const emptyProgress: Record<string, CardProgress> = {};
        return {
          phase: "session",
          deck: makeDeck(emptyProgress),
          currentIndex: 0,
          sessionResults: [],
          progress: emptyProgress,
        };
      }
      case "START":
      case "RESTART":
        return {
          ...state,
          phase: "session",
          deck: makeDeck(state.progress),
          currentIndex: 0,
          sessionResults: [],
        };
      case "BACK": {
        if (state.phase !== "session" || state.currentIndex === 0) return state;
        return {
          ...state,
          currentIndex: state.currentIndex - 1,
          sessionResults: state.sessionResults.slice(0, -1),
        };
      }
      case "SKIP": {
        if (state.phase !== "session") return state;
        const nextIndex = state.currentIndex + 1;
        if (nextIndex >= state.deck.length) {
          return { ...state, phase: "complete" };
        }
        return { ...state, currentIndex: nextIndex };
      }
      case "RATE": {
        if (state.phase !== "session") return state;
        const card = state.deck[state.currentIndex];
        if (!card) return state;

        const newProgress = applyRating(state.progress, card.id, action.payload);
        const newResults = [...state.sessionResults, { id: card.id, rating: action.payload }];
        const nextIndex = state.currentIndex + 1;

        if (nextIndex >= state.deck.length) {
          return { ...state, progress: newProgress, sessionResults: newResults, phase: "complete" };
        }

        return { ...state, progress: newProgress, sessionResults: newResults, currentIndex: nextIndex };
      }
    }
  };
}

export interface UseFlashcardsReturn {
  state: FlashcardsState;
  currentCard: Flashcard | null;
  progress: { index: number; total: number };
  masteredCount: number;
  totalCards: number;
  startSession(): void;
  rate(r: FlashcardRating): void;
  back(): void;
  skip(): void;
  restart(): void;
  reset(): void;
  goHome(): void;
}

export function useFlashcards(cards: Flashcard[], storageKey: string, randomize = false): UseFlashcardsReturn {
  const reducer = makeReducer(cards, storageKey, randomize);
  const [state, dispatch] = useReducer(reducer, undefined, () => makeInitialState(storageKey));

  useEffect(() => {
    saveProgress(state.progress, storageKey);
  }, [state.progress, storageKey]);

  const startSession = useCallback(() => dispatch({ type: "START" }), []);
  const rate = useCallback((r: FlashcardRating) => dispatch({ type: "RATE", payload: r }), []);
  const back = useCallback(() => dispatch({ type: "BACK" }), []);
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);
  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const goHome = useCallback(() => dispatch({ type: "HOME" }), []);

  const currentCard =
    state.phase === "session" ? (state.deck[state.currentIndex] ?? null) : null;

  return {
    state,
    currentCard,
    progress: { index: state.currentIndex, total: state.deck.length },
    masteredCount: totalMastered(state.progress),
    totalCards: cards.length,
    startSession,
    rate,
    back,
    skip,
    restart,
    reset,
    goHome,
  };
}
