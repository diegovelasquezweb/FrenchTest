import type { ParticipleEnding } from "../types";

export function classifyEnding(participle: string): ParticipleEnding {
  if (participle.endsWith("ert")) return "-ert";
  if (participle.endsWith("int")) return "-int";
  if (participle.endsWith("is")) return "-is";
  if (participle.endsWith("it")) return "-it";
  if (participle.endsWith("é")) return "-é";
  if (participle.endsWith("i")) return "-i";
  if (participle.endsWith("u") || participle.endsWith("û")) return "-u";
  return "other";
}
