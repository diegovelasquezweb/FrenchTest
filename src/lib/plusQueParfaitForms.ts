import type { Verb } from "../types";

export const PQP_SUBJECTS = [
  "je", "tu", "il / elle", "nous", "vous", "ils / elles",
] as const;

const AVOIR_IMPARFAIT = ["avais", "avais", "avait", "avions", "aviez", "avaient"] as const;
const ETRE_IMPARFAIT = ["étais", "étais", "était", "étions", "étiez", "étaient"] as const;
const AVOIR_PRESENT = ["ai", "as", "a", "avons", "avez", "ont"] as const;
const ETRE_PRESENT = ["suis", "es", "est", "sommes", "êtes", "sont"] as const;

function withParticiple(verb: Verb, aux: readonly string[]): string[] {
  return aux.map((a) => `${a} ${verb.participle}`);
}

export function buildPlusQueParfaitForms(verb: Verb): string[] {
  return withParticiple(verb, verb.auxiliary === "être" ? ETRE_IMPARFAIT : AVOIR_IMPARFAIT);
}

export function buildPasseComposeForms(verb: Verb): string[] {
  return withParticiple(verb, verb.auxiliary === "être" ? ETRE_PRESENT : AVOIR_PRESENT);
}

