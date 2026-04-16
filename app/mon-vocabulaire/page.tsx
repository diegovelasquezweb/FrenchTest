"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { FlashcardView } from "@/src/components/FlashcardView";
import { FlashcardResults } from "@/src/components/FlashcardResults";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";

export default function MonVocabulairePage() {
  const router = useRouter();
  const { isFavoriteCard, toggleFavoriteCard, favoriteVocabList } =
    useFavoriteCards();
  const deck = useFlashcards(favoriteVocabList, "tef-mes-vocab-progress");

  useEffect(() => {
    if (favoriteVocabList.length > 0) {
      deck.startSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthGate>
      {favoriteVocabList.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <p className="text-base font-semibold text-(--color-ink)">
            Aucun mot sauvegardé
          </p>
          <p className="text-sm text-(--color-muted) max-w-xs">
            Marquez des mots comme favoris dans la liste de vocabulaire pour les
            retrouver ici.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-2 rounded-(--radius-button) bg-(--color-brand) px-4 py-2 text-sm font-semibold text-white"
          >
            Retour à l&apos;accueil
          </button>
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
          onHome={() => router.push("/")}
        />
      )}
    </AuthGate>
  );
}
