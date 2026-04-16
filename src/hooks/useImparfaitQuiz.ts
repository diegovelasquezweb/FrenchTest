import type { ImparfaitQuestion } from "../types";
import { VERBS } from "../data/verbs";
import { buildImparfaitQuestions } from "../lib/imparfaitQuestions";
import { createVerbQuiz, type VerbQuizReturn } from "./createVerbQuiz";

export type UseImparfaitQuizReturn = VerbQuizReturn<ImparfaitQuestion>;

export const useImparfaitQuiz = createVerbQuiz<ImparfaitQuestion>((count) =>
  buildImparfaitQuestions(VERBS, count, Math.random)
);
