import { useCallback, useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Bookmark, HelpCircle } from "lucide-react";
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
  oral: "Renseignements",
  "oral-persuasion": "Persuasion",
  "écrit-faits-divers": "Faits divers",
  connecteurs: "Connecteurs",
  argumentation: "Argumentatif",
  vocabulaire: "Vocabulaire",
  touriste: "Voyage",
  "être-avoir": "Mrs Vandertramp",
};

const CATEGORY_COLOR: Record<Flashcard["category"], string> = {
  oral: "bg-(--color-brand)/10 text-(--color-brand)",
  "oral-persuasion": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "écrit-faits-divers": "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  connecteurs: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  argumentation: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  vocabulaire: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  touriste: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "être-avoir": "bg-teal-500/10 text-teal-600 dark:text-teal-400",
};

interface FlashcardViewProps {
  card: Flashcard;
  index: number;
  total: number;
  onRate(r: FlashcardRating): void;
  onSkip(): void;
  onBack?(): void;
  isFavorite?: boolean;
  onToggleFavorite?(): void;
  autoAdvanceEnabled?: boolean;
  autoAdvanceMs?: number;
}

export function FlashcardView({
  card,
  index,
  total,
  onRate,
  onSkip,
  onBack,
  isFavorite,
  onToggleFavorite,
  autoAdvanceEnabled = false,
  autoAdvanceMs = 20000,
}: FlashcardViewProps) {
  const focusTrapRef = useRef<HTMLInputElement>(null);
  const [flash, setFlash] = useState<FlashColor>(null);
  const pending = useRef(false);

  useEffect(() => {
    focusTrapRef.current?.focus({ preventScroll: true });
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
      if (e.key === "ArrowDown"  || e.key === " " || e.key === "4") { e.preventDefault(); triggerSkip(); }
      if (e.key === "Backspace" || e.key === "Escape") { e.preventDefault(); onBack?.(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [triggerRate, triggerSkip]);

  useEffect(() => {
    if (!autoAdvanceEnabled || autoAdvanceMs <= 0) return;
    const id = window.setTimeout(() => {
      triggerSkip();
    }, autoAdvanceMs);
    return () => window.clearTimeout(id);
  }, [card.id, autoAdvanceEnabled, autoAdvanceMs, triggerSkip]);

  const normalizedFront = card.front.trim().toLowerCase();
  const normalizedEn = card.translationEn.trim().toLowerCase();
  const normalizedEs = card.translationEs.trim().toLowerCase();
  const isPlaceholderPair = normalizedEn === normalizedFront && normalizedEs === normalizedFront;
  const hasEnTranslation = card.translationEn.trim().length > 0 && !isPlaceholderPair;
  const hasEsTranslation = card.translationEs.trim().length > 0 && !isPlaceholderPair;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-6">
    <div className="w-full max-w-xl">
      {/* Progress + nav */}
      <div className="mb-4 flex items-center justify-center gap-3">
        {onBack && index > 0 ? (
          <button
            type="button"
            aria-label="Carte précédente"
            onClick={onBack}
            className="flex h-6 w-6 items-center justify-center rounded-full text-(--color-muted)/60 transition-colors duration-150 hover:text-(--color-muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
          >
            ←
          </button>
        ) : <span className="h-6 w-6" />}
        <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
          {index + 1} / {total}
        </p>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-label="Aide"
              className="flex h-6 w-6 items-center justify-center rounded-full text-(--color-muted)/60 transition-colors duration-150 hover:text-(--color-muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
            >
              <HelpCircle size={13} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="center"
              sideOffset={10}
              className="z-50 w-64 rounded-(--radius-card) border border-(--color-ink)/8 bg-(--color-surface) px-3 py-3 shadow-xl shadow-(--color-ink)/8"
            >
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-(--color-muted)/60">Raccourcis</p>
              <ul className="flex flex-col gap-1.5">
                {([
                  { gesture: "←", keys: ["←", "1"], label: "Ne savais pas", color: "text-red-500 dark:text-red-400",          bg: "bg-red-500/8"     },
                  { gesture: "→", keys: ["→", "3"], label: "Savais",         color: "text-emerald-600 dark:text-emerald-400",  bg: "bg-emerald-500/8" },
                  { gesture: "↑", keys: ["↑", "2"], label: "Hésité",         color: "text-yellow-600 dark:text-yellow-400",    bg: "bg-yellow-500/8"  },
                  { gesture: "↓", keys: ["↓", "␣"], label: "Passer",         color: "text-(--color-muted)",                   bg: "bg-(--color-ink)/5" },
                ] as const).map(({ gesture, keys, label, color, bg }) => (
                  <li key={label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ${bg} ${color}`}>{gesture}</span>
                      <span className={`text-xs font-medium ${color}`}>{label}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-1">
                      {keys.map(k => (
                        <kbd key={k} className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-(--color-ink)/12 bg-(--color-ink)/5 px-1 text-[10px] font-medium text-(--color-muted)">{k}</kbd>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              <Popover.Arrow className="fill-(--color-surface)" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Hidden focus trap — receives focus on card change without scrolling or activating a button */}
      <input ref={focusTrapRef} type="text" readOnly tabIndex={-1} className="sr-only" aria-hidden="true" />

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
              aria-label={isFavorite ? "Retirer des favoris" : "Sauvegarder"}
              className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors duration-150 ${
                isFavorite
                  ? "text-(--color-ink) font-semibold"
                  : "text-(--color-muted) hover:text-(--color-ink)"
              }`}
              onClick={onToggleFavorite}
            >
              <Bookmark size={13} fill={isFavorite ? "currentColor" : "none"} />
              Sauvegarder
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
              type="button"
              onClick={() => triggerRate(0)}
              className="flex flex-col items-center justify-center gap-1.5 rounded-(--radius-button) bg-red-500/10 px-2 py-3 text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60 dark:text-red-400"
            >
              <span className="inline-block h-3 w-3 rounded-full bg-red-500" aria-hidden="true" />
              <span className="leading-tight">Pas du tout</span>
              <span className="hidden md:inline tabular-nums text-(--color-muted) opacity-50" aria-hidden="true">1</span>
            </button>
            <button
              type="button"
              onClick={() => triggerRate(1)}
              className="flex flex-col items-center justify-center gap-1.5 rounded-(--radius-button) bg-yellow-500/10 px-2 py-3 text-xs font-medium text-yellow-600 transition-colors duration-150 hover:bg-yellow-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500/60 dark:text-yellow-400"
            >
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-400" aria-hidden="true" />
              <span className="leading-tight">Hésité</span>
              <span className="hidden md:inline tabular-nums text-(--color-muted) opacity-50" aria-hidden="true">2</span>
            </button>
            <button
              type="button"
              onClick={() => triggerRate(2)}
              className="flex flex-col items-center justify-center gap-1.5 rounded-(--radius-button) bg-emerald-500/10 px-2 py-3 text-xs font-medium text-emerald-600 transition-colors duration-150 hover:bg-emerald-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/60 dark:text-emerald-400"
            >
              <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="leading-tight">Savais</span>
              <span className="hidden md:inline tabular-nums text-(--color-muted) opacity-50" aria-hidden="true">3</span>
            </button>
          </div>

          {(hasEnTranslation || hasEsTranslation) && (
            <div className="mt-4 flex flex-col gap-1 border-t border-(--color-ink)/8 pt-3">
              {hasEnTranslation && (
                <p className="text-xs text-(--color-muted)" lang="en">
                  <span className="mr-1.5 inline-flex rounded bg-(--color-ink)/8 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-(--color-ink)">ENG</span>
                  {card.translationEn}
                </p>
              )}
              {hasEsTranslation && (
                <p className="text-xs text-(--color-muted)" lang="es">
                  <span className="mr-1.5 inline-flex rounded bg-(--color-ink)/8 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-(--color-ink)">ESP</span>
                  {card.translationEs}
                </p>
              )}
            </div>
          )}
        </div>
      </SwipeCard>
    </div>
    </div>
  );
}
