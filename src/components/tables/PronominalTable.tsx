import type { PronominalQuestion } from "../../lib/pronominalQuestions";
import { buildPronominalConjugation } from "../../lib/pronominalQuestions";

interface PronominalTableProps {
  question: PronominalQuestion;
}

export function PronominalTable({ question }: PronominalTableProps) {
  const rows = buildPronominalConjugation(question.verb, question.tense);

  return (
    <div className="mt-4 rounded-(--radius-card) border-2 border-(--color-correct)/40 bg-[color-mix(in_oklch,var(--color-correct)_6%,transparent)] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-correct)">
        {question.tense} — {question.verb.infinitive}
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

