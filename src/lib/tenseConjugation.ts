import type { TenseName } from "../types";

export interface ConjugationRow {
  subject: string;
  form: string;
}

const VOWELS = /^[aâàäeéèêëiîïoôöuùûüyœæh]/i;

function je(verb: string): string {
  return VOWELS.test(verb) ? `j'${verb}` : `je ${verb}`;
}

function buildForms(
  subjects: string[],
  verbForms: string[]
): ConjugationRow[] {
  return subjects.map((subject, i) => {
    const raw = verbForms[i];
    const form =
      subject === "je" ? je(raw)
      : subject === "tu" ? `tu ${raw}`
      : subject === "il" ? `il ${raw}`
      : subject === "elle" ? `elle ${raw}`
      : subject === "nous" ? `nous ${raw}`
      : subject === "vous" ? `vous ${raw}`
      : subject === "ils" ? `ils ${raw}`
      : `elles ${raw}`;
    return { subject, form };
  });
}

const SUBJECTS = ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"];

function fromImparfaitOrConditionnel(form3sg: string): ConjugationRow[] {
  // Both imparfait and conditionnel share the same endings
  const stem = form3sg.slice(0, -3); // remove "ait"
  return buildForms(SUBJECTS, [
    stem + "ais",
    stem + "ais",
    stem + "ait",
    stem + "ait",
    stem + "ions",
    stem + "iez",
    stem + "aient",
    stem + "aient",
  ]);
}

function fromFutur(form3sg: string): ConjugationRow[] {
  const stem = form3sg.slice(0, -1); // remove final "a"
  return buildForms(SUBJECTS, [
    stem + "ai",
    stem + "as",
    stem + "a",
    stem + "a",
    stem + "ons",
    stem + "ez",
    stem + "ont",
    stem + "ont",
  ]);
}

function fromPresent(form3sg: string): ConjugationRow[] | null {
  // Reliable only for -er verbs (3sg ends in "e")
  if (!form3sg.endsWith("e") || form3sg === "e") return null;
  const stem = form3sg.slice(0, -1); // remove "e"
  return buildForms(SUBJECTS, [
    stem + "e",
    stem + "es",
    stem + "e",
    stem + "e",
    stem + "ons",
    stem + "ez",
    stem + "ent",
    stem + "ent",
  ]);
}

export interface TenseConjugation {
  tense: TenseName;
  label: string;
  rows: ConjugationRow[];
  partial: boolean; // true = only 3sg shown (irregular présent)
}

const TENSE_LABELS: Record<TenseName, string> = {
  présent: "Présent",
  imparfait: "Imparfait",
  futur: "Futur simple",
  conditionnel: "Conditionnel présent",
};

export function buildTenseConjugation(
  tense: TenseName,
  form3sg: string
): TenseConjugation {
  let rows: ConjugationRow[] | null = null;
  let partial = false;

  if (tense === "imparfait" || tense === "conditionnel") {
    rows = fromImparfaitOrConditionnel(form3sg);
  } else if (tense === "futur") {
    rows = fromFutur(form3sg);
  } else {
    rows = fromPresent(form3sg);
    if (!rows) {
      // Irregular présent — show only 3sg as fallback
      rows = [{ subject: "il / elle", form: `il ${form3sg}` }];
      partial = true;
    }
  }

  return { tense, label: TENSE_LABELS[tense], rows, partial };
}
