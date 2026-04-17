import { useReducer, useCallback } from "react";
import type {
  QuizQuestion,
  ImparfaitQuestion,
  FuturQuestion,
  ConditionnelQuestion,
  PresentQuestion,
  SubjonctifQuestion,
  PlusQueParfaitQuestion,
  Verb,
} from "../types";
import { AnswerState, QuizPhase } from "../types";
import { VERBS } from "../data/verbs";
import { buildImparfaitQuestions } from "../lib/imparfaitQuestions";
import { buildFuturQuestions } from "../lib/futurQuestions";
import { buildConditionnelQuestions } from "../lib/conditionnelQuestions";
import { buildPresentQuestion } from "../lib/presentQuestions";
import { buildSubjonctifQuestion } from "../lib/subjonctifQuestions";
import { buildPlusQueParfaitQuestion } from "../lib/plusQueParfaitQuestions";
import { buildParticipeQuestion } from "../lib/participeQuestions";
import { fisherYates } from "../lib/shuffle";

export type GrammarQuizQuestion =
  | { source: "participe";    q: QuizQuestion }
  | { source: "imparfait";    q: ImparfaitQuestion }
  | { source: "futur";        q: FuturQuestion }
  | { source: "conditionnel"; q: ConditionnelQuestion }
  | { source: "présent";      q: PresentQuestion }
  | { source: "subjonctif";   q: SubjonctifQuestion }
  | { source: "plus-que-parfait"; q: PlusQueParfaitQuestion };

interface GrammarQuizState {
  phase: QuizPhase;
  questions: GrammarQuizQuestion[];
  currentIndex: number;
  score: number;
  selectedIndex: number | null;
  answerState: AnswerState;
  history: { verb: Verb; picked: string; correct: boolean }[];
  everWrong: boolean;
}

type GrammarQuizAction =
  | { type: "START" }
  | { type: "SELECT"; payload: number }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "HOME" };

const initialState: GrammarQuizState = {
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


function buildMixedQuestions(count: number, rng: () => number): GrammarQuizQuestion[] {
  const sources: GrammarQuizQuestion["source"][] = ["participe", "imparfait", "présent", "futur", "conditionnel", "subjonctif", "plus-que-parfait"];
  const bag: GrammarQuizQuestion[] = [];

  const shuffledVerbs = fisherYates([...VERBS], rng);
  const imparfaitPool = buildImparfaitQuestions(VERBS, count * 2, rng);
  const futurPool     = buildFuturQuestions(VERBS, count * 2, rng);
  const condPool      = buildConditionnelQuestions(VERBS, count * 2, rng);

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
    } else if (source === "subjonctif") {
      const q = buildSubjonctifQuestion(verb, rng);
      if (q) bag.push({ source: "subjonctif", q });
    } else if (source === "plus-que-parfait") {
      const q = buildPlusQueParfaitQuestion(verb, rng);
      if (q) bag.push({ source: "plus-que-parfait", q });
    }
  }

  return fisherYates(bag, rng).slice(0, count);
}

function reducer(state: GrammarQuizState, action: GrammarQuizAction): GrammarQuizState {
  switch (action.type) {
    case "HOME":
      return { ...initialState };
    case "START":
    case "RESTART":
      return {
        ...initialState,
        phase: QuizPhase.Answering,
        questions: buildMixedQuestions(TOTAL_QUESTIONS, Math.random),
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

export interface UseGrammarQuizReturn {
  state: GrammarQuizState;
  startQuiz(): void;
  selectAnswer(index: number): void;
  nextQuestion(): void;
  restartQuiz(): void;
  goHome(): void;
  currentQuestion: GrammarQuizQuestion | null;
  progress: { index: number; total: number };
}

export function useGrammarQuiz(): UseGrammarQuizReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startQuiz    = useCallback(() => dispatch({ type: "START" }), []);
  const selectAnswer = useCallback((i: number) => dispatch({ type: "SELECT", payload: i }), []);
  const nextQuestion = useCallback(() => dispatch({ type: "NEXT" }), []);
  const restartQuiz  = useCallback(() => dispatch({ type: "RESTART" }), []);
  const goHome       = useCallback(() => dispatch({ type: "HOME" }), []);

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
