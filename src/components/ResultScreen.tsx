import type { HistoryEntry } from "../types";

interface ResultScreenProps {
  history: HistoryEntry[];
  score: number;
  total: number;
  onRestart(): void;
  onHome(): void;
}

function tierMessage(pct: number): { emoji: string; text: string } {
  if (pct === 100) return { emoji: "🏆", text: "Parfait !" };
  if (pct >= 80) return { emoji: "🎉", text: "Excellent !" };
  if (pct >= 60) return { emoji: "👍", text: "Bon travail !" };
  if (pct >= 40) return { emoji: "📚", text: "Continue à pratiquer !" };
  return { emoji: "💪", text: "Ne lâche pas !" };
}

export function ResultScreen({ history, score, total, onRestart, onHome }: ResultScreenProps) {
  const percentage = Math.round((score / total) * 100);
  const { emoji, text } = tierMessage(percentage);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      {/* Score card */}
      <div className="rounded-(--radius-card) bg-(--color-surface) p-8 text-center shadow-sm">
        {/* Circle progress */}
        <div className="mx-auto mb-4 h-28 w-28" aria-hidden="true">
          <svg viewBox="0 0 80 80" className="-rotate-90">
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-(--color-ink)/8"
            />
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-(--color-brand) transition-all duration-700"
            />
          </svg>
        </div>

        <p className="text-5xl font-extrabold tabular-nums text-(--color-ink)" aria-label={`Score : ${score} sur ${total}`}>
          {score}<span className="text-2xl font-medium text-(--color-muted)">/{total}</span>
        </p>
        <p className="mt-1 text-lg text-(--color-muted)">{percentage}%</p>
        <p className="mt-3 text-2xl">{emoji}</p>
        <p className="mt-1 text-base font-semibold text-(--color-ink)">{text}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="min-h-11 rounded-(--radius-button) bg-(--color-brand) px-8 py-3 font-semibold text-white transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
          >
            Rejouer
          </button>
          <button
            type="button"
            onClick={onHome}
            className="min-h-11 rounded-(--radius-button) border-2 border-(--color-ink)/10 bg-(--color-surface) px-8 py-3 font-semibold text-(--color-ink) transition-colors duration-150 hover:border-(--color-ink)/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
          >
            ← Accueil
          </button>
        </div>
      </div>

      {/* History */}
      <section aria-label="Récapitulatif des réponses">
        <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-(--color-muted)">
          Récapitulatif
        </h2>
        <ol className="space-y-1.5">
          {history.map((entry, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-(--radius-button) bg-(--color-surface) px-4 py-3 shadow-sm"
            >
              <span
                aria-hidden="true"
                className={`shrink-0 text-sm font-bold ${entry.correct ? "text-(--color-correct)" : "text-(--color-wrong)"}`}
              >
                {entry.correct ? "✓" : "✗"}
              </span>
              <span className="min-w-0 flex-1 font-medium text-(--color-ink)" lang="fr">
                {entry.verb.infinitive}
              </span>
              {!entry.correct && (
                <span className="text-sm text-(--color-muted)" lang="fr">
                  <span className="text-(--color-wrong)">{entry.picked}</span>
                  {" → "}
                  <span className="text-(--color-correct)">{entry.verb.participle}</span>
                </span>
              )}
              {entry.correct && (
                <span className="text-sm font-medium text-(--color-correct)" lang="fr">
                  {entry.verb.participle}
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
