import type { Verb } from "../types";

export interface ConjugationRow {
  subject: string;
  form: string;
}

const AVOIR = ["j'ai", "tu as", "il a", "elle a", "nous avons", "vous avez", "ils ont", "elles ont"];
const ÊTRE  = ["je suis", "tu es", "il est", "elle est", "nous sommes", "vous êtes", "ils sont", "elles sont"];

const SUBJECTS = ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"];

function agreeParticiple(participle: string, subject: string): string {
  // Determine gender/number based on subject
  const isFem    = subject === "elle" || subject === "elles";
  const isPlural = subject === "nous" || subject === "vous" || subject === "ils" || subject === "elles";
  const isAmbiguous = subject === "je" || subject === "tu" || subject === "nous" || subject === "vous";

  // Build agreed form
  let base = participle;

  // Remove trailing accent for agreement (né → née not né + e = née)
  // We apply suffix rules to the already-accented base
  if (isFem && isPlural) {
    base = participle + "es";
  } else if (isFem) {
    base = participle + "e";
  } else if (isPlural) {
    base = participle + "s";
  }

  // je/tu/nous/vous: gender unknown → show (e) notation
  if (isAmbiguous) {
    const masc = isPlural ? participle + "s" : participle;
    const fem  = isPlural ? participle + "es" : participle + "e";
    return `${masc} / ${fem}`;
  }

  return base;
}

export function buildPasseCompose(verb: Verb): ConjugationRow[] {
  const auxiliaries = verb.auxiliary === "avoir" ? AVOIR : ÊTRE;

  return SUBJECTS.map((subject, i) => {
    const aux = auxiliaries[i];
    const participle =
      verb.auxiliary === "être"
        ? agreeParticiple(verb.participle, subject)
        : verb.participle;

    return { subject, form: `${aux} ${participle}` };
  });
}
