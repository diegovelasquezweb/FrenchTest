import type { Verb } from "../types";
import { buildTenseConjugation } from "../lib/tenseConjugation";

interface WrongAnswerTableProps {
  verb: Verb;
  wrongOption: string;
}

export function WrongAnswerTable({ verb, wrongOption }: WrongAnswerTableProps) {
  const confuserIdx = verb.confusers.indexOf(wrongOption);
  if (confuserIdx === -1) return null;

  const tense = verb.confuserTenses[confuserIdx];
  const { label, rows, partial } = buildTenseConjugation(tense, wrongOption);

  return (
    <div className="mt-4 rounded-xl border-2 border-(--color-wrong)/40 bg-[color-mix(in_oklch,var(--color-wrong)_6%,transparent)] p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-(--color-wrong)">
        "{wrongOption}" est le {label} de {verb.infinitive}
      </p>
      <p className="mb-3 text-xs text-(--color-muted)">
        La bonne réponse est le participe passé : <strong className="text-(--color-ink)" lang="fr">{verb.participle}</strong>
      </p>
      <div className={`grid gap-x-4 gap-y-1 ${partial ? "grid-cols-1" : "grid-cols-2"}`}>
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
      {partial && (
        <p className="mt-2 text-xs text-(--color-muted)">
          * Verbe irrégulier — la conjugaison complète du présent varie selon le sujet.
        </p>
      )}
    </div>
  );
}
