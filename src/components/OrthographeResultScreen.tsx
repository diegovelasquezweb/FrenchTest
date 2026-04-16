import type { OrthographeQuestion } from "../types";

interface OrthographeResultScreenProps {
  history: { question: OrthographeQuestion; picked: string; correct: boolean }[];
  score: number;
  total: number;
  onRestart(): void;
  onHome(): void;
}

function motivation(pct: number): string {
  if (pct === 1)   return "Parfait — aucune erreur.";
  if (pct >= 0.8)  return "Excellent ! Quelques détails à peaufiner.";
  if (pct >= 0.6)  return "Bien joué. Continue à consolider.";
  if (pct >= 0.4)  return "Bon début — revois les erreurs ci-dessous.";
  return "Chaque erreur te rapproche de la maîtrise. Continue.";
}

export function OrthographeResultScreen({ history, score, total, onRestart, onHome }: OrthographeResultScreenProps) {
  const pct = total > 0 ? score / total : 0;
  const wrong = history.filter(e => !e.correct);

  const accent =
    pct >= 0.8 ? { text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" }
    : pct >= 0.5 ? { text: "text-(--color-brand)", bar: "bg-(--color-brand)" }
    : { text: "text-red-500 dark:text-red-400", bar: "bg-red-500" };

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-6">
    <div className="w-full max-w-lg flex flex-col gap-4">

      {/* ── Score header ── */}
      <div className="rounded-(--radius-card) bg-(--color-surface) px-6 py-5 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="leading-none">
              <span className={`text-5xl font-extrabold tabular-nums ${accent.text}`}>{score}</span>
              <span className="text-2xl font-medium text-(--color-muted)">/{total}</span>
            </p>
            <p className="mt-1.5 text-sm text-(--color-muted)">{motivation(pct)}</p>
          </div>
          <span className={`text-lg font-bold tabular-nums ${accent.text}`}>
            {Math.round(pct * 100)} %
          </span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-(--color-ink)/8">
          <div className={`h-full rounded-full transition-all duration-700 ${accent.bar}`} style={{ width: `${pct * 100}%` }} />
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-(--color-muted)">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {score} correct{score > 1 ? "s" : ""}
          </span>
          {wrong.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              {wrong.length} erreur{wrong.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* ── Récapitulatif ── */}
      <section aria-label="Récapitulatif des réponses">
        <p className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-widest text-(--color-muted)">
          Récapitulatif
        </p>
        <ol className="flex flex-col gap-2">
          {history.map((entry, i) => {
            const correct = entry.question.options[entry.question.correctIndex];
            return (
              <li
                key={i}
                className="rounded-(--radius-button) bg-(--color-surface) px-4 py-3 shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${entry.correct ? "bg-emerald-400" : "bg-red-400"}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-(--color-ink)" lang="fr">
                      {entry.question.sentence.replace("___", `‹${correct}›`)}
                    </p>
                    {!entry.correct && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs" lang="fr">
                        <span className="text-red-500 line-through">{entry.picked}</span>
                        <span className="text-(--color-muted)">→</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{correct}</span>
                      </p>
                    )}
                    {entry.question.explanation && (
                      <p className="mt-1.5 text-xs text-(--color-muted) leading-relaxed">
                        {entry.question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 min-h-11 rounded-(--radius-card) bg-(--color-brand) px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
        >
          Rejouer
        </button>
        <button
          type="button"
          onClick={onHome}
          className="flex-1 min-h-11 rounded-(--radius-card) border border-(--color-ink)/12 px-6 py-3 font-semibold text-(--color-muted) transition-colors hover:text-(--color-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
        >
          Accueil
        </button>
      </div>
    </div>
    </div>
  );
}
