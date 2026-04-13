import { useReducer, useCallback } from "react";
import type { Verb, QuizQuestion, QuizState } from "../types";
import { AnswerState, QuizPhase } from "../types";
import { fisherYates } from "../lib/shuffle";
import { generateDistractors } from "../lib/distractors";

type QuizAction =
  | { type: "START" }
  | { type: "SELECT"; payload: number }
  | { type: "NEXT" }
  | { type: "RESTART" };

function buildQuestions(
  verbs: Verb[],
  count: number,
  rng: () => number
): QuizQuestion[] {
  const shuffled = fisherYates(verbs, rng);
  const chosen = shuffled.slice(0, count);
  return chosen.map((verb) => {
    const distractors = generateDistractors(verb, verbs, rng);
    const options = fisherYates([verb.participle, ...distractors], rng);
    const correctIndex = options.indexOf(verb.participle);
    return { verb, options, correctIndex };
  });
}

const initialState: QuizState = {
  phase: QuizPhase.Idle,
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedIndex: null,
  answerState: AnswerState.Idle,
  history: [],
};

function makeReducer(verbs: Verb[], questionCount: number) {
  return function reducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
      case "START":
      case "RESTART": {
        return {
          ...initialState,
          phase: QuizPhase.Answering,
          questions: buildQuestions(verbs, questionCount, Math.random),
        };
      }
      case "SELECT": {
        if (state.phase !== QuizPhase.Answering) return state;
        const question = state.questions[state.currentIndex];
        if (!question) return state;
        const isCorrect = action.payload === question.correctIndex;
        return {
          ...state,
          phase: QuizPhase.Feedback,
          selectedIndex: action.payload,
          answerState: isCorrect ? AnswerState.Correct : AnswerState.Wrong,
          score: isCorrect ? state.score + 1 : state.score,
          history: [
            ...state.history,
            {
              verb: question.verb,
              picked: question.options[action.payload] ?? "",
              correct: isCorrect,
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
        };
      }
    }
  };
}

export interface UseQuizReturn {
  state: QuizState;
  startQuiz(): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(): void;
  currentQuestion: QuizQuestion | null;
  progress: { index: number; total: number };
}

export function useQuiz(verbs: Verb[], questionCount = 10): UseQuizReturn {
  const [state, dispatch] = useReducer(makeReducer(verbs, questionCount), initialState);

  const startQuiz = useCallback(() => dispatch({ type: "START" }), []);
  const selectAnswer = useCallback(
    (index: number) => dispatch({ type: "SELECT", payload: index }),
    []
  );
  const nextQuestion = useCallback(() => dispatch({ type: "NEXT" }), []);
  const restartQuiz = useCallback(() => dispatch({ type: "RESTART" }), []);

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
    currentQuestion,
    progress: { index: state.currentIndex, total: state.questions.length },
  };
}
