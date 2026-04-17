import type { Verb } from "../../types";
import { getPresentForms, PRESENT_SUBJECTS } from "../../lib/presentForms";

interface PresentTableProps {
  verb: Verb;
}

export function PresentTable({ verb }: PresentTableProps) {
  const forms = getPresentForms(verb);

  return (
    <div className="mt-4 rounded-card border-2 border-correct/40 bg-[color-mix(in_oklch,var(--color-correct)_6%,transparent)] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-correct">
        Présent — {verb.infinitive}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {PRESENT_SUBJECTS.map((subject, i) => {
          const form = forms[i];
          if (!form || form === "—") return null;
          return (
            <div key={subject} className="flex items-baseline gap-2">
              <span className="w-14 shrink-0 text-right text-xs font-semibold text-muted">
                {subject}
              </span>
              <span className="text-sm font-medium text-ink" lang="fr">
                {form}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
