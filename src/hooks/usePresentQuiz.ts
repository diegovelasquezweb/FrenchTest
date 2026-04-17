import type { PresentQuestion } from "../types";
import { VERBS } from "../data/verbs";
import { buildPresentQuestion } from "../lib/presentQuestions";
import { fisherYates } from "../lib/shuffle";
import { createVerbQuiz, type VerbQuizReturn } from "./createVerbQuiz";

export type UsePresentQuizReturn = VerbQuizReturn<PresentQuestion>;

export const usePresentQuiz = createVerbQuiz<PresentQuestion>((count) => {
  const shuffled = fisherYates([...VERBS], Math.random);
  const questions: PresentQuestion[] = [];
  for (const verb of shuffled) {
    if (questions.length >= count) break;
    const q = buildPresentQuestion(verb, Math.random);
    if (q) questions.push(q);
  }
  return questions;
});
