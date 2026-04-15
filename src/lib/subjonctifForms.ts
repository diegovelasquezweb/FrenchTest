import type { Verb } from "../types";
import { getPresentForms } from "./presentForms";

/** [que je, que tu, qu'il/elle, que nous, que vous, qu'ils/elles] */
type Paradigm = [string, string, string, string, string, string];

const EXPLICIT: Record<string, Paradigm> = {
  être: ["sois", "sois", "soit", "soyons", "soyez", "soient"],
  avoir: ["aie", "aies", "ait", "ayons", "ayez", "aient"],
  aller: ["aille", "ailles", "aille", "allions", "alliez", "aillent"],
  faire: ["fasse", "fasses", "fasse", "fassions", "fassiez", "fassent"],
  pouvoir: ["puisse", "puisses", "puisse", "puissions", "puissiez", "puissent"],
  vouloir: ["veuille", "veuilles", "veuille", "voulions", "vouliez", "veuillent"],
  savoir: ["sache", "saches", "sache", "sachions", "sachiez", "sachent"],
  devoir: ["doive", "doives", "doive", "devions", "deviez", "doivent"],
  venir: ["vienne", "viennes", "vienne", "venions", "veniez", "viennent"],
  tenir: ["tienne", "tiennes", "tienne", "tenions", "teniez", "tiennent"],
  prendre: ["prenne", "prennes", "prenne", "prenions", "preniez", "prennent"],
  comprendre: ["comprenne", "comprennes", "comprenne", "comprenions", "compreniez", "comprennent"],
  apprendre: ["apprenne", "apprennes", "apprenne", "apprenions", "appreniez", "apprennent"],
  recevoir: ["reçoive", "reçoives", "reçoive", "recevions", "receviez", "reçoivent"],
  voir: ["voie", "voies", "voie", "voyions", "voyiez", "voient"],
  boire: ["boive", "boives", "boive", "buvions", "buviez", "boivent"],
  valoir: ["vaille", "vailles", "vaille", "valions", "valiez", "vaillent"],
  falloir: ["—", "—", "faille", "—", "—", "—"],
};

export function getSubjonctifForms(verb: Verb): Paradigm {
  if (EXPLICIT[verb.infinitive]) return EXPLICIT[verb.infinitive];

  const present = getPresentForms(verb);
  const ils = present[5];
  if (!ils || ils === "—") return ["—", "—", "—", "—", "—", "—"];

  const stem = ils.endsWith("ent") ? ils.slice(0, -3) : ils;
  const nous = present[3] !== "—" ? present[3] : `${stem}ions`;
  const vous = present[4] !== "—" ? present[4] : `${stem}iez`;

  return [
    `${stem}e`,
    `${stem}es`,
    `${stem}e`,
    nous,
    vous,
    `${stem}ent`,
  ];
}

export const SUBJONCTIF_SUBJECTS = [
  "que je", "que tu", "qu'il / elle", "que nous", "que vous", "qu'ils / elles",
] as const;

