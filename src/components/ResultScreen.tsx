import type { HistoryEntry } from "../types";

interface ResultScreenProps {
  history: HistoryEntry[];
  score: number;
  total: number;
  onRestart(): void;
  onHome(): void;
}

export function ResultScreen({ history, score, total, onRestart, onHome }: ResultScreenProps) {
  const pct = score / total;
  const scoreColor =
    pct >= 0.8 ? "text-(--color-correct)"
    : pct >= 0.5 ? "text-(--color-ink)"
    : "text-(--color-wrong)";

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3">

      {/* ── Score bar ── */}
      <div className="rounded-(--radius-card) bg-(--color-surface) px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between gap-6">
          {/* Score number */}
          <p aria-label={`Score : ${score} sur ${total}`}>
            <span className={`text-4xl font-extrabold tabular-nums ${scoreColor}`}>{score}</span>
            <span className="text-xl font-medium text-(--color-muted)">/{total}</span>
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onHome}
              className="rounded-(--radius-button) border-2 border-(--color-ink)/12 px-4 py-2 text-sm font-semibold text-(--color-ink) transition-colors hover:border-(--color-ink)/24 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
            >
              ← Accueil
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-(--radius-button) bg-(--color-brand) px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
            >
              Rejouer
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-(--color-ink)/8">
          <div
            className="h-full rounded-full bg-(--color-brand) transition-all duration-500"
            style={{ width: `${pct * 100}%` }}
            role="presentation"
          />
        </div>
      </div>

      {/* ── History ── */}
      <section aria-label="Récapitulatif des réponses">
        <p className="mb-1.5 px-0.5 text-xs font-semibold uppercase tracking-widest text-(--color-muted)">
          Récapitulatif
        </p>
        <ol className="grid grid-cols-2 gap-1.5">
          {history.map((entry, i) => (
            <li
              key={i}
              className={[
                "flex items-center gap-2.5 overflow-hidden rounded-xl px-3 py-2",
                entry.correct
                  ? "bg-[color-mix(in_oklch,var(--color-correct)_8%,var(--color-surface))]"
                  : "bg-[color-mix(in_oklch,var(--color-wrong)_8%,var(--color-surface))]",
              ].join(" ")}
            >
              {/* Colored left accent */}
              <span
                aria-hidden="true"
                className={`shrink-0 text-xs font-bold ${entry.correct ? "text-(--color-correct)" : "text-(--color-wrong)"}`}
              >
                {entry.correct ? "✓" : "✗"}
              </span>

              {/* Verb */}
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-(--color-ink)" lang="fr">
                {entry.verb.infinitive}
              </span>

              {/* Answer */}
              <span className="shrink-0 text-xs font-semibold" lang="fr">
                {entry.correct
                  ? <span className="text-(--color-correct)">{entry.verb.participle}</span>
                  : <span className="text-(--color-wrong)">{entry.verb.participle}</span>
                }
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
