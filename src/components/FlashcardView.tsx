import { useEffect, useRef } from "react";
import type { Flashcard, FlashcardRating } from "../types";

const CATEGORY_LABEL: Record<Flashcard["category"], string> = {
  oral: "Expression orale",
  écrit: "Écrit formel",
  connecteurs: "Connecteurs",
};

const CATEGORY_COLOR: Record<Flashcard["category"], string> = {
  oral: "bg-(--color-brand)/10 text-(--color-brand)",
  écrit: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  connecteurs: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

interface FlashcardViewProps {
  card: Flashcard;
  revealed: boolean;
  index: number;
  total: number;
  onReveal(): void;
  onRate(r: FlashcardRating): void;
}

export function FlashcardView({ card, revealed, index, total, onReveal, onRate }: FlashcardViewProps) {
  const revealRef = useRef<HTMLButtonElement>(null);
  const firstRatingRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (revealed) {
      firstRatingRef.current?.focus();
    } else {
      revealRef.current?.focus();
    }
  }, [revealed, index]);

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Progress */}
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
        {index + 1} / {total}
      </p>

      <div className="rounded-(--radius-card) bg-(--color-surface) p-6 shadow-sm sm:p-8">
        {/* Category pill */}
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLOR[card.category]}`}>
          {CATEGORY_LABEL[card.category]}
        </span>

        {/* Front — always visible */}
        <p
          className="mt-4 text-2xl font-bold leading-snug text-(--color-ink) sm:text-3xl"
          lang="fr"
        >
          {card.front}
        </p>

        {/* Back — revealed on click */}
        {!revealed ? (
          <div className="mt-8 flex justify-center">
            <button
              ref={revealRef}
              type="button"
              onClick={onReveal}
              className="min-h-11 rounded-(--radius-card) bg-(--color-brand) px-8 py-3 font-semibold text-white transition-colors duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
            >
              Voir la réponse
            </button>
          </div>
        ) : (
          <div className="mt-6 border-t border-(--color-ink)/8 pt-6">
            {/* Translations */}
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-(--color-ink)" lang="en">
                🇬🇧 {card.translationEn}
              </p>
              <p className="text-base font-medium text-(--color-ink)" lang="es">
                🇪🇸 {card.translationEs}
              </p>
            </div>

            {/* Usage note */}
            <p className="mt-3 text-sm text-(--color-muted)" lang="fr">
              {card.usage}
            </p>

            {/* Rating buttons */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              <button
                ref={firstRatingRef}
                type="button"
                onClick={() => onRate(0)}
                className="flex flex-col items-center gap-1 rounded-(--radius-button) bg-red-500/10 px-3 py-3 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring) dark:text-red-400"
              >
                <span className="text-xl">🔴</span>
                <span>No lo sabía</span>
              </button>
              <button
                type="button"
                onClick={() => onRate(1)}
                className="flex flex-col items-center gap-1 rounded-(--radius-button) bg-yellow-500/10 px-3 py-3 text-sm font-semibold text-yellow-600 transition-colors duration-150 hover:bg-yellow-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring) dark:text-yellow-400"
              >
                <span className="text-xl">🟡</span>
                <span>Dudé</span>
              </button>
              <button
                type="button"
                onClick={() => onRate(2)}
                className="flex flex-col items-center gap-1 rounded-(--radius-button) bg-emerald-500/10 px-3 py-3 text-sm font-semibold text-emerald-600 transition-colors duration-150 hover:bg-emerald-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring) dark:text-emerald-400"
              >
                <span className="text-xl">🟢</span>
                <span>Lo sabía</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
