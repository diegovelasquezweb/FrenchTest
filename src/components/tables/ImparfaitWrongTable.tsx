import type { Verb } from "../../types";
import { buildTenseConjugation } from "../../lib/tenseConjugation";

interface ImparfaitWrongTableProps {
  verb: Verb;
  wrongForm: string;      // e.g. "parliez"
  wrongSubject: string;   // e.g. "vous"
  targetSubject: string;  // e.g. "nous"
  imparfait3sg: string;   // to build the full conjugation table
}

export function ImparfaitWrongTable({
  verb,
  wrongForm,
  wrongSubject,
  targetSubject,
  imparfait3sg,
}: ImparfaitWrongTableProps) {
  const { rows } = buildTenseConjugation("imparfait", imparfait3sg);

  return (
    <div className="mt-4 rounded-card border-2 border-wrong/40 bg-[color-mix(in_oklch,var(--color-wrong)_6%,transparent)] p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-wrong">
        "{wrongForm}" est la forme de{" "}
        <span lang="fr">{wrongSubject}</span>, pas de{" "}
        <span lang="fr">{targetSubject}</span>
      </p>
      <p className="mb-3 text-xs text-muted">
        Conjugaison complète de{" "}
        <strong className="text-ink" lang="fr">
          {verb.infinitive}
        </strong>{" "}
        à l'imparfait :
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {rows.map(({ subject, form }) => (
          <div key={subject} className="flex items-baseline gap-2">
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-muted">
              {subject}
            </span>
            <span className="text-sm font-medium text-ink" lang="fr">
              {form}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
