import type { Verb, FuturQuestion } from "../types";
import { fisherYates } from "./shuffle";

interface SubjectForm {
  subject: string;
  form: string;
}

/** Derives all 6 futur simple forms from the il/elle 3sg form.
 *  All 6 persons have distinct endings (-ai/-as/-a/-ons/-ez/-ont),
 *  so each is quizzable individually. */
function futurSubjectForms(form3sg: string): SubjectForm[] {
  const stem = form3sg.slice(0, -1); // remove final "a"
  return [
    { subject: "je",          form: stem + "ai" },
    { subject: "tu",          form: stem + "as" },
    { subject: "il / elle",   form: stem + "a" },
    { subject: "nous",        form: stem + "ons" },
    { subject: "vous",        form: stem + "ez" },
    { subject: "ils / elles", form: stem + "ont" },
  ];
}

export function buildFuturQuestions(
  verbs: Verb[],
  count: number,
  rng: () => number
): FuturQuestion[] {
  const shuffled = fisherYates(verbs, rng);
  const questions: FuturQuestion[] = [];

  for (const verb of shuffled) {
    if (questions.length >= count) break;

    const futurIdx = verb.confuserTenses.indexOf("futur");
    if (futurIdx === -1) continue;
    const futur3sg = verb.confusers[futurIdx]!;

    const allForms = futurSubjectForms(futur3sg);
    const shuffledForms = fisherYates(allForms, rng);
    const target = shuffledForms[0]!;
    const distractors = shuffledForms.slice(1, 4);

    const optionEntries = fisherYates([target, ...distractors], rng);
    const correctIndex = optionEntries.findIndex((e) => e.subject === target.subject);

    questions.push({
      verb,
      options: optionEntries.map((e) => e.form),
      correctIndex,
      targetSubject: target.subject,
      optionSubjects: optionEntries.map((e) => e.subject),
      futur3sg,
    });
  }

  return questions;
}
