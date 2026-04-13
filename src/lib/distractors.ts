import type { Verb } from "../types";
import { classifyEnding } from "./groups";
import { fisherYates } from "./shuffle";

const CURATED_CONFUSIONS: Record<string, string[]> = {
  pris: ["prendu", "prisé"],
  mis: ["misé", "mit"],
  ouvert: ["ouvré", "ouvri"],
  été: ["étai", "étu"],
  fait: ["faisé", "fais"],
  vu: ["vi", "vié"],
  dit: ["disé", "disu"],
  écrit: ["écrisu", "écrisé"],
  mort: ["mouru", "mourté"],
  né: ["naiu", "naissé"],
  eu: ["avé", "avi"],
  allé: ["allé", "ali"],
};

export function generateDistractors(
  target: Verb,
  pool: Verb[],
  rng: () => number
): [string, string, string] {
  const correct = target.participle;
  const poolParticiples = new Set(pool.map((v) => v.participle));
  const collected: string[] = [];

  const addUnique = (candidate: string): boolean => {
    if (candidate !== correct && !collected.includes(candidate)) {
      collected.push(candidate);
      return true;
    }
    return false;
  };

  const targetEnding = classifyEnding(correct);
  const sameBucket = fisherYates(
    pool.filter((v) => v.participle !== correct && classifyEnding(v.participle) === targetEnding),
    rng
  );
  for (const v of sameBucket) {
    if (collected.length >= 3) break;
    addUnique(v.participle);
  }

  if (collected.length < 3) {
    const curated = CURATED_CONFUSIONS[correct] ?? [];
    for (const c of curated) {
      if (collected.length >= 3) break;
      if (!poolParticiples.has(c)) {
        addUnique(c);
      }
    }
  }

  if (collected.length < 3) {
    const crossBucket = fisherYates(
      pool.filter((v) => v.participle !== correct && !collected.includes(v.participle)),
      rng
    );
    for (const v of crossBucket) {
      if (collected.length >= 3) break;
      addUnique(v.participle);
    }
  }

  if (collected.length < 3) {
    const transforms = buildTransforms(target);
    for (const t of transforms) {
      if (collected.length >= 3) break;
      if (!poolParticiples.has(t)) {
        addUnique(t);
      }
    }
  }

  const result = collected.slice(0, 3);
  while (result.length < 3) {
    result.push(`${target.infinitive.slice(0, 3)}é`);
  }

  return result as [string, string, string];
}

function buildTransforms(verb: Verb): string[] {
  const inf = verb.infinitive;
  if (inf.endsWith("er")) {
    const stem = inf.slice(0, -2);
    return [`${stem}i`, `${stem}u`];
  }
  if (inf.endsWith("ir")) {
    const stem = inf.slice(0, -2);
    return [`${stem}é`, `${stem}u`];
  }
  if (inf.endsWith("re")) {
    const stem = inf.slice(0, -2);
    return [`${stem}é`, `${stem}i`];
  }
  const stem = inf.length > 4 ? inf.slice(0, -2) : inf;
  return [`${stem}é`, `${stem}i`, `${stem}u`];
}
