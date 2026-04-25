"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { FlashcardView } from "@/src/components/flashcard/FlashcardView";
import { SessionDone } from "@/src/components/flashcard/SessionDone";
import { useSetFlashcardHeader } from "@/src/lib/header-context";
import type { FlashcardDeckLike } from "./types";

interface FlashcardCategoryTemplateProps {
  title: string;
  deck: FlashcardDeckLike;
  isFavoriteCard: (id: string) => boolean;
  toggleFavoriteCard: (id: string) => void;
}

export function FlashcardCategoryTemplate({
  title,
  deck,
  isFavoriteCard,
  toggleFavoriteCard,
}: FlashcardCategoryTemplateProps) {
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
        <SessionDone onRestart={deck.restart} onHome={() => router.push("/")} />
      )}
    </AuthGate>
  );
}
