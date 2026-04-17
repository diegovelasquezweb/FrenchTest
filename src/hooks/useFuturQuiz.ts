import type { FuturQuestion } from "../types";
import { VERBS } from "../data/verbs";
import { buildFuturQuestions } from "../lib/futurQuestions";
import { createVerbQuiz, type VerbQuizReturn } from "./createVerbQuiz";

export type UseFuturQuizReturn = VerbQuizReturn<FuturQuestion>;

export const useFuturQuiz = createVerbQuiz<FuturQuestion>((count) =>
  buildFuturQuestions(VERBS, count, Math.random)
);
