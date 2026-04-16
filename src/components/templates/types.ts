import type { AnswerState, QuizPhase, Flashcard, FlashcardRating } from "@/src/types";

export type { AnswerState, QuizPhase };

/** Minimal interface a quiz hook must satisfy to work with QuizTemplate. */
export interface QuizLike<Q> {
  state: {
    phase: QuizPhase;
    answerState: AnswerState;
    selectedIndex: number | null;
    score: number;
  };
  currentQuestion: Q | null;
  progress: { index: number; total: number };
  startQuiz(): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(): void;
  goHome(): void;
}

export interface RenderCardArgs<Q> {
  question: Q;
  answerState: AnswerState;
  selectedIndex: number | null;
  questionNumber: number;
  total: number;
  isWeak?: boolean;
  onToggleWeak?: () => void;
}

export interface RenderResultArgs {
  score: number;
  total: number;
  onRestart: () => void;
  onHome: () => void;
}

/** Build the default SR announcement string. Works for any question with options + correctIndex. */
export function defaultAnnouncement(
  question: { options: string[]; correctIndex: number },
  answerState: AnswerState,
): string {
  if (answerState === "correct") return "Correct !";
  const correct = question.options[question.correctIndex] ?? "";
  return `Incorrect. La bonne réponse est ${correct}.`;
}

/** Minimal interface a flashcard deck must satisfy for FlashcardCategoryTemplate. */
export interface FlashcardDeckLike {
  state: {
    phase: "idle" | "session" | "complete";
    sessionResults: { id: string; rating: FlashcardRating }[];
    deck: Flashcard[];
  };
  currentCard: Flashcard | null;
  progress: { index: number; total: number };
  masteredCount: number;
  totalCards: number;
  startSession(): void;
  rate(r: FlashcardRating): void;
  back(): void;
  skip(): void;
  restart(): void;
  goHome(): void;
}

/** Varying copy for FavoriteCollectionTemplate idle state. */
export interface FavoriteCollectionCopy {
  emptyHeading: string;
  emptyDescription: string;
  countLabel: (count: number) => string;
}
