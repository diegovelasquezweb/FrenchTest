import type { Verb, SubjonctifQuestion } from "../types";
import { getPresentForms } from "./presentForms";
import { getSubjonctifForms, SUBJONCTIF_SUBJECTS } from "./subjonctifForms";
import { fisherYates } from "./shuffle";

const ALL_INDICES = [0, 1, 2, 3, 4, 5] as const;

export function buildSubjonctifQuestion(
  verb: Verb,
  rng: () => number
): SubjonctifQuestion | null {
  const forms = getSubjonctifForms(verb);
  const present = getPresentForms(verb);

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
  if (quizzable.length < 2) return null;

  const targetIdx = quizzable[Math.floor(rng() * quizzable.length)] as 0 | 1 | 2 | 3 | 4 | 5;
  const correctForm = forms[targetIdx];
  const targetSubject = SUBJONCTIF_SUBJECTS[targetIdx];

  const candidates: { form: string; subject: string }[] = [];
  const add = (form: string, subject: string) => {
    if (!form || form === "—" || form === correctForm) return;
    if (candidates.some((x) => x.form === form)) return;
    candidates.push({ form, subject });
  };

  for (const i of ALL_INDICES) {
    if (i === targetIdx) continue;
    add(forms[i], SUBJONCTIF_SUBJECTS[i]);
  }
  for (const i of ALL_INDICES) {
    add(present[i], "indicatif présent");
  }
  for (let i = 0; i < verb.confusers.length; i += 1) {
    add(verb.confusers[i] ?? "", verb.confuserTenses[i] ?? "autre temps");
  }

  if (candidates.length < 3) return null;
  const picked = fisherYates(candidates, rng).slice(0, 3);
  const pool = fisherYates(
    [{ form: correctForm, subject: targetSubject }, ...picked],
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
  };
}

