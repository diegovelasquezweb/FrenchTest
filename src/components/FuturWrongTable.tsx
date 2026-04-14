import type { Verb } from "../types";
import { buildTenseConjugation } from "../lib/tenseConjugation";

interface FuturWrongTableProps {
  verb: Verb;
  wrongForm: string;
  wrongSubject: string;
  targetSubject: string;
  futur3sg: string;
}

export function FuturWrongTable({
  verb,
  wrongForm,
  wrongSubject,
  targetSubject,
  futur3sg,
}: FuturWrongTableProps) {
  const { rows } = buildTenseConjugation("futur", futur3sg);

  return (
    <div className="mt-4 rounded-(--radius-card) border-2 border-(--color-wrong)/40 bg-[color-mix(in_oklch,var(--color-wrong)_6%,transparent)] p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-(--color-wrong)">
        "{wrongForm}" est la forme de{" "}
        <span lang="fr">{wrongSubject}</span>, pas de{" "}
        <span lang="fr">{targetSubject}</span>
      </p>
      <p className="mb-3 text-xs text-(--color-muted)">
        Conjugaison complète de{" "}
        <strong className="text-(--color-ink)" lang="fr">
          {verb.infinitive}
        </strong>{" "}
        au futur :
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
