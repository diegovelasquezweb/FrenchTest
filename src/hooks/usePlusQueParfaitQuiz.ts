import type { PlusQueParfaitQuestion } from "../types";
import { VERBS } from "../data/verbs";
import { buildPlusQueParfaitQuestion } from "../lib/plusQueParfaitQuestions";
import { fisherYates } from "../lib/shuffle";
import { createVerbQuiz, type VerbQuizReturn } from "./createVerbQuiz";

export type UsePlusQueParfaitQuizReturn = VerbQuizReturn<PlusQueParfaitQuestion>;

export const usePlusQueParfaitQuiz = createVerbQuiz<PlusQueParfaitQuestion>((count) => {
  const shuffled = fisherYates([...VERBS], Math.random);
  const questions: PlusQueParfaitQuestion[] = [];
  for (const verb of shuffled) {
    if (questions.length >= count) break;
    const q = buildPlusQueParfaitQuestion(verb, Math.random);
    if (q) questions.push(q);
  }
  return questions;
});
