import type { Verb } from "../types";

/** [je, tu, il/elle, nous, vous, ils/elles] */
type Paradigm = [string, string, string, string, string, string];

const EXPLICIT: Record<string, Paradigm> = {
  // ── Auxiliaires ─────────────────────────────────────────────────────────
  avoir:       ["ai",        "as",        "a",        "avons",        "avez",        "ont"],
  être:        ["suis",      "es",        "est",      "sommes",       "êtes",        "sont"],

  // ── Totalement irréguliers ───────────────────────────────────────────────
  aller:       ["vais",      "vas",       "va",       "allons",       "allez",       "vont"],
  faire:       ["fais",      "fais",      "fait",     "faisons",      "faites",      "font"],
  falloir:     ["—",         "—",         "faut",     "—",            "—",           "—"],
  valoir:      ["vaux",      "vaux",      "vaut",     "valons",       "valez",       "valent"],
  mourir:      ["meurs",     "meurs",     "meurt",    "mourons",      "mourez",      "meurent"],

  // ── Verbes en -oir ───────────────────────────────────────────────────────
  vouloir:     ["veux",      "veux",      "veut",     "voulons",      "voulez",      "veulent"],
  pouvoir:     ["peux",      "peux",      "peut",     "pouvons",      "pouvez",      "peuvent"],
  devoir:      ["dois",      "dois",      "doit",     "devons",       "devez",       "doivent"],
  savoir:      ["sais",      "sais",      "sait",     "savons",       "savez",       "savent"],
  recevoir:    ["reçois",    "reçois",    "reçoit",   "recevons",     "recevez",     "reçoivent"],

  // ── Verbes en -oire / -oire ──────────────────────────────────────────────
  boire:       ["bois",      "bois",      "boit",     "buvons",       "buvez",       "boivent"],
  croire:      ["crois",     "crois",     "croit",    "croyons",      "croyez",      "croient"],

  // ── Verbes en -oir ───────────────────────────────────────────────────────
  voir:        ["vois",      "vois",      "voit",     "voyons",       "voyez",       "voient"],

  // ── Verbes en -ire ───────────────────────────────────────────────────────
  lire:        ["lis",       "lis",       "lit",      "lisons",       "lisez",       "lisent"],
  dire:        ["dis",       "dis",       "dit",      "disons",       "dites",       "disent"],
  contredire:  ["contredis", "contredis", "contredit","contredisons", "contredites", "contredisent"],
  interdire:   ["interdis",  "interdis",  "interdit", "interdisons",  "interdites",  "interdisent"],
  prédire:     ["prédis",    "prédis",    "prédit",   "prédisons",    "prédites",    "prédisent"],

  // ── Verbes en -uire ──────────────────────────────────────────────────────
  conduire:    ["conduis",   "conduis",   "conduit",  "conduisons",   "conduisez",   "conduisent"],
  construire:  ["construis", "construis", "construit","construisons",  "construisez", "construisent"],
  traduire:    ["traduis",   "traduis",   "traduit",  "traduisons",    "traduisez",   "traduisent"],
  produire:    ["produis",   "produis",   "produit",  "produisons",    "produisez",   "produisent"],
  réduire:     ["réduis",    "réduis",    "réduit",   "réduisons",     "réduisez",    "réduisent"],
  détruire:    ["détruis",   "détruis",   "détruit",  "détruisons",    "détruisez",   "détruisent"],
  introduire:  ["introduis", "introduis", "introduit","introduisons",  "introduisez", "introduisent"],
  maudire:     ["maudis",    "maudis",    "maudit",   "maudissons",    "maudissez",   "maudissent"],

  // ── Verbes en -indre / -eindre ───────────────────────────────────────────
  peindre:     ["peins",     "peins",     "peint",    "peignons",     "peignez",     "peignent"],
  joindre:     ["joins",     "joins",     "joint",    "joignons",     "joignez",     "joignent"],
  rejoindre:   ["rejoins",   "rejoins",   "rejoint",  "rejoignons",   "rejoignez",   "rejoignent"],
  craindre:    ["crains",    "crains",    "craint",   "craignons",    "craignez",    "craignent"],
  plaindre:    ["plains",    "plains",    "plaint",   "plaignons",    "plaignez",    "plaignent"],
  contraindre: ["contrains", "contrains", "contraint","contraignons", "contraignez", "contraignent"],
  atteindre:   ["atteins",   "atteins",   "atteint",  "atteignons",   "atteignez",   "atteignent"],
  éteindre:    ["éteins",    "éteins",    "éteint",   "éteignons",    "éteignez",    "éteignent"],
  teindre:     ["teins",     "teins",     "teint",    "teignons",     "teignez",     "teignent"],
  feindre:     ["feins",     "feins",     "feint",    "feignons",     "feignez",     "feignent"],

  // ── Verbes en -aître / -aître ────────────────────────────────────────────
  connaître:   ["connais",   "connais",   "connaît",  "connaissons",  "connaissez",  "connaissent"],
  paraître:    ["parais",    "parais",    "paraît",   "paraissons",   "paraissez",   "paraissent"],
  naître:      ["nais",      "nais",      "naît",     "naissons",     "naissez",     "naissent"],
  disparaître: ["disparais", "disparais", "disparaît","disparaissons","disparaissez","disparaissent"],
  plaire:      ["plais",     "plais",     "plaît",    "plaisons",     "plaisez",     "plaisent"],
  taire:       ["tais",      "tais",      "tait",     "taisons",      "taisez",      "taisent"],

  // ── Verbes en -vivre / -suivre / -fuir ──────────────────────────────────
  vivre:       ["vis",       "vis",       "vit",      "vivons",       "vivez",       "vivent"],
  suivre:      ["suis",      "suis",      "suit",     "suivons",      "suivez",      "suivent"],
  fuir:        ["fuis",      "fuis",      "fuit",     "fuyons",       "fuyez",       "fuient"],

  // ── Verbes en -venir / -tenir ────────────────────────────────────────────
  venir:       ["viens",     "viens",     "vient",    "venons",       "venez",       "viennent"],
  tenir:       ["tiens",     "tiens",     "tient",    "tenons",       "tenez",       "tiennent"],

  // ── Verbes en -mettre ────────────────────────────────────────────────────
  mettre:      ["mets",      "mets",      "met",      "mettons",      "mettez",      "mettent"],
  admettre:    ["admets",    "admets",    "admet",    "admettons",    "admettez",    "admettent"],
  promettre:   ["promets",   "promets",   "promet",   "promettons",   "promettez",   "promettent"],
  permettre:   ["permets",   "permets",   "permet",   "permettons",   "permettez",   "permettent"],
  remettre:    ["remets",    "remets",    "remet",    "remettons",    "remettez",    "remettent"],

  // ── Verbes en -prendre ───────────────────────────────────────────────────
  prendre:     ["prends",    "prends",    "prend",    "prenons",      "prenez",      "prennent"],
  comprendre:  ["comprends", "comprends", "comprend", "comprenons",   "comprenez",   "comprennent"],
  apprendre:   ["apprends",  "apprends",  "apprend",  "apprenons",    "apprenez",    "apprennent"],
  surprendre:  ["surprends", "surprends", "surprend", "surprenons",   "surprenez",   "surprennent"],
  reprendre:   ["reprends",  "reprends",  "reprend",  "reprenons",    "reprenez",    "reprennent"],

  // ── Divers irréguliers ───────────────────────────────────────────────────
  courir:      ["cours",     "cours",     "court",    "courons",      "courez",      "courent"],
  acquérir:    ["acquiers",  "acquiers",  "acquiert", "acquérons",    "acquérez",    "acquièrent"],
  asseoir:     ["assieds",   "assieds",   "assied",   "asseyons",     "asseyez",     "asseyent"],
  résoudre:    ["résous",    "résous",    "résout",   "résolvons",    "résolvez",    "résolvent"],
  coudre:      ["couds",     "couds",     "coud",     "cousons",      "cousez",      "cousent"],
  battre:      ["bats",      "bats",      "bat",      "battons",      "battez",      "battent"],

  // ── Groupe 2 -ir (sans -iss-) ────────────────────────────────────────────
  partir:      ["pars",      "pars",      "part",     "partons",      "partez",      "partent"],
  sortir:      ["sors",      "sors",      "sort",     "sortons",      "sortez",      "sortent"],
  dormir:      ["dors",      "dors",      "dort",     "dormons",      "dormez",      "dorment"],
  sentir:      ["sens",      "sens",      "sent",     "sentons",      "sentez",      "sentent"],
  servir:      ["sers",      "sers",      "sert",     "servons",      "servez",      "servent"],
  mentir:      ["mens",      "mens",      "ment",     "mentons",      "mentez",      "mentent"],

  // ── Orthographiques -er ──────────────────────────────────────────────────
  acheter:     ["achète",    "achètes",   "achète",   "achetons",     "achetez",     "achètent"],
  appeler:     ["appelle",   "appelles",  "appelle",  "appelons",     "appelez",     "appellent"],
};

