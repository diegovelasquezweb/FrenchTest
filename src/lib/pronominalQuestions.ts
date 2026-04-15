import { fisherYates } from "./shuffle";

interface PronominalVerb {
  infinitive: string; // "se réveiller"
  participle: string; // "réveillé"
  translation: string;
  translationEs: string;
}

export interface PronominalQuestion {
  verb: PronominalVerb;
  tense: "présent" | "imparfait" | "futur" | "conditionnel" | "passé composé";
  targetSubject: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  optionSubjects: string[];
}

const PRONOMINALS: PronominalVerb[] = [
  { infinitive: "se réveiller", participle: "réveillé", translation: "to wake up", translationEs: "despertarse" },
  { infinitive: "se lever", participle: "levé", translation: "to get up", translationEs: "levantarse" },
  { infinitive: "se coucher", participle: "couché", translation: "to go to bed", translationEs: "acostarse" },
  { infinitive: "s'endormir", participle: "endormi", translation: "to fall asleep", translationEs: "dormirse" },
  { infinitive: "s'arrêter", participle: "arrêté", translation: "to stop", translationEs: "detenerse" },
  { infinitive: "se souvenir", participle: "souvenu", translation: "to remember", translationEs: "recordar" },
  { infinitive: "se tromper", participle: "trompé", translation: "to make a mistake", translationEs: "equivocarse" },
  { infinitive: "se sentir", participle: "senti", translation: "to feel", translationEs: "sentirse" },
  { infinitive: "s'intéresser", participle: "intéressé", translation: "to be interested in", translationEs: "interesarse" },
  { infinitive: "se plaindre", participle: "plaint", translation: "to complain", translationEs: "quejarse" },
  { infinitive: "se dépêcher", participle: "dépêché", translation: "to hurry", translationEs: "apurarse" },
  { infinitive: "se perdre", participle: "perdu", translation: "to get lost", translationEs: "perderse" },
];

const SUBJECTS = ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"] as const;

function conjugatePrésent(participle: string, subject: string): string {
  const stem = participle.slice(0, -1); // "réveill" from "réveillé"
  const pronoun =
    subject === "je"
      ? "me "
      : subject === "tu"
        ? "te "
        : subject === "il" || subject === "elle"
          ? "se "
          : subject === "nous"
            ? "nous "
            : subject === "vous"
              ? "vous "
              : "se ";

  const ending =
    subject === "je" || subject === "tu" ? stem + "e"
    : subject === "il" || subject === "elle" ? stem + "e"
    : subject === "nous" ? stem + "ons"
    : subject === "vous" ? stem + "ez"
    : stem + "ent"; // ils/elles

  return `${pronoun}${ending}`;
}

function conjugateImparfait(participle: string, subject: string): string {
  const stem = participle.slice(0, -1);
  const pronoun =
    subject === "je"
      ? "me "
      : subject === "tu"
        ? "te "
        : subject === "il" || subject === "elle"
          ? "se "
          : subject === "nous"
            ? "nous "
            : subject === "vous"
              ? "vous "
              : "se ";

  const ending =
    subject === "je" || subject === "tu" ? stem + "ais"
    : subject === "il" || subject === "elle" ? stem + "ait"
    : subject === "nous" ? stem + "ions"
    : subject === "vous" ? stem + "iez"
    : stem + "aient"; // ils/elles

  return `${pronoun}${ending}`;
}

function conjugateFutur(participle: string, subject: string): string {
  const infinitive = `se ${participle.toLowerCase()}`;
  const pronoun =
    subject === "je"
      ? "me "
      : subject === "tu"
        ? "te "
        : subject === "il" || subject === "elle"
          ? "se "
          : subject === "nous"
            ? "nous "
            : subject === "vous"
              ? "vous "
              : "se ";

  const ending =
    subject === "je" ? "rai"
    : subject === "tu" ? "ras"
    : subject === "il" || subject === "elle" ? "ra"
    : subject === "nous" ? "rons"
    : subject === "vous" ? "rez"
    : "ront"; // ils/elles

  return `${pronoun}${infinitive.slice(3)}${ending}`;
}

