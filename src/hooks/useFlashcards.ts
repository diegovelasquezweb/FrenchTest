import { useReducer, useCallback, useEffect } from "react";
import type { Flashcard, CardProgress, FlashcardRating } from "../types";
import { FLASHCARDS } from "../data/flashcards";
import { loadProgress, saveProgress, applyRating, buildDeck, totalMastered } from "../lib/flashcardProgress";

const SESSION_SIZE = 15;

interface FlashcardsState {
  phase: "idle" | "session" | "complete";
  deck: Flashcard[];
  currentIndex: number;
  revealed: boolean;
  sessionResults: { id: string; rating: FlashcardRating }[];
  progress: Record<string, CardProgress>;
}

type FlashcardsAction =
  | { type: "START" }
  | { type: "REVEAL" }
  | { type: "RATE"; payload: FlashcardRating }
  | { type: "RESTART" }
  | { type: "HOME" };

function makeInitialState(): FlashcardsState {
  return {
    phase: "idle",
    deck: [],
    currentIndex: 0,
    revealed: false,
    sessionResults: [],
    progress: loadProgress(),
  };
}

function reducer(state: FlashcardsState, action: FlashcardsAction): FlashcardsState {
  switch (action.type) {
    case "HOME":
      return { ...makeInitialState(), progress: state.progress };
    case "START":
    case "RESTART":
      return {
        ...state,
        phase: "session",
        deck: buildDeck(FLASHCARDS, state.progress, SESSION_SIZE),
        currentIndex: 0,
        revealed: false,
        sessionResults: [],
      };
    case "REVEAL":
      if (state.phase !== "session") return state;
      return { ...state, revealed: true };
    case "RATE": {
      if (state.phase !== "session" || !state.revealed) return state;
      const card = state.deck[state.currentIndex];
      if (!card) return state;

      const newProgress = applyRating(state.progress, card.id, action.payload);
      const newResults = [...state.sessionResults, { id: card.id, rating: action.payload }];
      const nextIndex = state.currentIndex + 1;

      if (nextIndex >= state.deck.length) {
        return {
          ...state,
          progress: newProgress,
          sessionResults: newResults,
          phase: "complete",
        };
      }

      return {
        ...state,
        progress: newProgress,
        sessionResults: newResults,
        currentIndex: nextIndex,
        revealed: false,
      };
    }
  }
}

export interface UseFlashcardsReturn {
  state: FlashcardsState;
  currentCard: Flashcard | null;
  progress: { index: number; total: number };
  masteredCount: number;
  totalCards: number;
  startSession(): void;
  reveal(): void;
  rate(r: FlashcardRating): void;
  restart(): void;
  goHome(): void;
}

export function useFlashcards(): UseFlashcardsReturn {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);

  // Persist progress to localStorage whenever it changes
  useEffect(() => {
    saveProgress(state.progress);
  }, [state.progress]);

  const startSession = useCallback(() => dispatch({ type: "START" }), []);
  const reveal = useCallback(() => dispatch({ type: "REVEAL" }), []);
  const rate = useCallback((r: FlashcardRating) => dispatch({ type: "RATE", payload: r }), []);
  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);
  const goHome = useCallback(() => dispatch({ type: "HOME" }), []);

  const currentCard =
    state.phase === "session" ? (state.deck[state.currentIndex] ?? null) : null;

  return {
    state,
    currentCard,
    progress: { index: state.currentIndex, total: state.deck.length },
    masteredCount: totalMastered(state.progress),
    totalCards: FLASHCARDS.length,
    startSession,
    reveal,
    rate,
    restart,
    goHome,
  };
}