export function getPresentForms(verb: Verb): Paradigm {
  if (EXPLICIT[verb.infinitive]) return EXPLICIT[verb.infinitive];

  // 3sg: PIF verbs store présent as confusers[0]; IFC verbs: 3sg = participle
  const p3sg = verb.confuserTenses[0] === "présent"
    ? verb.confusers[0]
    : verb.participle;

  const inf = verb.infinitive;

  // -ir groupe 1 (finissant): 3sg = participle + "t"
  if (p3sg.slice(0, -1) === verb.participle && p3sg.endsWith("t")) {
    const base = verb.participle; // "fini"
    return [base+"s", base+"s", p3sg, base+"ssons", base+"ssez", base+"ssent"];
  }

  // -ert verbs (ouvrir, offrir, souffrir…): conjugated like -er
  if (verb.ending === "-ert") {
    const stem = p3sg.slice(0, -1); // "ouvr"
    return [p3sg, stem+"es", p3sg, stem+"ons", stem+"ez", stem+"ent"];
  }

  // -er verbs — handle orthographic subgroups first
  if (inf.endsWith("er")) {
    const stem = p3sg.slice(0, -1); // remove terminal "e"
    if (inf.endsWith("ger")) {
      return [p3sg, stem+"es", p3sg, stem+"eons", stem+"ez", stem+"ent"];
    }
    if (inf.endsWith("cer")) {
      const base = stem.slice(0, -1); // "commenc" → "commen"
      return [p3sg, stem+"es", p3sg, base+"çons", stem+"ez", stem+"ent"];
    }
    return [p3sg, stem+"es", p3sg, stem+"ons", stem+"ez", stem+"ent"];
    // NOTE: for -er verbs, je === il (same form)
  }

  // Regular -re verbs (vendre, attendre, répondre…)
  if (inf.endsWith("re") && !verb.irregular) {
    return [p3sg+"s", p3sg+"s", p3sg, p3sg+"ons", p3sg+"ez", p3sg+"ent"];
  }

  // Fallback — return 3sg for all slots (should not reach here for known verbs)
  return [p3sg, p3sg, p3sg, p3sg, p3sg, p3sg];
}

export const PRESENT_SUBJECTS = [
  "je", "tu", "il / elle", "nous", "vous", "ils / elles",
] as const;

export type PresentSubjectIndex = 0 | 1 | 2 | 3 | 4 | 5;
