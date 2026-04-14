import { useReducer, useCallback } from "react";
import type { Verb, ConditionnelQuestion } from "../types";
import { AnswerState, QuizPhase } from "../types";
import { VERBS } from "../data/verbs";
import { buildConditionnelQuestions } from "../lib/conditionnelQuestions";

interface ConditionnelQuizState {
  phase: QuizPhase;
  questions: ConditionnelQuestion[];
  currentIndex: number;
  score: number;
  selectedIndex: number | null;
  answerState: AnswerState;
  history: { verb: Verb; picked: string; correct: boolean }[];
  everWrong: boolean;
}

type ConditionnelAction =
  | { type: "START" }
  | { type: "SELECT"; payload: number }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "HOME" };

const initialState: ConditionnelQuizState = {
  phase: QuizPhase.Idle,
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedIndex: null,
  answerState: AnswerState.Idle,
  history: [],
  everWrong: false,
};

function buildQuestions(count: number): ConditionnelQuestion[] {
  return buildConditionnelQuestions(VERBS, count, Math.random);
}

function reducer(state: ConditionnelQuizState, action: ConditionnelAction): ConditionnelQuizState {
  switch (action.type) {
    case "HOME": {
      return { ...initialState };
    }
    case "START":
    case "RESTART": {
      return {
        ...initialState,
        phase: QuizPhase.Answering,
        questions: buildQuestions(10),
      };
    }
    case "SELECT": {
      if (state.phase === QuizPhase.Feedback) {
        return { ...state, selectedIndex: action.payload };
      }
      if (state.phase !== QuizPhase.Answering) return state;
      const question = state.questions[state.currentIndex];
      if (!question) return state;
      const isCorrect = action.payload === question.correctIndex;

      if (!isCorrect) {
        return { ...state, selectedIndex: action.payload, everWrong: true };
      }

      return {
        ...state,
        phase: QuizPhase.Feedback,
        selectedIndex: action.payload,
        answerState: AnswerState.Correct,
        score: state.everWrong ? state.score : state.score + 1,
        history: [
          ...state.history,
          {
            verb: question.verb,
            picked: question.options[action.payload] ?? "",
            correct: !state.everWrong,
          },
        ],
      };
    }
    case "NEXT": {
      if (state.phase !== QuizPhase.Feedback) return state;
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, phase: QuizPhase.Complete };
      }
      return {
        ...state,
        phase: QuizPhase.Answering,
        currentIndex: nextIndex,
        selectedIndex: null,
        answerState: AnswerState.Idle,
        everWrong: false,
      };
    }
  }
}

export interface UseConditionnelQuizReturn {
  state: ConditionnelQuizState;
  startQuiz(): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(): void;
  goHome(): void;
  currentQuestion: ConditionnelQuestion | null;
  progress: { index: number; total: number };
}

export function useConditionnelQuiz(): UseConditionnelQuizReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startQuiz = useCallback(() => dispatch({ type: "START" }), []);
  const selectAnswer = useCallback((index: number) => dispatch({ type: "SELECT", payload: index }), []);
  const nextQuestion = useCallback(() => dispatch({ type: "NEXT" }), []);
  const restartQuiz = useCallback(() => dispatch({ type: "RESTART" }), []);
  const goHome = useCallback(() => dispatch({ type: "HOME" }), []);

  const currentQuestion =
    state.phase === QuizPhase.Answering || state.phase === QuizPhase.Feedback
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
