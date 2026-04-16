import type { ConditionnelQuestion } from "../types";
import { VERBS } from "../data/verbs";
import { buildConditionnelQuestions } from "../lib/conditionnelQuestions";
import { createVerbQuiz, type VerbQuizReturn } from "./createVerbQuiz";

export type UseConditionnelQuizReturn = VerbQuizReturn<ConditionnelQuestion>;

export const useConditionnelQuiz = createVerbQuiz<ConditionnelQuestion>((count) =>
  buildConditionnelQuestions(VERBS, count, Math.random)
);
