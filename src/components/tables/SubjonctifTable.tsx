import type { Verb } from "../../types";
import { getSubjonctifForms, SUBJONCTIF_SUBJECTS } from "../../lib/subjonctifForms";

interface SubjonctifTableProps {
  verb: Verb;
}

export function SubjonctifTable({ verb }: SubjonctifTableProps) {
  const forms = getSubjonctifForms(verb);

  return (
    <div className="mt-4 rounded-card border-2 border-correct/40 bg-[color-mix(in_oklch,var(--color-correct)_6%,transparent)] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-correct">
        Subjonctif présent — {verb.infinitive}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {SUBJONCTIF_SUBJECTS.map((subject, i) => (
          <div key={subject} className="flex items-baseline gap-2">
            <span className="w-16 shrink-0 text-right text-xs font-semibold text-muted">
              {subject}
            </span>
            <span className="text-sm font-medium text-ink" lang="fr">
              {forms[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

