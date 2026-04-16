import { useReducer, useCallback } from "react";
import type { OrthographeQuestion } from "../types";
import { AnswerState, QuizPhase } from "../types";
import { fisherYates } from "../lib/shuffle";

interface PhraseQuizState {
  phase: QuizPhase;
  questions: OrthographeQuestion[];
  currentIndex: number;
  score: number;
  selectedIndex: number | null;
  answerState: AnswerState;
  history: { question: OrthographeQuestion; picked: string; correct: boolean }[];
  everWrong: boolean;
}

type PhraseAction =
  | { type: "START" }
  | { type: "SELECT"; payload: number }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "HOME" };

const emptyState: PhraseQuizState = {
  phase: QuizPhase.Idle,
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedIndex: null,
  answerState: AnswerState.Idle,
  history: [],
  everWrong: false,
};

export interface PhraseQuizReturn {
  state: PhraseQuizState;
  startQuiz(): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(): void;
  goHome(): void;
  currentQuestion: OrthographeQuestion | null;
  progress: { index: number; total: number };
}

function shuffleQuestion(p: OrthographeQuestion): OrthographeQuestion {
  const tagged = p.options.map((option, idx) => ({ option, isCorrect: idx === p.correctIndex }));
  const shuffled = fisherYates(tagged, Math.random);
  const correctIndex = shuffled.findIndex((x) => x.isCorrect);
  return {
    options: shuffled.map((x) => x.option) as [string, string, string, string],
    correctIndex: (correctIndex >= 0 ? correctIndex : p.correctIndex) as 0 | 1 | 2 | 3,
    sentence: p.sentence,
    explanation: p.explanation,
  };
}

export function createPhraseQuiz(data: OrthographeQuestion[]): () => PhraseQuizReturn {
  function buildQuestions(count: number): OrthographeQuestion[] {
    return fisherYates([...data], Math.random).slice(0, count).map(shuffleQuestion);
  }

  function reducer(state: PhraseQuizState, action: PhraseAction): PhraseQuizState {
    switch (action.type) {
      case "HOME":
        return { ...emptyState };
      case "START":
      case "RESTART":
        return { ...emptyState, phase: QuizPhase.Answering, questions: buildQuestions(10) };
      case "SELECT": {
        if (state.phase === QuizPhase.Feedback) return { ...state, selectedIndex: action.payload };
        if (state.phase !== QuizPhase.Answering) return state;
        const question = state.questions[state.currentIndex];
        if (!question) return state;
        const isCorrect = action.payload === question.correctIndex;
        if (!isCorrect) return { ...state, selectedIndex: action.payload, everWrong: true };
        return {
          ...state,
          phase: QuizPhase.Feedback,
          selectedIndex: action.payload,
          answerState: AnswerState.Correct,
          score: state.everWrong ? state.score : state.score + 1,
          history: [...state.history, { question, picked: question.options[action.payload] ?? "", correct: !state.everWrong }],
        };
      }
      case "NEXT": {
        if (state.phase !== QuizPhase.Feedback) return state;
        const nextIndex = state.currentIndex + 1;
        if (nextIndex >= state.questions.length) return { ...state, phase: QuizPhase.Complete };
        return { ...state, phase: QuizPhase.Answering, currentIndex: nextIndex, selectedIndex: null, answerState: AnswerState.Idle, everWrong: false };
      }
    }
  }

  return function usePhraseQuiz(): PhraseQuizReturn {
    const [state, dispatch] = useReducer(reducer, emptyState);
    const startQuiz   = useCallback(() => dispatch({ type: "START" }), []);
    const selectAnswer = useCallback((i: number) => dispatch({ type: "SELECT", payload: i }), []);
    const nextQuestion = useCallback(() => dispatch({ type: "NEXT" }), []);
    const restartQuiz  = useCallback(() => dispatch({ type: "RESTART" }), []);
    const goHome       = useCallback(() => dispatch({ type: "HOME" }), []);
    const currentQuestion =
      state.phase === QuizPhase.Answering || state.phase === QuizPhase.Feedback
        ? (state.questions[state.currentIndex] ?? null)
        : null;
    return { state, startQuiz, selectAnswer, nextQuestion, restartQuiz, goHome, currentQuestion, progress: { index: state.currentIndex, total: state.questions.length } };
  };
}
