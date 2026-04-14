import type { Verb } from "../types";
import { buildTenseConjugation } from "../lib/tenseConjugation";

interface ImparfaitTableProps {
  verb: Verb;
  imparfait3sg: string;
}

export function ImparfaitTable({ verb, imparfait3sg }: ImparfaitTableProps) {
  const { rows } = buildTenseConjugation("imparfait", imparfait3sg);

  return (
    <div className="mt-4 rounded-(--radius-card) border-2 border-(--color-correct)/40 bg-[color-mix(in_oklch,var(--color-correct)_6%,transparent)] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-correct)">
        Imparfait — {verb.infinitive}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {rows.map(({ subject, form }) => (
          <div key={subject} className="flex items-baseline gap-2">
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-(--color-muted)">
              {subject}
            </span>
            <span className="text-sm font-medium text-(--color-ink)" lang="fr">
              {form}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
