import type { Verb, ImparfaitQuestion } from "../types";
import { fisherYates } from "./shuffle";

interface SubjectForm {
  subject: string;
  form: string; // raw form without pronoun, e.g. "parlions"
}

/** Derives the 5 distinct imparfait forms from the il/elle 3sg form */
function imparfaitSubjectForms(form3sg: string): SubjectForm[] {
  const stem = form3sg.slice(0, -3); // remove "ait"
  return [
    { subject: "je / tu", form: stem + "ais" },
    { subject: "il / elle", form: stem + "ait" },
    { subject: "nous", form: stem + "ions" },
    { subject: "vous", form: stem + "iez" },
    { subject: "ils / elles", form: stem + "aient" },
  ];
}

export function buildImparfaitQuestions(
  verbs: Verb[],
  count: number,
  rng: () => number
): ImparfaitQuestion[] {
  const shuffled = fisherYates(verbs, rng);
  const chosen = shuffled.slice(0, count);

  return chosen.map((verb) => {
    const imparfaitIdx = verb.confuserTenses.indexOf("imparfait");
    const imparfait3sg = verb.confusers[imparfaitIdx]!;

    const allForms = imparfaitSubjectForms(imparfait3sg);

    // Pick a random target subject
    const shuffledForms = fisherYates(allForms, rng);
    const target = shuffledForms[0]!;
    const distractors = shuffledForms.slice(1, 4); // 3 distractors

    const optionEntries = fisherYates([target, ...distractors], rng);
    const correctIndex = optionEntries.findIndex((e) => e.subject === target.subject);

    return {
      verb,
      options: optionEntries.map((e) => e.form),
      correctIndex,
      targetSubject: target.subject,
      optionSubjects: optionEntries.map((e) => e.subject),
      imparfait3sg,
    };
  });
}
