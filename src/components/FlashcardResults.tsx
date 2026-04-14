import type { FlashcardRating } from "../types";

interface FlashcardResultsProps {
  sessionResults: { id: string; rating: FlashcardRating }[];
  masteredCount: number;
  totalCards: number;
  onRestart(): void;
  onHome(): void;
}

export function FlashcardResults({
  sessionResults,
  masteredCount,
  totalCards,
  onRestart,
  onHome,
}: FlashcardResultsProps) {
  const green = sessionResults.filter((r) => r.rating === 2).length;
  const yellow = sessionResults.filter((r) => r.rating === 1).length;
  const red = sessionResults.filter((r) => r.rating === 0).length;

  return (
    <div className="mx-auto w-full max-w-sm text-center">
      <p className="text-4xl">🎯</p>
      <h2 className="mt-3 text-2xl font-extrabold text-(--color-ink)">Session terminée</h2>

      {/* Session breakdown */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {(
          [
            { emoji: "🟢", label: "Je savais", count: green },
            { emoji: "🟡", label: "J'ai hésité", count: yellow },
            { emoji: "🔴", label: "Je ne savais pas", count: red },
          ] as const
        ).map(({ emoji, label, count }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-(--radius-card) bg-(--color-surface) px-3 py-4 shadow-sm"
          >
            <span className="text-2xl">{emoji}</span>
            <span className="mt-1 text-2xl font-extrabold text-(--color-ink)">{count}</span>
            <span className="text-xs text-(--color-muted)">{label}</span>
          </div>
        ))}
      </div>

      {/* Overall mastery */}
      <div className="mt-4 rounded-(--radius-card) bg-(--color-surface) px-4 py-4 shadow-sm">
        <p className="text-sm text-(--color-muted)">Fichas dominadas en total</p>
        <p className="mt-1 text-3xl font-extrabold text-(--color-ink)">
          {masteredCount}
          <span className="text-lg font-medium text-(--color-muted)"> / {totalCards}</span>
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-(--color-ink)/10">
          <div
            className="h-full rounded-full bg-(--color-brand) transition-all duration-500"
            style={{ width: `${Math.round((masteredCount / totalCards) * 100)}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="min-h-11 rounded-(--radius-card) bg-(--color-brand) px-6 py-3 font-semibold text-white transition-colors duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
        >
          Nouvelle session
        </button>
        <button
          type="button"
          onClick={onHome}
          className="min-h-11 rounded-(--radius-card) border border-(--color-ink)/12 px-6 py-3 font-semibold text-(--color-muted) transition-colors duration-150 hover:text-(--color-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
        >
          Accueil
        </button>
      </div>
    </div>
  );
}