function conjugateConditionnel(participle: string, subject: string): string {
  const infinitive = `se ${participle.toLowerCase()}`;
  const pronoun =
    subject === "je"
      ? "me "
      : subject === "tu"
        ? "te "
        : subject === "il" || subject === "elle"
          ? "se "
          : subject === "nous"
            ? "nous "
            : subject === "vous"
              ? "vous "
              : "se ";

  const ending =
    subject === "je" ? "rais"
    : subject === "tu" ? "rais"
    : subject === "il" || subject === "elle" ? "rait"
    : subject === "nous" ? "rions"
    : subject === "vous" ? "riez"
    : "raient"; // ils/elles

  return `${pronoun}${infinitive.slice(3)}${ending}`;
}

function conjugatePasséComposé(participle: string, subject: string): string {
  const pronoun =
    subject === "je"
      ? "me "
      : subject === "tu"
        ? "te "
        : subject === "il"
          ? "se "
          : subject === "elle"
            ? "se "
            : subject === "nous"
              ? "nous "
              : subject === "vous"
                ? "vous "
                : "se ";

  const auxiliary = ["je", "tu"].includes(subject)
    ? "suis"
    : ["il"].includes(subject)
      ? "est"
      : ["elle"].includes(subject)
        ? "est"
        : subject === "nous"
          ? "sommes"
          : subject === "vous"
            ? "êtes"
            : "sont"; // ils/elles

  // Concordance: fem +e, plural +s, fem pl +es
  let agreedParticiple = participle;
  if (subject === "elle" || subject === "elles") agreedParticiple += "e";
  if (subject === "ils" || subject === "elles") agreedParticiple += "s";
  // Ambiguous: je/tu fem → "levée" or masc → "levé"; nous/vous fem → "levées" or masc → "levés"
  if ((subject === "je" || subject === "tu") && !agreedParticiple.endsWith("e"))
    agreedParticiple = `${participle} / ${participle}e`;
  if ((subject === "nous" || subject === "vous") && agreedParticiple === participle)
    agreedParticiple = `${participle}s / ${participle}es`;

  return `${pronoun}${auxiliary} ${agreedParticiple}`;
}

function buildPronominalQuestion(verb: PronominalVerb, tense: string, rng: () => number): PronominalQuestion | null {
  const validSubjects = [...SUBJECTS];
  const targetSubject = validSubjects[Math.floor(rng() * validSubjects.length)]!;

  let correctForm: string;
  switch (tense) {
    case "présent":
      correctForm = conjugatePrésent(verb.participle, targetSubject);
      break;
    case "imparfait":
      correctForm = conjugateImparfait(verb.participle, targetSubject);
      break;
    case "futur":
      correctForm = conjugateFutur(verb.participle, targetSubject);
      break;
    case "conditionnel":
      correctForm = conjugateConditionnel(verb.participle, targetSubject);
      break;
    case "passé composé":
      correctForm = conjugatePasséComposé(verb.participle, targetSubject);
      break;
    default:
      return null;
  }

  // Generate distractors from other subjects (same tense)
  const distractors: { form: string; subject: string }[] = [];
  for (const subject of validSubjects) {
    if (subject === targetSubject) continue;
    let form: string;
    switch (tense) {
      case "présent":
        form = conjugatePrésent(verb.participle, subject);
        break;
      case "imparfait":
        form = conjugateImparfait(verb.participle, subject);
        break;
      case "futur":
        form = conjugateFutur(verb.participle, subject);
        break;
      case "conditionnel":
        form = conjugateConditionnel(verb.participle, subject);
        break;
      case "passé composé":
        form = conjugatePasséComposé(verb.participle, subject);
        break;
      default:
        continue;
    }
    if (form !== correctForm) {
      distractors.push({ form, subject });
    }
  }

  if (distractors.length < 3) return null;

  const picked = fisherYates(distractors, rng).slice(0, 3);
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
    tense: tense as any,
    targetSubject,
    options: pool.map((x) => x.form) as [string, string, string, string],
    correctIndex: correctIndex as 0 | 1 | 2 | 3,
    optionSubjects: pool.map((x) => x.subject),
  };
}

export function buildPronominalQuestions(count: number, rng: () => number): PronominalQuestion[] {
  const tenses = ["présent", "imparfait", "futur", "passé composé", "conditionnel"] as const;
  const questions: PronominalQuestion[] = [];
  const shuffledVerbs = fisherYates(PRONOMINALS, rng);

  for (let i = 0; i < count && i < shuffledVerbs.length; i++) {
    const verb = shuffledVerbs[i]!;
    const tense = tenses[i % tenses.length]!;
    const q = buildPronominalQuestion(verb, tense, rng);
    if (q) questions.push(q);
  }

  return questions;
}
