import { useCallback, useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Heart, HelpCircle } from "lucide-react";
import type { Flashcard, FlashcardRating } from "../types";
import { SwipeCard } from "./SwipeCard";

type FlashColor = "red" | "yellow" | "emerald" | null;

const FLASH_DURATION_MS = 280;

const FLASH_RING: Record<Exclude<FlashColor, null>, string> = {
  red:     "ring-red-300 dark:ring-red-500/50",
  yellow:  "ring-yellow-300 dark:ring-yellow-400/50",
  emerald: "ring-emerald-300 dark:ring-emerald-500/50",
};

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
  onRate(r: FlashcardRating): void;
  onSkip(): void;
  isFavorite?: boolean;
  onToggleFavorite?(): void;
}

export function FlashcardView({ card, index, total, onRate, onSkip, isFavorite, onToggleFavorite }: FlashcardViewProps) {
  const firstRatingRef = useRef<HTMLButtonElement>(null);
  const [flash, setFlash] = useState<FlashColor>(null);
  const pending = useRef(false);

  useEffect(() => {
    firstRatingRef.current?.focus();
  }, [index]);

  // Clear flash overlay whenever a new card renders.
  useEffect(() => { setFlash(null); pending.current = false; }, [card.id]);

  const triggerRate = useCallback((r: FlashcardRating) => {
    if (pending.current) return;
    pending.current = true;
    setFlash(r === 2 ? "emerald" : r === 0 ? "red" : "yellow");
    window.setTimeout(() => onRate(r), FLASH_DURATION_MS);
  }, [onRate]);

  const triggerSkip = useCallback(() => {
    if (pending.current) return;
    pending.current = true;
    window.setTimeout(onSkip, 80);
  }, [onSkip]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight" || e.key === "3") { e.preventDefault(); triggerRate(2); }
      if (e.key === "ArrowLeft"  || e.key === "1") { e.preventDefault(); triggerRate(0); }
      if (e.key === "ArrowUp"    || e.key === "2") { e.preventDefault(); triggerRate(1); }
      if (e.key === "ArrowDown"  || e.key === " ") { e.preventDefault(); triggerSkip(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [triggerRate, triggerSkip]);

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Progress + nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => triggerRate(0)}
          aria-label="Ne savais pas"
          className="flex h-8 w-8 items-center justify-center rounded-full text-(--color-muted) transition-colors duration-150 hover:text-(--color-ink)"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
            {index + 1} / {total}
          </p>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                aria-label="Aide — comment utiliser les gestes"
                className="flex h-6 w-6 items-center justify-center rounded-full text-(--color-muted) transition-colors duration-150 hover:text-(--color-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring) md:hidden"
              >
                <HelpCircle size={14} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side="bottom"
                align="start"
                sideOffset={8}
                className="z-50 w-56 rounded-(--radius-card) border border-(--color-ink)/10 bg-(--color-surface) p-3 shadow-lg"
              >
                <ul className="flex flex-col gap-2 text-xs">
                  <li className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 font-semibold text-red-600 dark:text-red-400">←</span>
                    <span className="font-medium text-red-600 dark:text-red-400">Ne savais pas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400">→</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Savais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/10 font-semibold text-yellow-600 dark:text-yellow-400">↑</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">Hésité</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--color-ink)/5 font-semibold text-(--color-muted)">↓</span>
                    <span className="font-medium text-(--color-muted)">Passer</span>
                  </li>
                </ul>
                <Popover.Arrow className="fill-(--color-surface)" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
        <button
          type="button"
          onClick={() => triggerRate(2)}
          aria-label="Savais"
          className="flex h-8 w-8 items-center justify-center rounded-full text-(--color-muted) transition-colors duration-150 hover:text-(--color-ink)"
        >
          →
        </button>
      </div>

      <SwipeCard
        className={`relative flex min-h-110 flex-col rounded-(--radius-card) bg-(--color-surface) p-4 shadow-sm sm:min-h-0 sm:p-8 transition-shadow duration-150 ease-out ${flash ? `ring-4 ${FLASH_RING[flash]} animate-flash-shake` : ""}`}
        resetKey={card.id}
        onSwipeRight={() => triggerRate(2)}
        onSwipeLeft={() => triggerRate(0)}
        onSwipeDown={triggerSkip}
        onSwipeUp={() => triggerRate(1)}
      >
        {onToggleFavorite !== undefined && (
          <div className="flex justify-end mb-3">
            <button
              type="button"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors duration-150 ${
                isFavorite
                  ? "text-(--color-ink) font-semibold"
                  : "text-(--color-muted) hover:text-(--color-ink)"
              }`}
              onClick={onToggleFavorite}
            >
              <Heart size={13} fill={isFavorite ? "currentColor" : "none"} />
              {isFavorite ? "Sauvegardé" : "Sauvegarder"}
            </button>
          </div>
        )}
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLOR[card.category]}`}>
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
              onClick={() => triggerRate(0)}
              className="flex flex-col items-center justify-center gap-1.5 rounded-(--radius-button) bg-red-500/10 px-2 py-3 text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60 dark:text-red-400"
            >
              <span className="inline-block h-3 w-3 rounded-full bg-red-500" aria-hidden="true" />
              <span className="leading-tight">Pas du tout</span>
            </button>
            <button
              type="button"
              onClick={() => triggerRate(1)}
              className="flex flex-col items-center justify-center gap-1.5 rounded-(--radius-button) bg-yellow-500/10 px-2 py-3 text-xs font-medium text-yellow-600 transition-colors duration-150 hover:bg-yellow-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500/60 dark:text-yellow-400"
            >
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-400" aria-hidden="true" />
              <span className="leading-tight">Hésité</span>
            </button>
            <button
              type="button"
              onClick={() => triggerRate(2)}
              className="flex flex-col items-center justify-center gap-1.5 rounded-(--radius-button) bg-emerald-500/10 px-2 py-3 text-xs font-medium text-emerald-600 transition-colors duration-150 hover:bg-emerald-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/60 dark:text-emerald-400"
            >
              <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="leading-tight">Savais</span>
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-1 border-t border-(--color-ink)/8 pt-3">
            <p className="text-xs text-(--color-muted)" lang="en">
              <span className="mr-1.5 inline-flex rounded bg-(--color-ink)/8 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-(--color-ink)">ENG</span>
              {card.translationEn}
            </p>
            <p className="text-xs text-(--color-muted)" lang="es">
              <span className="mr-1.5 inline-flex rounded bg-(--color-ink)/8 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-(--color-ink)">ESP</span>
              {card.translationEs}
            </p>
          </div>
        </div>
      </SwipeCard>
    </div>
  );
}
