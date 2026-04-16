import { useCallback, useReducer } from "react";
import type { OrthographeQuestion } from "../types";
import { AnswerState, QuizPhase } from "../types";
import { ARTICLES_PHRASES } from "../data/articlesPhrases";
import { fisherYates } from "../lib/shuffle";

interface ArticlesQuizState {
  phase: QuizPhase;
  questions: OrthographeQuestion[];
  currentIndex: number;
  score: number;
  selectedIndex: number | null;
  answerState: AnswerState;
  history: { question: OrthographeQuestion; picked: string; correct: boolean }[];
  everWrong: boolean;
}

type ArticlesAction =
  | { type: "START" }
  | { type: "SELECT"; payload: number }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "HOME" };

const initialState: ArticlesQuizState = {
  phase: QuizPhase.Idle,
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedIndex: null,
  answerState: AnswerState.Idle,
  history: [],
  everWrong: false,
};

function buildQuestions(count: number): OrthographeQuestion[] {
  const shuffled = fisherYates([...ARTICLES_PHRASES], Math.random);
  return shuffled.slice(0, count).map((p) => ({
    ...(() => {
      const optionsWithMeta = p.options.map((option, idx) => ({ option, isCorrect: idx === p.correctIndex }));
      const shuffledOptions = fisherYates(optionsWithMeta, Math.random);
      const correctIndex = shuffledOptions.findIndex((x) => x.isCorrect);
      return {
        options: shuffledOptions.map((x) => x.option) as [string, string, string, string],
        correctIndex: (correctIndex >= 0 ? correctIndex : p.correctIndex) as 0 | 1 | 2 | 3,
      };
    })(),
    sentence: p.sentence,
    explanation: p.explanation,
  }));
}

function reducer(state: ArticlesQuizState, action: ArticlesAction): ArticlesQuizState {
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

export interface UseArticlesQuizReturn {
  state: ArticlesQuizState;
  startQuiz(): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(): void;
  goHome(): void;
  currentQuestion: OrthographeQuestion | null;
  progress: { index: number; total: number };
}

export function useArticlesQuiz(): UseArticlesQuizReturn {
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

  return { state, startQuiz, selectAnswer, nextQuestion, restartQuiz, goHome, currentQuestion, progress: { index: state.currentIndex, total: state.questions.length } };
}

