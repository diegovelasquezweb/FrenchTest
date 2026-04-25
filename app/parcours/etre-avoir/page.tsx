"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { useFlashcardSettings } from "@/src/hooks/useFlashcardSettings";
import { useTts } from "@/src/hooks/useTts";
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
  const tts = useTts({
    rate: settings.ttsRate,
    pitch: settings.ttsPitch,
    volume: settings.ttsVolume,
    voiceURI: settings.ttsVoiceURI,
  });

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
          ttsAutoplay={settings.ttsAutoplay}
          ttsRate={settings.ttsRate}
          ttsPitch={settings.ttsPitch}
          ttsVolume={settings.ttsVolume}
          ttsVoiceURI={settings.ttsVoiceURI}
          ttsAdvanceOnEnd={settings.ttsAdvanceOnEnd}
          ttsAdvanceDelayMs={settings.ttsAdvanceDelayMs}
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
        ttsAutoplay={settings.ttsAutoplay}
        onTtsAutoplayChange={settings.setTtsAutoplay}
        ttsRate={settings.ttsRate}
        onTtsRateChange={settings.setTtsRate}
        ttsPitch={settings.ttsPitch}
        onTtsPitchChange={settings.setTtsPitch}
        ttsVolume={settings.ttsVolume}
        onTtsVolumeChange={settings.setTtsVolume}
        ttsVoiceURI={settings.ttsVoiceURI}
        onTtsVoiceURIChange={settings.setTtsVoiceURI}
        ttsVoices={tts.voices}
        onTtsTest={() => tts.speak("Bonjour, voici un exemple de phrase en français.")}
        ttsAdvanceOnEnd={settings.ttsAdvanceOnEnd}
        onTtsAdvanceOnEndChange={settings.setTtsAdvanceOnEnd}
        ttsAdvanceDelayMs={settings.ttsAdvanceDelayMs}
        onTtsAdvanceDelayMsChange={settings.setTtsAdvanceDelayMs}
        hideRevisionMode
      />
    </AuthGate>
  );
}
