import { useReducer, useCallback } from "react";
import type { QuizQuestion, Verb } from "../types";
import { AnswerState, QuizPhase } from "../types";
import { VERBS } from "../data/verbs";
import { buildImparfaitQuestions } from "../lib/imparfaitQuestions";
import { buildFuturQuestions } from "../lib/futurQuestions";
import { buildConditionnelQuestions } from "../lib/conditionnelQuestions";
import { buildPresentQuestion } from "../lib/presentQuestions";
import { generateDistractors } from "../lib/distractors";
import { fisherYates } from "../lib/shuffle";
import type { GrammarQuizQuestion } from "./useGrammarQuiz";

interface DifficultesState {
  phase: QuizPhase;
  questions: GrammarQuizQuestion[];
  currentIndex: number;
  score: number;
  selectedIndex: number | null;
  answerState: AnswerState;
  history: { verb: Verb; picked: string; correct: boolean }[];
  everWrong: boolean;
}

type DifficultesAction =
  | { type: "START"; verbs: Verb[] }
  | { type: "SELECT"; payload: number }
  | { type: "NEXT" }
  | { type: "RESTART"; verbs: Verb[] }
  | { type: "HOME" };

const initialState: DifficultesState = {
  phase: QuizPhase.Idle,
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedIndex: null,
  answerState: AnswerState.Idle,
  history: [],
  everWrong: false,
};

const TOTAL_QUESTIONS = 10;

function buildParticipeQuestion(verb: Verb, rng: () => number): QuizQuestion {
  const distractors = generateDistractors(verb, VERBS, rng);
  const all = fisherYates([verb.participle, ...distractors], rng);
  return { verb, options: all, correctIndex: all.indexOf(verb.participle) };
}

function buildDifficultesQuestions(
  verbs: Verb[],
  count: number,
  rng: () => number
): GrammarQuizQuestion[] {
  if (verbs.length === 0) return [];

  const sources: GrammarQuizQuestion["source"][] = [
    "participe", "imparfait", "présent", "futur", "conditionnel",
  ];
  const bag: GrammarQuizQuestion[] = [];

  const shuffledVerbs = fisherYates([...verbs], rng);
  const imparfaitPool = buildImparfaitQuestions(verbs, count * 2, rng);
  const futurPool     = buildFuturQuestions(verbs, count * 2, rng);
  const condPool      = buildConditionnelQuestions(verbs, count * 2, rng);

  let impIdx = 0, futIdx = 0, condIdx = 0, verbIdx = 0;

  while (bag.length < count) {
    const source = sources[bag.length % sources.length];
    const verb = shuffledVerbs[verbIdx++ % shuffledVerbs.length];
    if (!verb) break;

    if (source === "participe") {
      bag.push({ source: "participe", q: buildParticipeQuestion(verb, rng) });
    } else if (source === "imparfait") {
      const q = imparfaitPool[impIdx++];
      if (q) bag.push({ source: "imparfait", q });
    } else if (source === "futur") {
      const q = futurPool[futIdx++];
      if (q) bag.push({ source: "futur", q });
    } else if (source === "conditionnel") {
      const q = condPool[condIdx++];
      if (q) bag.push({ source: "conditionnel", q });
    } else if (source === "présent") {
      const q = buildPresentQuestion(verb, rng);
      if (q) bag.push({ source: "présent", q });
    }

    // Safety: avoid infinite loop if pool ran dry
    if (verbIdx > shuffledVerbs.length * 5 + 10) break;
  }

  return fisherYates(bag, rng).slice(0, count);
}

function reducer(state: DifficultesState, action: DifficultesAction): DifficultesState {
  switch (action.type) {
    case "HOME":
      return { ...initialState };
    case "START":
    case "RESTART":
      return {
        ...initialState,
        phase: QuizPhase.Answering,
        questions: buildDifficultesQuestions(
          action.verbs,
          Math.min(TOTAL_QUESTIONS, action.verbs.length),
          Math.random
        ),
      };
    case "SELECT": {
      if (state.phase === QuizPhase.Feedback) {
        return { ...state, selectedIndex: action.payload };
      }
      if (state.phase !== QuizPhase.Answering) return state;
      const wrapper = state.questions[state.currentIndex];
      if (!wrapper) return state;
      const isCorrect = action.payload === wrapper.q.correctIndex;

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
            verb: wrapper.q.verb,
            picked: wrapper.q.options[action.payload] ?? "",
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

export interface UseDifficultesQuizReturn {
  state: DifficultesState;
  startQuiz(verbs: Verb[]): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(verbs: Verb[]): void;
  goHome(): void;
  currentQuestion: GrammarQuizQuestion | null;
  progress: { index: number; total: number };
}

export function useDifficultesQuiz(): UseDifficultesQuizReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startQuiz    = useCallback((verbs: Verb[]) => dispatch({ type: "START",   verbs }), []);
  const selectAnswer = useCallback((i: number)     => dispatch({ type: "SELECT",  payload: i }), []);
  const nextQuestion = useCallback(()              => dispatch({ type: "NEXT" }), []);
  const restartQuiz  = useCallback((verbs: Verb[]) => dispatch({ type: "RESTART", verbs }), []);
  const goHome       = useCallback(()              => dispatch({ type: "HOME" }), []);

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
