import type { Flashcard, FlashcardRating } from "../../types";

interface FlashcardResultsProps {
  sessionResults: { id: string; rating: FlashcardRating }[];
  masteredCount: number;
  totalCards: number;
  cards: Flashcard[];
  onRestart(): void;
  onHome(): void;
}

function motivation(pct: number): string {
  if (pct === 1)   return "Session parfaite — tu les maîtrises toutes !";
  if (pct >= 0.8)  return "Très bien ! Tu avances rapidement.";
  if (pct >= 0.6)  return "Bonne session. Continue régulièrement.";
  if (pct >= 0.4)  return "Tu progresses. La répétition fait la différence.";
  return "Chaque session compte. Tu vas y arriver.";
}

export function FlashcardResults({ sessionResults, masteredCount, totalCards, cards, onRestart, onHome }: FlashcardResultsProps) {
  const green  = sessionResults.filter(r => r.rating === 2).length;
  const yellow = sessionResults.filter(r => r.rating === 1).length;
  const red    = sessionResults.filter(r => r.rating === 0).length;
  const pct    = sessionResults.length > 0 ? green / sessionResults.length : 0;
  const masteredPct = totalCards > 0 ? masteredCount / totalCards : 0;

  const toReview  = sessionResults.filter(r => r.rating === 0).map(r => cards.find(c => c.id === r.id)).filter((c): c is Flashcard => c !== undefined);
  const hesitated = sessionResults.filter(r => r.rating === 1).map(r => cards.find(c => c.id === r.id)).filter((c): c is Flashcard => c !== undefined);
  const mastered  = sessionResults.filter(r => r.rating === 2).map(r => cards.find(c => c.id === r.id)).filter((c): c is Flashcard => c !== undefined);

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-6">
    <div className="flex w-full max-w-lg flex-col gap-4">

      {/* ── Score header ── */}
      <div className="rounded-card bg-surface px-6 py-5 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="leading-none">
              <span className="text-5xl font-extrabold tabular-nums text-ink">{green}</span>
              <span className="text-2xl font-medium text-muted">/{sessionResults.length}</span>
            </p>
            <p className="mt-1.5 text-sm text-muted">{motivation(pct)}</p>
          </div>
          <span className="text-lg font-bold tabular-nums text-muted">
            {Math.round(pct * 100)} %
          </span>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {([
            { count: green,  label: "Savais",      dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
            { count: yellow, label: "Hésité",      dot: "bg-yellow-400",  text: "text-yellow-600 dark:text-yellow-400"  },
            { count: red,    label: "Ne savais pas", dot: "bg-red-500",   text: "text-red-500 dark:text-red-400"        },
          ] as const).map(({ count, label, dot, text }) => (
            <div key={label} className="flex flex-col items-center rounded-button bg-ink/4 px-2 py-2.5">
              <span className={`text-xl font-extrabold ${text}`}>{count}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Maîtrise globale ── */}
      <div className="rounded-card bg-surface px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Maîtrise totale</p>
          <p className="text-sm font-bold text-ink">
            {masteredCount}
            <span className="font-medium text-muted"> / {totalCards}</span>
          </p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-ink/8">
          <div
            className="h-full rounded-full bg-brand transition-all duration-700"
            style={{ width: `${masteredPct * 100}%` }}
          />
        </div>
      </div>

      {/* ── Récapitulatif complet ── */}
      {sessionResults.length > 0 && (
        <section aria-label="Récapitulatif de la session">
          <p className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-widest text-muted">
            Récapitulatif
          </p>
          <ol className="flex flex-col gap-1.5">
            {[
              ...toReview.map(c => ({ card: c, dot: "bg-red-400" })),
              ...hesitated.map(c => ({ card: c, dot: "bg-yellow-400" })),
              ...mastered.map(c => ({ card: c, dot: "bg-emerald-400" })),
            ].map(({ card, dot }) => (
              <li
                key={card.id}
                className="flex items-start gap-3 rounded-button bg-surface px-4 py-2.5 shadow-sm"
              >
                <span className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
                <p className="min-w-0 flex-1 text-sm text-ink leading-snug" lang="fr">{card.front}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 min-h-11 rounded-card bg-brand px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Nouvelle session
        </button>
        <button
          type="button"
          onClick={onHome}
          className="flex-1 min-h-11 rounded-card border border-ink/12 px-6 py-3 font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Accueil
        </button>
      </div>
    </div>
    </div>
  );
}
