import { useEffect, useRef } from "react";
import type { Flashcard, FlashcardRating } from "../types";
import { SwipeCard } from "./SwipeCard";

const CATEGORY_LABEL: Record<Flashcard["category"], string> = {
  oral: "Oral — Interaction",
  "oral-persuasion": "Oral — Persuasion",
  "écrit-faits-divers": "Écrit — Faits divers",
  connecteurs: "Connecteurs",
  argumentation: "Argumentation",
  vocabulaire: "Vocabulaire",
  touriste: "Touriste",
};

const CATEGORY_COLOR: Record<Flashcard["category"], string> = {
  oral: "bg-(--color-brand)/10 text-(--color-brand)",
  "oral-persuasion": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "écrit-faits-divers": "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  connecteurs: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  argumentation: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  vocabulaire: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  touriste: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

interface FlashcardViewProps {
  card: Flashcard;
  index: number;
  total: number;
  canGoBack: boolean;
  onRate(r: FlashcardRating): void;
  onBack(): void;
  onSkip(): void;
}

export function FlashcardView({ card, index, total, canGoBack, onRate, onBack, onSkip }: FlashcardViewProps) {
  const firstRatingRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRatingRef.current?.focus();
  }, [index]);

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Progress + nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Carte précédente"
          className="flex h-8 w-8 items-center justify-center rounded-full text-(--color-muted) transition-colors duration-150 hover:text-(--color-ink) disabled:opacity-20 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
          {index + 1} / {total}
        </p>
        <button
          type="button"
          onClick={onSkip}
          aria-label="Passer"
          className="flex h-8 w-8 items-center justify-center rounded-full text-(--color-muted) transition-colors duration-150 hover:text-(--color-ink)"
        >
          →
        </button>
      </div>

      <SwipeCard
        className="rounded-(--radius-card) bg-(--color-surface) p-4 shadow-sm sm:p-8"
        resetKey={card.id}
        onSwipeRight={() => onRate(0)}
        onSwipeLeft={() => onRate(2)}
        onSwipeDown={onSkip}
        onSwipeUp={() => onRate(1)}
      >
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLOR[card.category]}`}>
          {CATEGORY_LABEL[card.category]}
        </span>

        <p className="mt-3 text-xl font-bold leading-snug text-(--color-ink) sm:text-3xl" lang="fr">
          {card.front}
        </p>

        <div className="mt-6 border-t border-(--color-ink)/8 pt-5">
          <p className="text-sm text-(--color-muted)" lang="fr">
            {card.usage}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <button
              ref={firstRatingRef}
              type="button"
              onClick={() => onRate(0)}
              className="flex flex-col items-center gap-1 rounded-(--radius-button) bg-red-500/10 px-3 py-3 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring) dark:text-red-400"
            >
              <span className="text-xl">🔴</span>
              <span>Je ne savais pas</span>
            </button>
            <button
              type="button"
              onClick={() => onRate(1)}
              className="flex flex-col items-center gap-1 rounded-(--radius-button) bg-yellow-500/10 px-3 py-3 text-sm font-semibold text-yellow-600 transition-colors duration-150 hover:bg-yellow-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring) dark:text-yellow-400"
            >
              <span className="text-xl">🟡</span>
              <span>J'ai hésité</span>
            </button>
            <button
              type="button"
              onClick={() => onRate(2)}
              className="flex flex-col items-center gap-1 rounded-(--radius-button) bg-emerald-500/10 px-3 py-3 text-sm font-semibold text-emerald-600 transition-colors duration-150 hover:bg-emerald-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring) dark:text-emerald-400"
            >
              <span className="text-xl">🟢</span>
              <span>Je savais</span>
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-0.5 border-t border-(--color-ink)/8 pt-3">
            <p className="text-xs text-(--color-muted)" lang="en">🇬🇧 {card.translationEn}</p>
            <p className="text-xs text-(--color-muted)" lang="es">🇪🇸 {card.translationEs}</p>
          </div>
        </div>
      </SwipeCard>

      {/* Swipe hints — touch only */}
      <div className="mt-4 grid grid-cols-4 gap-1 text-center md:hidden">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base">←</span>
          <span className="text-[10px] text-red-500">No savais</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base">↑</span>
          <span className="text-[10px] text-yellow-500">Hésité</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base">→</span>
          <span className="text-[10px] text-emerald-500">Savais</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base">↓</span>
          <span className="text-[10px] text-(--color-muted)">Passer</span>
        </div>
      </div>
    </div>
  );
}
