import type { SubjonctifQuestion } from "../types";
import { VERBS } from "../data/verbs";
import { buildSubjonctifQuestion } from "../lib/subjonctifQuestions";
import { fisherYates } from "../lib/shuffle";
import { createVerbQuiz, type VerbQuizReturn } from "./createVerbQuiz";

export type UseSubjonctifQuizReturn = VerbQuizReturn<SubjonctifQuestion>;

export const useSubjonctifQuiz = createVerbQuiz<SubjonctifQuestion>((count) => {
  const shuffled = fisherYates([...VERBS], Math.random);
  const questions: SubjonctifQuestion[] = [];
  for (const verb of shuffled) {
    if (questions.length >= count) break;
    const q = buildSubjonctifQuestion(verb, Math.random);
    if (q) questions.push(q);
  }
  return questions;
});
