import { useReducer, useCallback } from "react";
import type { AnswerState, QuizPhase } from "../types";
import { AnswerState as AnswerStateEnum, QuizPhase as QuizPhaseEnum } from "../types";
import type { PronominalQuestion } from "../lib/pronominalQuestions";
import { buildPronominalQuestions } from "../lib/pronominalQuestions";

interface PronominalQuizState {
  phase: QuizPhase;
  questions: PronominalQuestion[];
  currentIndex: number;
  score: number;
  selectedIndex: number | null;
  answerState: AnswerState;
  everWrong: boolean;
}

type PronominalQuizAction =
  | { type: "START" }
  | { type: "SELECT"; payload: number }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "HOME" };

const initialState: PronominalQuizState = {
  phase: QuizPhaseEnum.Idle,
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedIndex: null,
  answerState: AnswerStateEnum.Idle,
  everWrong: false,
};

const TOTAL_QUESTIONS = 10;

function reducer(state: PronominalQuizState, action: PronominalQuizAction): PronominalQuizState {
  switch (action.type) {
    case "HOME":
      return { ...initialState };
    case "START":
    case "RESTART":
      return {
        ...initialState,
        phase: QuizPhaseEnum.Answering,
        questions: buildPronominalQuestions(TOTAL_QUESTIONS, Math.random),
      };
    case "SELECT": {
      if (state.phase === QuizPhaseEnum.Feedback) {
        return { ...state, selectedIndex: action.payload };
      }
      if (state.phase !== QuizPhaseEnum.Answering) return state;
      const question = state.questions[state.currentIndex];
      if (!question) return state;
      const isCorrect = action.payload === question.correctIndex;

      if (!isCorrect) {
        return { ...state, selectedIndex: action.payload, everWrong: true };
      }

      return {
        ...state,
        phase: QuizPhaseEnum.Feedback,
        selectedIndex: action.payload,
        answerState: AnswerStateEnum.Correct,
        score: state.everWrong ? state.score : state.score + 1,
      };
    }
    case "NEXT": {
      if (state.phase !== QuizPhaseEnum.Feedback) return state;
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, phase: QuizPhaseEnum.Complete };
      }
      return {
        ...state,
        phase: QuizPhaseEnum.Answering,
        currentIndex: nextIndex,
        selectedIndex: null,
        answerState: AnswerStateEnum.Idle,
        everWrong: false,
      };
    }
  }
}

export interface UsePronominalQuizReturn {
  state: PronominalQuizState;
  startQuiz(): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(): void;
  goHome(): void;
  currentQuestion: PronominalQuestion | null;
  progress: { index: number; total: number };
}

export function usePronominalQuiz(): UsePronominalQuizReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startQuiz = useCallback(() => dispatch({ type: "START" }), []);
  const selectAnswer = useCallback((i: number) => dispatch({ type: "SELECT", payload: i }), []);
  const nextQuestion = useCallback(() => dispatch({ type: "NEXT" }), []);
  const restartQuiz = useCallback(() => dispatch({ type: "RESTART" }), []);
  const goHome = useCallback(() => dispatch({ type: "HOME" }), []);

  const currentQuestion =
    state.phase === QuizPhaseEnum.Answering || state.phase === QuizPhaseEnum.Feedback
      ? (state.questions[state.currentIndex] ?? null)
      : null;

  return {
    state,
    startQuiz,
    selectAnswer,
    nextQuestion,
    restartQuiz,
    goHome,
    currentQuestion,
    progress: { index: state.currentIndex, total: state.questions.length },
  };
}
