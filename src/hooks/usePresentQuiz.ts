import { useReducer, useCallback } from "react";
import type { PresentQuestion } from "../types";
import { AnswerState, QuizPhase } from "../types";
import { VERBS } from "../data/verbs";
import { buildPresentQuestion } from "../lib/presentQuestions";
import { fisherYates } from "../lib/shuffle";

interface PresentQuizState {
  phase: QuizPhase;
  questions: PresentQuestion[];
  currentIndex: number;
  score: number;
  selectedIndex: number | null;
  answerState: AnswerState;
  history: { question: PresentQuestion; picked: string; correct: boolean }[];
  everWrong: boolean;
}

type PresentAction =
  | { type: "START" }
  | { type: "SELECT"; payload: number }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "HOME" };

const initialState: PresentQuizState = {
  phase: QuizPhase.Idle,
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedIndex: null,
  answerState: AnswerState.Idle,
  history: [],
  everWrong: false,
};

function buildQuestions(count: number): PresentQuestion[] {
  const shuffled = fisherYates([...VERBS], Math.random);
  const questions: PresentQuestion[] = [];
  for (const verb of shuffled) {
    if (questions.length >= count) break;
    const q = buildPresentQuestion(verb, Math.random);
    if (q) questions.push(q);
  }
  return questions;
}

function reducer(state: PresentQuizState, action: PresentAction): PresentQuizState {
  switch (action.type) {
    case "HOME":
      return { ...initialState };
    case "START":
    case "RESTART":
      return { ...initialState, phase: QuizPhase.Answering, questions: buildQuestions(10) };
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
            question,
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

export interface UsePresentQuizReturn {
  state: PresentQuizState;
  startQuiz(): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(): void;
  goHome(): void;
  currentQuestion: PresentQuestion | null;
  progress: { index: number; total: number };
}

export function usePresentQuiz(): UsePresentQuizReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startQuiz = useCallback(() => dispatch({ type: "START" }), []);
  const selectAnswer = useCallback((i: number) => dispatch({ type: "SELECT", payload: i }), []);
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
