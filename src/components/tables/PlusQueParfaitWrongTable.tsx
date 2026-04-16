import type { Verb } from "../../types";
import { buildPlusQueParfaitForms, PQP_SUBJECTS } from "../../lib/plusQueParfaitForms";

interface PlusQueParfaitWrongTableProps {
  verb: Verb;
  wrongForm: string;
  wrongSubject: string;
  targetSubject: string;
}

export function PlusQueParfaitWrongTable({
  verb,
  wrongForm,
  wrongSubject,
  targetSubject,
}: PlusQueParfaitWrongTableProps) {
  const forms = buildPlusQueParfaitForms(verb);

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
        au plus-que-parfait :
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {PQP_SUBJECTS.map((subject, i) => (
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

