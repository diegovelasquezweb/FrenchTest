import type { Verb } from "../types";
import { fisherYates } from "./shuffle";

/**
 * Returns 3 distractors for a given verb.
 * All distractors are real conjugations of the same verb in other tenses
 * (présent, imparfait, futur) — so the learner must know the exact form,
 * not just guess by pattern.
 */
export function generateDistractors(
  target: Verb,
  _pool: Verb[],
  rng: () => number
): [string, string, string] {
  const shuffled = fisherYates([...target.confusers], rng);
  return [shuffled[0], shuffled[1], shuffled[2]];
}
