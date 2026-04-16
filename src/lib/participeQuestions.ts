import type { Verb, QuizQuestion } from "../types";
import { VERBS } from "../data/verbs";
import { generateDistractors } from "./distractors";
import { fisherYates } from "./shuffle";

export function buildParticipeQuestion(verb: Verb, rng: () => number): QuizQuestion {
  const distractors = generateDistractors(verb, VERBS, rng);
  const all = fisherYates([verb.participle, ...distractors], rng);
  return {
    verb,
    options: all,
    correctIndex: all.indexOf(verb.participle),
  };
}
