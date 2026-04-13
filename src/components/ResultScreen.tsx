import type { HistoryEntry } from "../types";

interface ResultScreenProps {
  history: HistoryEntry[];
  score: number;
  total: number;
  onRestart(): void;
}

function tierMessage(percentage: number): string {
  if (percentage >= 80) return "Excellent work!";
  if (percentage >= 50) return "Good effort!";
  return "Keep practising!";
}

export function ResultScreen({ history, score, total, onRestart }: ResultScreenProps) {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="rounded-(--radius-card) bg-(--color-surface) p-6 text-center shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-(--color-ink)">Quiz Complete</h2>
        <p
          className="mt-2 text-4xl font-extrabold text-(--color-brand)"
          aria-label={`Score: ${score} out of ${total}`}
        >
          {score} / {total}
        </p>
        <p className="mt-1 text-lg text-(--color-muted)">{percentage}%</p>
        <p className="mt-3 text-base font-semibold text-(--color-ink)">
          {tierMessage(percentage)}
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 min-h-11 rounded-xl bg-(--color-brand) px-8 py-3 font-semibold text-white transition-colors duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
        >
          Play Again
        </button>
      </div>

      <section aria-label="Answer history">
        <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wider text-(--color-muted)">
          Review
        </h2>
        <ol className="space-y-2">
          {history.map((entry, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl bg-(--color-surface) px-4 py-3 shadow-sm"
              aria-label={`${entry.verb.infinitive}: you answered ${entry.picked}, correct answer is ${entry.verb.participle}`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 shrink-0 text-base font-bold ${entry.correct ? "text-(--color-correct)" : "text-(--color-wrong)"}`}
              >
                {entry.correct ? "✓" : "✗"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-(--color-ink)" lang="fr">
                  {entry.verb.infinitive}
                </p>
                {!entry.correct && (
                  <p className="text-sm text-(--color-muted)">
                    You answered:{" "}
                    <span className="font-medium text-(--color-wrong)" lang="fr">
                      {entry.picked}
                    </span>{" "}
                    · Correct:{" "}
                    <span className="font-medium text-(--color-correct)" lang="fr">
                      {entry.verb.participle}
                    </span>
                  </p>
                )}
                {entry.correct && (
                  <p className="text-sm text-(--color-muted)">
                    <span className="font-medium text-(--color-correct)" lang="fr">
                      {entry.verb.participle}
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
