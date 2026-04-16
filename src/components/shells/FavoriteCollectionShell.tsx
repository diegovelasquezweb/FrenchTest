"use client";

import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { AuthGate } from "@/src/layout/AuthGate";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { FlashcardView } from "@/src/components/FlashcardView";
import { FlashcardResults } from "@/src/components/FlashcardResults";
import { useSetFlashcardHeader } from "@/src/lib/header-context";
import type { Flashcard } from "@/src/types";
import type { FavoriteCollectionCopy } from "./types";

interface FavoriteCollectionShellProps {
  title: string;
  storageKey: string;
  favoriteList: Flashcard[];
  isFavoriteCard: (id: string) => boolean;
  toggleFavoriteCard: (id: string) => void;
  copy: FavoriteCollectionCopy;
}

export function FavoriteCollectionShell({
  title,
  storageKey,
  favoriteList,
  isFavoriteCard,
  toggleFavoriteCard,
  copy,
}: FavoriteCollectionShellProps) {
  const router = useRouter();
  const deck = useFlashcards(favoriteList, storageKey);
  useSetFlashcardHeader(title, deck);

  return (
    <AuthGate>
      {deck.state.phase === "idle" && (
        <div className="flex flex-1 items-center justify-center px-4 py-6">
          <div className="w-full max-w-xl rounded-(--radius-card) bg-(--color-surface) shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-ink)/8">
              <div className="flex items-center gap-2">
                <Bookmark size={16} className="text-(--color-ink)" />
                <span className="text-sm font-semibold text-(--color-ink)">{title}</span>
              </div>
              {favoriteList.length > 0 && (
                <span className="text-xs font-bold text-(--color-muted)">{favoriteList.length}</span>
              )}
            </div>

            {favoriteList.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                <p className="text-sm font-medium text-(--color-ink)">{copy.emptyHeading}</p>
                <p className="text-xs text-(--color-muted) max-w-xs">{copy.emptyDescription}</p>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="mt-2 rounded-(--radius-button) bg-(--color-brand) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150"
                >
                  Commencer un exercice
                </button>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-(--color-ink)/6 max-h-[60vh] overflow-y-auto">
                  {favoriteList.map((card) => (
                    <li key={card.id} className="flex items-center justify-between px-6 py-3 gap-3">
                      <span className="flex-1 min-w-0 text-sm text-(--color-ink)" lang="fr">
                        {card.front}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavoriteCard(card.id)}
                        aria-label={`Retirer ${card.front}`}
                        className="shrink-0 text-(--color-muted) hover:text-red-400 transition-colors duration-150"
                      >
                        <Bookmark
                          size={14}
                          fill="currentColor"
                          className="text-(--color-muted) hover:text-red-400 transition-colors duration-150"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-6 py-4 border-t border-(--color-ink)/8 flex items-center justify-between gap-3">
                  <p className="text-xs text-(--color-muted)">
                    {copy.countLabel(favoriteList.length)}
                  </p>
                  <button
                    type="button"
                    onClick={deck.startSession}
                    className="rounded-(--radius-button) bg-(--color-brand) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150"
                  >
                    Commencer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {deck.state.phase === "session" && deck.currentCard && (
        <FlashcardView
          card={deck.currentCard}
          index={deck.progress.index}
          total={deck.progress.total}
          onRate={deck.rate}
          onSkip={deck.skip}
          onBack={deck.back}
          isFavorite={isFavoriteCard(deck.currentCard.id)}
          onToggleFavorite={() => toggleFavoriteCard(deck.currentCard!.id)}
        />
      )}
      {deck.state.phase === "complete" && (
        <FlashcardResults
          sessionResults={deck.state.sessionResults}
          masteredCount={deck.masteredCount}
          totalCards={deck.totalCards}
          cards={deck.state.deck}
          onRestart={deck.restart}
          onHome={deck.goHome}
        />
      )}
    </AuthGate>
  );
}
