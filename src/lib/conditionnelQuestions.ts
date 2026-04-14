import type { Verb, ConditionnelQuestion } from "../types";
import { fisherYates } from "./shuffle";

interface SubjectForm {
  subject: string;
  form: string;
}

/** Derives the conditionnel 3sg form from verb data.
 *  IFC verbs store it directly; PIF verbs derive it from the futur 3sg. */
function getConditionnel3sg(verb: Verb): string {
  const idx = verb.confuserTenses.indexOf("conditionnel");
  if (idx !== -1) return verb.confusers[idx]!;

  // Derive from futur: "parlera" → "parlerait"
  const futurIdx = verb.confuserTenses.indexOf("futur");
  if (futurIdx !== -1) {
    return verb.confusers[futurIdx]!.slice(0, -1) + "ait";
  }

  return "";
}

/** Derives the 5 distinct conditionnel forms from the il/elle 3sg form.
 *  Endings are identical to imparfait (-ais/-ais/-ait/-ions/-iez/-aient). */
function conditionnelSubjectForms(form3sg: string): SubjectForm[] {
  const stem = form3sg.slice(0, -3); // remove "ait"
  return [
    { subject: "je / tu",     form: stem + "ais" },
    { subject: "il / elle",   form: stem + "ait" },
    { subject: "nous",        form: stem + "ions" },
    { subject: "vous",        form: stem + "iez" },
    { subject: "ils / elles", form: stem + "aient" },
  ];
}

export function buildConditionnelQuestions(
  verbs: Verb[],
  count: number,
  rng: () => number
): ConditionnelQuestion[] {
  const shuffled = fisherYates(verbs, rng);
  const questions: ConditionnelQuestion[] = [];

  for (const verb of shuffled) {
    if (questions.length >= count) break;

    const conditionnel3sg = getConditionnel3sg(verb);
    if (!conditionnel3sg) continue;

    const allForms = conditionnelSubjectForms(conditionnel3sg);
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
      conditionnel3sg,
    });
  }

  return questions;
}
