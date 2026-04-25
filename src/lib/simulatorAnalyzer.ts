import { CONNECTEURS_BY_RELATION } from "../data/connecteursProduction";
import type { SimulatorPrompt } from "../data/simulatorPrompts";

export type AnalysisCategory =
  | "longueur"
  | "connecteurs"
  | "registre"
  | "lexique"
  | "structure";

export type AnalysisFinding = {
  category: AnalysisCategory;
  status: "ok" | "warn" | "error";
  message: string;
};

export type Analysis = {
  wordCount: number;
  meetsMinimum: boolean;
  connecteursFound: { connecteur: string; relation: string }[];
  uniqueRelations: number;
  repeatedWords: { word: string; count: number }[];
  findings: AnalysisFinding[];
  globalScore: number;
};

const FAMILIAR_MARKERS = [
  /\bça\b/gi,
  /\by'a\b/gi,
  /\bon\s+a\s+pas\b/gi,
  /\bj'sais\b/gi,
  /\bbah\b/gi,
  /\bbref\b/gi,
];

const STOP_WORDS = new Set([
  "le", "la", "les", "un", "une", "des", "de", "du", "et", "à", "au", "aux",
  "ou", "où", "que", "qui", "dans", "sur", "pour", "par", "en", "avec", "sans",
  "ce", "cet", "cette", "ces", "il", "elle", "ils", "elles", "on", "je", "tu",
  "nous", "vous", "se", "ne", "pas", "plus", "très", "trop", "si", "mais",
  "est", "sont", "été", "être", "a", "ai", "as", "avons", "avez", "ont",
  "son", "sa", "ses", "mon", "ma", "mes", "ton", "ta", "tes", "leur", "leurs",
  "y", "d'", "l'", "qu'", "j'", "n'", "s'", "c'", "m'", "t'",
  "comme", "tout", "tous", "toute", "toutes", "même", "aussi", "bien",
]);

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter((w) => /\w/.test(w)).length;
}

