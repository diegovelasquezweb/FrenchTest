"use client";

import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { AuthGate } from "@/src/layout/AuthGate";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { FlashcardView } from "@/src/components/FlashcardView";
import { FlashcardResults } from "@/src/components/FlashcardResults";
import { useSetFlashcardHeader } from "@/src/lib/header-context";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";

export default function MesPatternsPage() {
  const router = useRouter();
  const { isFavoriteCard, toggleFavoriteCard, favoriteCardList } =
    useFavoriteCards();
  const deck = useFlashcards(favoriteCardList, "tef-mes-patterns-progress");
  useSetFlashcardHeader("Mes patterns", deck);

  return (
    <AuthGate>
      {deck.state.phase === "idle" && (
        <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl rounded-(--radius-card) bg-(--color-surface) shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-ink)/8">
            <div className="flex items-center gap-2">
              <Bookmark size={16} className="text-(--color-ink)" />
              <span className="text-sm font-semibold text-(--color-ink)">Mes patterns</span>
            </div>
            {favoriteCardList.length > 0 && (
              <span className="text-xs font-bold text-(--color-muted)">{favoriteCardList.length}</span>
            )}
          </div>

          {favoriteCardList.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-sm font-medium text-(--color-ink)">Aucun pattern sauvegardé</p>
              <p className="text-xs text-(--color-muted) max-w-xs">
                Marque des patterns comme favoris pendant tes sessions pour les retrouver ici.
              </p>
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
                {favoriteCardList.map((card) => (
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
                      <Bookmark size={14} fill="currentColor" className="text-(--color-muted) hover:text-red-400 transition-colors duration-150" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-4 border-t border-(--color-ink)/8 flex items-center justify-between gap-3">
                <p className="text-xs text-(--color-muted)">
                  {favoriteCardList.length} pattern{favoriteCardList.length > 1 ? "s" : ""}
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
