import type { Verb, PlusQueParfaitQuestion } from "../types";
import { fisherYates } from "./shuffle";
import { buildPasseComposeForms, buildPlusQueParfaitForms, PQP_SUBJECTS } from "./plusQueParfaitForms";

const ALL_INDICES = [0, 1, 2, 3, 4, 5] as const;

export function buildPlusQueParfaitQuestion(
  verb: Verb,
  rng: () => number
): PlusQueParfaitQuestion | null {
  const pqpForms = buildPlusQueParfaitForms(verb);
  const pcForms = buildPasseComposeForms(verb);

  const targetIdx = ALL_INDICES[Math.floor(rng() * ALL_INDICES.length)] as 0 | 1 | 2 | 3 | 4 | 5;
  const correctForm = pqpForms[targetIdx];
  const targetSubject = PQP_SUBJECTS[targetIdx];

  const candidates: { form: string; subject: string }[] = [];
  const add = (form: string, subject: string) => {
    if (!form || form === correctForm) return;
    if (candidates.some((c) => c.form === form)) return;
    candidates.push({ form, subject });
  };

  for (const i of ALL_INDICES) {
    if (i === targetIdx) continue;
    add(pqpForms[i], PQP_SUBJECTS[i]);
  }
  add(pcForms[targetIdx], "passé composé");
  for (let i = 0; i < verb.confusers.length; i += 1) {
    add(verb.confusers[i] ?? "", verb.confuserTenses[i] ?? "autre temps");
  }

  if (candidates.length < 3) return null;

  const picked = fisherYates(candidates, rng).slice(0, 3);
  const pool = fisherYates([{ form: correctForm, subject: targetSubject }, ...picked], rng);
  const correctIndex = pool.findIndex((x) => x.form === correctForm);
  if (correctIndex < 0 || correctIndex > 3) return null;

  return {
    verb,
    options: pool.map((x) => x.form) as [string, string, string, string],
    correctIndex: correctIndex as 0 | 1 | 2 | 3,
    targetSubject,
    optionSubjects: pool.map((x) => x.subject),
  };
}

