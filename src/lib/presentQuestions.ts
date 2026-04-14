import type { Verb } from "../types";
import type { PresentQuestion } from "../types";
import { getPresentForms, PRESENT_SUBJECTS } from "./presentForms";
import { fisherYates } from "./shuffle";

/** Indices of the 6 subject slots */
const ALL_INDICES = [0, 1, 2, 3, 4, 5] as const;

export function buildPresentQuestion(
  verb: Verb,
  rng: () => number
): PresentQuestion | null {
  const forms = getPresentForms(verb);

  // Skip impersonal verbs (falloir)
  if (forms.every((f) => f === "—" || f === forms[2])) return null;

  // Build list of quizzable slots: not "—", and unique value
  const seen = new Set<string>();
  const quizzable: number[] = [];
  for (const i of ALL_INDICES) {
    const f = forms[i];
    if (f === "—") continue;
    if (!seen.has(f)) {
      seen.add(f);
      quizzable.push(i);
    }
  }

  // Need at least 2 distinct forms to make a meaningful quiz
  if (quizzable.length < 2) return null;

  // Pick a random target subject from the quizzable list
  const targetIdx = quizzable[Math.floor(rng() * quizzable.length)] as
    | 0 | 1 | 2 | 3 | 4 | 5;
  const correctForm = forms[targetIdx];
  const targetSubject = PRESENT_SUBJECTS[targetIdx];

  // Collect distractors: other subject forms (unique, ≠ correct)
  const otherForms = ALL_INDICES
    .filter((i) => i !== targetIdx)
    .map((i) => ({ form: forms[i], subject: PRESENT_SUBJECTS[i] }))
    .filter(({ form }) => form !== "—" && form !== correctForm)
    .filter(({ form }, i, arr) => arr.findIndex((x) => x.form === form) === i); // dedup

  // Fill up distractors with confusers if needed
  const confuserDistractors = verb.confusers
    .map((f, i) => ({ form: f, subject: verb.confuserTenses[i] }))
    .filter(({ form }) => form !== correctForm && !otherForms.some((o) => o.form === form));

  const allDistractors = [...otherForms, ...confuserDistractors];
  if (allDistractors.length < 3) return null;

  const picked = fisherYates(allDistractors, rng).slice(0, 3);
  const pool = fisherYates(
    [
      { form: correctForm, subject: targetSubject },
      ...picked,
    ],
    rng
  );

  const correctIndex = pool.findIndex((x) => x.form === correctForm);
  if (correctIndex < 0 || correctIndex > 3) return null;

  return {
    verb,
    options: pool.map((x) => x.form) as [string, string, string, string],
    correctIndex: correctIndex as 0 | 1 | 2 | 3,
    targetSubject,
    optionSubjects: pool.map((x) => x.subject),
    present3sg: forms[2],
  };
}
