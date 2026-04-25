import {
  CONNECTEURS_BY_RELATION,
  type ConnecteurProductionItem,
  type ConnecteurRegistre,
  type ConnecteurRelation,
} from "../data/connecteursProduction";

export type ValidationIssue =
  | "empty"
  | "no-connecteur"
  | "wrong-relation"
  | "wrong-registre"
  | "missing-subjonctif"
  | "no-second-clause";

export type ValidationResult = {
  isValid: boolean;
  matchedConnecteur: string | null;
  detectedRelation: ConnecteurRelation | null;
  issues: ValidationIssue[];
  feedback: string[];
};

const SUBJONCTIF_HINTS = [
  /\bque\s+\w+\s+(soit|sois|soient|soyons|soyez)\b/i,
  /\bque\s+\w+\s+(aille|ailles|aillent|allions|alliez)\b/i,
  /\bque\s+\w+\s+(ait|aies|aient|ayons|ayez)\b/i,
  /\bque\s+\w+\s+(fasse|fasses|fassent|fassions|fassiez)\b/i,
  /\bque\s+\w+\s+(puisse|puisses|puissent|puissions|puissiez)\b/i,
  /\bque\s+\w+\s+(vienne|viennes|viennent|venions|veniez)\b/i,
  /\bque\s+\w+\s+(parte|partes|partent|partions|partiez)\b/i,
  /\bque\s+\w+\s+(prenne|prennes|prennent|prenions|preniez)\b/i,
  /\bque\s+\w+\s+(sache|saches|sachent|sachions|sachiez)\b/i,
  /\bque\s+\w+\s+(veuille|veuilles|veuillent|voulions|vouliez)\b/i,
  /\bque\s+\w+\s+\w+(e|es|ent|ions|iez)\b/i,
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function findConnecteur(
  text: string,
  candidates: string[],
): string | null {
  const normalized = normalize(text);
  const sorted = [...candidates].sort((a, b) => b.length - a.length);
  for (const cand of sorted) {
    const escaped = cand.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(^|[\\s,;.!?:'"(])${escaped}(?=$|[\\s,;.!?:'"()])`, "i");
    if (re.test(normalized)) return cand;
  }
  return null;
}

function detectAnyRelation(text: string): ConnecteurRelation | null {
  const relations: ConnecteurRelation[] = [
    "opposition",
    "cause",
    "consequence",
    "addition",
    "but",
    "temps",
    "condition",
    "illustration",
  ];
  for (const rel of relations) {
    const candidates = CONNECTEURS_BY_RELATION[rel].map((c) => c.connecteur);
    if (findConnecteur(text, candidates)) return rel;
  }
  return null;
}

function looksLikeSubjonctif(text: string): boolean {
  return SUBJONCTIF_HINTS.some((re) => re.test(text));
}

function getRegistre(
  relation: ConnecteurRelation,
  connecteur: string,
): ConnecteurRegistre | null {
  const meta = CONNECTEURS_BY_RELATION[relation].find(
    (c) => c.connecteur.toLowerCase() === connecteur.toLowerCase(),
  );
  return meta?.registre ?? null;
}

function isCompatibleRegistre(
  produced: ConnecteurRegistre,
  required: ConnecteurRegistre,
): boolean {
  if (required === "neutre") return true;
  if (produced === "neutre") return true;
  return produced === required;
}

export function validateProduction(
  input: string,
  item: ConnecteurProductionItem,
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const feedback: string[] = [];
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      matchedConnecteur: null,
      detectedRelation: null,
      issues: ["empty"],
      feedback: ["Écrivez votre phrase complète avec un connecteur."],
    };
  }

  const validCandidates = CONNECTEURS_BY_RELATION[item.relation].map((c) => c.connecteur);
  const matched = findConnecteur(trimmed, validCandidates);

  if (!matched) {
    const detected = detectAnyRelation(trimmed);
    if (detected && detected !== item.relation) {
      issues.push("wrong-relation");
      feedback.push(
        `Le connecteur utilisé exprime « ${detected} », mais on cherche « ${item.relation} ».`,
      );
    } else {
      issues.push("no-connecteur");
      feedback.push("Aucun connecteur de la bonne catégorie n'a été détecté.");
    }
    return {
      isValid: false,
      matchedConnecteur: null,
      detectedRelation: detected,
      issues,
      feedback,
    };
  }

  if (item.registreCible) {
    const producedRegistre = getRegistre(item.relation, matched);
    if (
      producedRegistre &&
      !isCompatibleRegistre(producedRegistre, item.registreCible)
    ) {
      issues.push("wrong-registre");
      feedback.push(
        `« ${matched} » est ${producedRegistre} ; le registre attendu est ${item.registreCible}.`,
      );
    }
  }

  if (item.requiertSubjonctif) {
    const requiresSubj = CONNECTEURS_BY_RELATION[item.relation].find(
      (c) => c.connecteur.toLowerCase() === matched.toLowerCase(),
    )?.subjonctif;
    if (requiresSubj && !looksLikeSubjonctif(trimmed)) {
      issues.push("missing-subjonctif");
      feedback.push(
        `« ${matched} » exige le subjonctif. Vérifiez la conjugaison du verbe qui suit.`,
      );
    }
  }

  if (issues.length === 0) {
    feedback.push(`Bien joué ! Connecteur reconnu : « ${matched} ».`);
  }

  return {
    isValid: issues.length === 0,
    matchedConnecteur: matched,
    detectedRelation: item.relation,
    issues,
    feedback,
  };
}
