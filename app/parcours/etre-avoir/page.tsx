"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { FlashcardView } from "@/src/components/FlashcardView";
import { FlashcardResults } from "@/src/components/FlashcardResults";
import { useSetFlashcardHeader } from "@/src/lib/header-context";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { FLASHCARDS } from "@/src/data/flashcards";

const CARDS = FLASHCARDS.filter((c) => c.category === "être-avoir");

export default function ParcoursEtreAvoirPage() {
  const router = useRouter();
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();
  const deck = useFlashcards(CARDS, "tef-p-etre-avoir");
  useSetFlashcardHeader("Être / avoir", deck);

  useEffect(() => {
    deck.startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthGate>
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
