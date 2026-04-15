import { useReducer, useCallback, useRef } from "react";
import type { Verb, QuizQuestion, QuizState } from "../types";
import { AnswerState, QuizPhase } from "../types";
import { fisherYates } from "../lib/shuffle";
import { generateDistractors } from "../lib/distractors";

type QuizAction =
  | { type: "START"; verbs: Verb[] }
  | { type: "SELECT"; payload: number }
  | { type: "NEXT" }
  | { type: "RESTART"; verbs: Verb[] }
  | { type: "HOME" };

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
  everWrong: false,
};

function makeReducer(questionCount: number) {
  return function reducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
      case "HOME": {
        return { ...initialState };
      }
      case "START":
      case "RESTART": {
        return {
          ...initialState,
          phase: QuizPhase.Answering,
          questions: buildQuestions(action.verbs, questionCount, Math.random),
        };
      }
      case "SELECT": {
        // In feedback phase: any click just changes which button is selected
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

        // Correct — only award point if no wrong attempt was made
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
  };
}

export interface UseQuizReturn {
  state: QuizState;
  startQuiz(customVerbs?: Verb[]): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(): void;
  goHome(): void;
  currentQuestion: QuizQuestion | null;
  progress: { index: number; total: number };
}

export function useQuiz(verbs: Verb[], questionCount = 10): UseQuizReturn {
  const [state, dispatch] = useReducer(makeReducer(questionCount), initialState);
  const lastVerbs = useRef<Verb[]>(verbs);

  const startQuiz = useCallback((customVerbs?: Verb[]) => {
    const selected = (customVerbs && customVerbs.length > 0) ? customVerbs : verbs;
    lastVerbs.current = selected;
    dispatch({ type: "START", verbs: selected });
  }, [verbs]);
  const selectAnswer = useCallback(
    (index: number) => dispatch({ type: "SELECT", payload: index }),
    []
  );
  const nextQuestion = useCallback(() => dispatch({ type: "NEXT" }), []);
  const restartQuiz = useCallback(() => dispatch({ type: "RESTART", verbs: lastVerbs.current }), []);
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
