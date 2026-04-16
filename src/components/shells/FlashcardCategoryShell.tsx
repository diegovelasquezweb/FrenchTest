"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { FlashcardView } from "@/src/components/FlashcardView";
import { FlashcardResults } from "@/src/components/FlashcardResults";
import { useSetFlashcardHeader } from "@/src/lib/header-context";
import type { FlashcardDeckLike } from "./types";

interface FlashcardCategoryShellProps {
  title: string;
  deck: FlashcardDeckLike;
  isFavoriteCard: (id: string) => boolean;
  toggleFavoriteCard: (id: string) => void;
}

export function FlashcardCategoryShell({
  title,
  deck,
  isFavoriteCard,
  toggleFavoriteCard,
}: FlashcardCategoryShellProps) {
  const router = useRouter();

  useSetFlashcardHeader(title, deck);

  useEffect(() => {
    deck.startSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