function findConnecteursInText(text: string): { connecteur: string; relation: string }[] {
  const found: { connecteur: string; relation: string }[] = [];
  const seen = new Set<string>();
  const lower = ` ${text.toLowerCase()} `;
  for (const [relation, list] of Object.entries(CONNECTEURS_BY_RELATION)) {
    const sorted = [...list].sort((a, b) => b.connecteur.length - a.connecteur.length);
    for (const { connecteur } of sorted) {
      const key = `${connecteur}::${relation}`;
      if (seen.has(key)) continue;
      const escaped = connecteur.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(^|[\\s,;.!?:'"(])${escaped}(?=$|[\\s,;.!?:'"()])`, "i");
      if (re.test(lower)) {
        found.push({ connecteur, relation });
        seen.add(key);
      }
    }
  }
  return found;
}

function findRepeatedContentWords(text: string): { word: string; count: number }[] {
  const counts = new Map<string, number>();
  const tokens = text
    .toLowerCase()
    .replace(/[.,;:!?()"«»–—\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 4 && !STOP_WORDS.has(t));
  for (const t of tokens) {
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, c]) => c >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
}

function detectFamiliarRegistre(text: string): string[] {
  const hits: string[] = [];
  for (const re of FAMILIAR_MARKERS) {
    const matches = text.match(re);
    if (matches) hits.push(matches[0]);
  }
  return hits;
}

function hasIntroduction(text: string): boolean {
  const firstChars = text.slice(0, 200).toLowerCase();
  return /(je pense|à mon avis|selon moi|d'après moi|il me semble|personnellement|de mon point de vue)/.test(
    firstChars,
  );
}

function hasConclusion(text: string): boolean {
  const lastChars = text.slice(-300).toLowerCase();
  return /(en conclusion|en définitive|pour conclure|finalement|en somme|ainsi|en résumé)/.test(
    lastChars,
  );
}

export function analyzeProduction(text: string, prompt: SimulatorPrompt): Analysis {
  const findings: AnalysisFinding[] = [];
  const wordCount = countWords(text);
  const meetsMinimum = wordCount >= prompt.minWords;

  if (wordCount === 0) {
    findings.push({
      category: "longueur",
      status: "error",
      message: "Le texte est vide.",
    });
  } else if (wordCount < prompt.minWords * 0.75) {
    findings.push({
      category: "longueur",
      status: "error",
      message: `Trop court : ${wordCount} mots (minimum ${prompt.minWords}). Forte pénalité au TEF.`,
    });
  } else if (wordCount < prompt.minWords) {
    findings.push({
      category: "longueur",
      status: "warn",
      message: `Sous le minimum : ${wordCount} mots (minimum ${prompt.minWords}).`,
    });
  } else {
    findings.push({
      category: "longueur",
      status: "ok",
      message: `Longueur respectée : ${wordCount} mots.`,
    });
  }

  const connecteurs = findConnecteursInText(text);
  const uniqueRelations = new Set(connecteurs.map((c) => c.relation)).size;
  if (connecteurs.length === 0 && wordCount > 30) {
    findings.push({
      category: "connecteurs",
      status: "error",
      message: "Aucun connecteur logique détecté. La cohérence sera fortement pénalisée.",
    });
  } else if (uniqueRelations < 2 && wordCount >= prompt.minWords) {
    findings.push({
      category: "connecteurs",
      status: "warn",
      message: `Peu de variété : ${connecteurs.length} connecteur(s), ${uniqueRelations} relation(s). Variez davantage.`,
    });
  } else if (connecteurs.length >= 3) {
    findings.push({
      category: "connecteurs",
      status: "ok",
      message: `${connecteurs.length} connecteurs · ${uniqueRelations} relations distinctes. Bonne variété.`,
    });
  }

  if (prompt.registre === "formel argumentatif") {
    const familiar = detectFamiliarRegistre(text);
    if (familiar.length > 0) {
      findings.push({
        category: "registre",
        status: "warn",
        message: `Marqueurs familiers détectés : ${[...new Set(familiar)].join(", ")}. Évitez-les en registre formel.`,
      });
    } else if (wordCount >= 50) {
      findings.push({
        category: "registre",
        status: "ok",
        message: "Registre formel maintenu — aucun marqueur familier détecté.",
      });
    }
  }

  const repeatedWords = findRepeatedContentWords(text);
  if (repeatedWords.length > 0) {
    findings.push({
      category: "lexique",
      status: "warn",
      message: `Répétitions : ${repeatedWords
        .map((r) => `« ${r.word} » (×${r.count})`)
        .join(", ")}. Variez le vocabulaire.`,
    });
  } else if (wordCount >= prompt.minWords) {
    findings.push({
      category: "lexique",
      status: "ok",
      message: "Bonne variété lexicale.",
    });
  }

  if (prompt.section === "B" && wordCount >= 100) {
    const introOk = hasIntroduction(text);
    const conclusionOk = hasConclusion(text);
    if (!introOk) {
      findings.push({
        category: "structure",
        status: "warn",
        message: "Aucune marque d'introduction explicite (« à mon avis », « selon moi »…).",
      });
    }
    if (!conclusionOk) {
      findings.push({
        category: "structure",
        status: "warn",
        message: "Aucune marque de conclusion (« en conclusion », « pour conclure »…).",
      });
    }
    if (introOk && conclusionOk) {
      findings.push({
        category: "structure",
        status: "ok",
        message: "Structure claire : introduction + conclusion identifiées.",
      });
    }
  }

  const okCount = findings.filter((f) => f.status === "ok").length;
  const warnCount = findings.filter((f) => f.status === "warn").length;
  const errorCount = findings.filter((f) => f.status === "error").length;
  const total = findings.length || 1;
  const globalScore = Math.max(
    0,
    Math.round(((okCount * 1 + warnCount * 0.5 + errorCount * 0) / total) * 100),
  );

  return {
    wordCount,
    meetsMinimum,
    connecteursFound: connecteurs,
    uniqueRelations,
    repeatedWords,
    findings,
    globalScore,
  };
}
