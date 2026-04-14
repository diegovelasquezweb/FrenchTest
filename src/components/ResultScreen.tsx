import type { HistoryEntry } from "../types";

interface ResultScreenProps {
  history: HistoryEntry[];
  score: number;
  total: number;
  onRestart(): void;
  onHome(): void;
}

export function ResultScreen({ history, score, total, onRestart, onHome: _onHome }: ResultScreenProps) {
  const pct = score / total;
  const scoreColor =
    pct >= 0.8 ? "text-(--color-correct)"
    : pct >= 0.5 ? "text-(--color-brand)"
    : "text-(--color-wrong)";
  const barColor =
    pct >= 0.8 ? "var(--color-correct)"
    : pct >= 0.5 ? "var(--color-brand)"
    : "var(--color-wrong)";

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3">

      {/* ── Score card ── */}
      <div className="rounded-(--radius-card) bg-(--color-surface) px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <p aria-label={`${score} sur ${total}`} className="leading-none">
            <span className={`text-4xl font-extrabold tabular-nums ${scoreColor}`}>{score}</span>
            <span className="text-xl font-medium text-(--color-muted)">/{total}</span>
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-(--radius-button) bg-(--color-brand) px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
          >
            Rejouer
          </button>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-(--color-ink)/8">
          <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: barColor }} />
        </div>
      </div>

      {/* ── History ── */}
      <section aria-label="Récapitulatif des réponses">
        <p className="mb-1.5 px-0.5 text-[11px] font-semibold uppercase tracking-widest text-(--color-muted)">
          Récapitulatif
        </p>
        <ol className="grid grid-cols-2 gap-1.5">
          {history.map((entry, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 rounded-(--radius-button) bg-(--color-surface) px-3 py-2 shadow-sm"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: entry.correct ? "var(--color-correct)" : "var(--color-wrong)" }}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-(--color-ink)" lang="fr">
                {entry.verb.infinitive}
              </span>
              <span
                className="shrink-0 text-xs font-semibold"
                style={{ color: entry.correct ? "var(--color-correct)" : "var(--color-wrong)" }}
                lang="fr"
              >
                {entry.verb.participle}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
