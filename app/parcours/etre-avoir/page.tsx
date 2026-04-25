"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { useFlashcardSettings } from "@/src/hooks/useFlashcardSettings";
import { FlashcardView } from "@/src/components/flashcard/FlashcardView";
import { SessionDone } from "@/src/components/flashcard/SessionDone";
import { MarathonSettingsDrawer } from "@/src/components/navigation/MarathonSettingsDrawer";
import { useSetFlashcardHeader } from "@/src/lib/header-context";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { FLASHCARDS } from "@/src/data/flashcards";

const CARDS = FLASHCARDS.filter((c) => c.category === "être-avoir");
const STORAGE_KEY = "tef-p-etre-avoir";

export default function ParcoursEtreAvoirPage() {
  const router = useRouter();
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();
  const settings = useFlashcardSettings(STORAGE_KEY);
  const deck = useFlashcards(CARDS, STORAGE_KEY, settings.order);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useSetFlashcardHeader("Être / avoir", deck, { onSettings: () => setSettingsOpen(true) });

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
          autoAdvanceEnabled={settings.autoPlay}
          autoAdvanceMs={settings.autoSeconds * 1000}
          mode={settings.mode}
          repetitionStyle={settings.repetitionStyle}
        />
      )}
      {deck.state.phase === "complete" && (
        <SessionDone onRestart={deck.restart} onHome={() => router.push("/")} />
      )}

      <MarathonSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onRestart={() => {
          settings.persist();
          deck.startSession();
        }}
        autoPlay={settings.autoPlay}
        onAutoPlayChange={settings.setAutoPlay}
        autoSeconds={settings.autoSeconds}
        onAutoSecondsChange={settings.setAutoSeconds}
        order={settings.order}
        onOrderChange={settings.setOrder}
        mode={settings.mode}
        onModeChange={settings.setMode}
        repetitionStyle={settings.repetitionStyle}
        onRepetitionStyleChange={settings.setRepetitionStyle}
        hideRevisionMode
      />
    </AuthGate>
  );
}
