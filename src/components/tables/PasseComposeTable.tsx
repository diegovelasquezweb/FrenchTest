import type { Verb } from "../../types";
import { buildPasseCompose } from "../../lib/passeCompose";

interface PasseComposeTableProps {
  verb: Verb;
}

export function PasseComposeTable({ verb }: PasseComposeTableProps) {
  const rows = buildPasseCompose(verb);

  return (
    <div className="mt-4 rounded-card border-2 border-correct/40 bg-[color-mix(in_oklch,var(--color-correct)_6%,transparent)] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-correct">
        Passé composé — {verb.infinitive}
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
      {verb.auxiliary === "être" && (
        <p className="mt-3 text-xs text-muted">
          * avec être, le participe s'accorde avec le sujet.
        </p>
      )}
    </div>
  );
}
