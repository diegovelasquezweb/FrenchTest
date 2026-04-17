"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { QuizPhase } from "@/src/types";

export type QuizHeaderData = {
  type: "quiz";
  title: string;
  score: number;
  questionNumber: number;
  total: number;
  phase: QuizPhase;
};

export type FlashcardHeaderData = {
  type: "flashcard";
  title: string;
  masteredCount: number;
  totalCards: number;
  onReset: () => void;
  variant?: "marathon";
  onFilter?: () => void;
  onSettings?: () => void;
  phase: string;
};

export type HeaderData = QuizHeaderData | FlashcardHeaderData | { type: "none" };

// Split into two contexts so pages only subscribe to the stable setter,
// not to the data — prevents the set → re-render → set infinite loop.
const HeaderSetCtx = createContext<(d: HeaderData) => void>(() => {});
const HeaderGetCtx = createContext<HeaderData>({ type: "none" });

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [data, set] = useState<HeaderData>({ type: "none" });
  return (
    <HeaderSetCtx.Provider value={set}>
      <HeaderGetCtx.Provider value={data}>
        {children}
      </HeaderGetCtx.Provider>
    </HeaderSetCtx.Provider>
  );
}

export function useHeaderData(): HeaderData {
  return useContext(HeaderGetCtx);
}

function useSetHeader(data: HeaderData) {
  const set = useContext(HeaderSetCtx);
  const ref = useRef(data);
  ref.current = data;
  useEffect(() => { set(ref.current); });
  useEffect(() => () => { set({ type: "none" }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useSetQuizHeader(
  title: string,
  quiz: { state: { phase: QuizPhase; score: number }; progress: { index: number; total: number } },
) {
  useSetHeader({
    type: "quiz",
    title,
    score: quiz.state.score,
    questionNumber: quiz.progress.index + 1,
    total: quiz.progress.total,
    phase: quiz.state.phase,
  });
}

export function useSetFlashcardHeader(
  title: string,
  deck: { masteredCount: number; totalCards: number; restart: () => void; state: { phase: string } },
) {
  useSetHeader({
    type: "flashcard",
    title,
    masteredCount: deck.masteredCount,
    totalCards: deck.totalCards,
    onReset: deck.restart,
    phase: deck.state.phase,
  });
}

export function useSetMarathonHeader(
  deck: { masteredCount: number; totalCards: number; reset: () => void; state: { phase: string } },
  callbacks: { onFilter: () => void; onSettings: () => void },
) {
  useSetHeader({
    type: "flashcard",
    variant: "marathon",
    title: "Marathon",
    masteredCount: deck.masteredCount,
    totalCards: deck.totalCards,
    onReset: deck.reset,
    onFilter: callbacks.onFilter,
    onSettings: callbacks.onSettings,
    phase: deck.state.phase,
  });
}
