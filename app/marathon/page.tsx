"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import type { CardOrder } from "@/src/hooks/useFlashcards";
import { useTts } from "@/src/hooks/useTts";
import { FlashcardView } from "@/src/components/flashcard/FlashcardView";
import { FlashcardResults } from "@/src/components/flashcard/FlashcardResults";
import { useSetMarathonHeader } from "@/src/lib/header-context";
import { MarathonFilterDrawer } from "@/src/components/navigation/MarathonFilterDrawer";
import { MarathonSettingsDrawer } from "@/src/components/navigation/MarathonSettingsDrawer";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import type { MarathonCategoryId, MarathonGroupId } from "@/src/components/navigation/MarathonCategoryPicker";
import { ALL_MARATHON_CATEGORY_IDS } from "@/src/components/navigation/MarathonCategoryPicker";
import { FLASHCARDS } from "@/src/data/flashcards";
import { VOCABULAIRE_CARDS } from "@/src/data/vocabulaireCards";
import { VOCABULAIRE_EXTRA_CARDS } from "@/src/data/vocabulaireExtraCards";
import { GENRE_CARDS } from "@/src/data/genreCards";
import { PIEGES_CARDS } from "@/src/data/piegesCards";
import { ACCENTS_CARDS } from "@/src/data/accentsCards";
import { TOURISTE_CARDS } from "@/src/data/touristeCards";
import type { Flashcard } from "@/src/types";
import type { MarathonMode, RepetitionStyle } from "@/src/components/flashcard/FlashcardView";

const ALL_VOCAB = [...VOCABULAIRE_CARDS, ...VOCABULAIRE_EXTRA_CARDS];

const MARATHON_SOURCES: Record<MarathonCategoryId, Flashcard[]> = {
  "oral-interaction":   FLASHCARDS.filter((c) => c.category === "oral"),
  "oral-monologue":     FLASHCARDS.filter((c) => c.category === "oral-persuasion"),
  "ecrit-faits-divers": FLASHCARDS.filter((c) => c.category === "écrit-faits-divers"),
  connecteurs:          FLASHCARDS.filter((c) => c.category === "connecteurs"),
  argumentation:        FLASHCARDS.filter((c) => c.category === "argumentation"),
  "mrs-vandertramp":    FLASHCARDS.filter((c) => c.category === "être-avoir"),
  "vocab-verbes":       ALL_VOCAB.filter((c) => !c.subCategory || c.subCategory === "verbes"),
  "vocab-adjectifs":    ALL_VOCAB.filter((c) => c.subCategory === "adjectifs"),
  "vocab-noms":         ALL_VOCAB.filter((c) => c.subCategory === "noms"),
  "vocab-expressions":  ALL_VOCAB.filter((c) => c.subCategory === "expressions"),
  "vocab-genre":        GENRE_CARDS,
  "vocab-erreurs":      PIEGES_CARDS,
  "vocab-accents":      ACCENTS_CARDS,
  "voyage-restaurant":  TOURISTE_CARDS.filter((c) => c.subCategory === "restaurant"),
  "voyage-transport":   TOURISTE_CARDS.filter((c) => c.subCategory === "transport"),
  "voyage-hebergement": TOURISTE_CARDS.filter((c) => c.subCategory === "hebergement"),
  "voyage-shopping":    TOURISTE_CARDS.filter((c) => c.subCategory === "shopping"),
  "voyage-orientation": TOURISTE_CARDS.filter((c) => c.subCategory === "orientation"),
  "voyage-urgences":    TOURISTE_CARDS.filter((c) => c.subCategory === "urgences"),
};

export default function MarathonPage() {
  const router = useRouter();
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();

  const [marathonAutoPlay, setMarathonAutoPlay] = useState(() => localStorage.getItem("tef-marathon-autoplay") === "1");
  const [marathonAutoSeconds, setMarathonAutoSeconds] = useState(() => {
    const v = Number(localStorage.getItem("tef-marathon-autoseconds") ?? "5");
    return Number.isFinite(v) ? Math.min(30, Math.max(1, v)) : 5;
  });
  const [marathonOrder, setMarathonOrder] = useState<CardOrder>(() => {
    const v = localStorage.getItem("tef-marathon-order");
    return v === "alpha" ? "alpha" : v === "fixed" ? "fixed" : "random";
  });
  const [marathonCategories, setMarathonCategories] = useState<Set<MarathonCategoryId>>(() => {
    const v = localStorage.getItem("tef-marathon-categories");
    if (v) {
      const parsed = JSON.parse(v) as MarathonCategoryId[];
      if (parsed.length > 0) return new Set(parsed);
    }
    return new Set<MarathonCategoryId>([
      "oral-interaction", "oral-monologue", "ecrit-faits-divers", "connecteurs", "argumentation",
    ]);
  });
  const [marathonMode, setMarathonMode] = useState<MarathonMode>(() => {
    const v = localStorage.getItem("tef-marathon-mode");
    return v === "révision" || v === "répétition" ? v : "lecture";
  });
  const [repetitionStyle, setRepetitionStyle] = useState<RepetitionStyle>(() => {
    return localStorage.getItem("tef-marathon-repstyle") === "masking" ? "masking" : "intensity";
  });
  const [marathonTtsAutoplay, setMarathonTtsAutoplay] = useState(
    () => localStorage.getItem("tef-marathon-ttsautoplay") === "1",
  );
  const [marathonTtsRate, setMarathonTtsRate] = useState(() => {
    const v = Number(localStorage.getItem("tef-marathon-ttsrate") ?? "0.95");
    return Number.isFinite(v) ? Math.min(1.5, Math.max(0.5, v)) : 0.95;
  });
  const [marathonTtsPitch, setMarathonTtsPitch] = useState(() => {
    const v = Number(localStorage.getItem("tef-marathon-ttspitch") ?? "1");
    return Number.isFinite(v) ? Math.min(1.5, Math.max(0.5, v)) : 1;
  });
  const [marathonTtsVolume, setMarathonTtsVolume] = useState(() => {
    const v = Number(localStorage.getItem("tef-marathon-ttsvolume") ?? "1");
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 1;
  });
  const [marathonTtsVoiceURI, setMarathonTtsVoiceURI] = useState<string | null>(
    () => localStorage.getItem("tef-marathon-ttsvoiceuri"),
  );
  const [marathonTtsAdvanceOnEnd, setMarathonTtsAdvanceOnEnd] = useState(
    () => localStorage.getItem("tef-marathon-ttsadvanceonend") === "1",
  );
  const [marathonTtsAdvanceDelayMs, setMarathonTtsAdvanceDelayMs] = useState(() => {
    const v = Number(localStorage.getItem("tef-marathon-ttsadvancedelay") ?? "1500");
    return Number.isFinite(v) ? Math.min(4000, Math.max(0, v)) : 1500;
  });
  const tts = useTts({
    rate: marathonTtsRate,
    pitch: marathonTtsPitch,
    volume: marathonTtsVolume,
    voiceURI: marathonTtsVoiceURI,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const categoriesSnapshotRef = useRef<Set<MarathonCategoryId>>(new Set());

  const marathonCards = useMemo(
    () => Array.from(marathonCategories).flatMap((id) => MARATHON_SOURCES[id] ?? []),
    [marathonCategories],
  );
  const deck = useFlashcards(marathonCards, "tef-marathon", marathonOrder);

  useEffect(() => {
    deck.startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleToggleCategory(id: MarathonCategoryId) {
    setMarathonCategories((prev) => {
      if (prev.has(id) && prev.size === 1) return prev;
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function handleToggleGroup(_groupId: MarathonGroupId, ids: MarathonCategoryId[]) {
    setMarathonCategories((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      if (next.size === 0) return prev;
      return next;
    });
  }

  function handleDefault() {
    setMarathonCategories(new Set<MarathonCategoryId>([
      "oral-interaction", "oral-monologue", "ecrit-faits-divers", "connecteurs", "argumentation",
    ]));
  }

  function handleSelectAll() {
    setMarathonCategories(new Set(ALL_MARATHON_CATEGORY_IDS));
  }

  function handleUnselectAll() {
    setMarathonCategories((prev) => {
      if (prev.size <= 1) return prev;
      const [first] = Array.from(prev);
      return new Set([first!]);
    });
  }

  useSetMarathonHeader(deck, {
    onFilter: () => { categoriesSnapshotRef.current = new Set(marathonCategories); setDrawerOpen(true); },
    onSettings: () => setSettingsOpen(true),
    showReset: marathonMode === "révision",
  });

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
          autoAdvanceEnabled={marathonAutoPlay}
          autoAdvanceMs={marathonAutoSeconds * 1000}
          mode={marathonMode}
          repetitionStyle={repetitionStyle}
          ttsAutoplay={marathonTtsAutoplay}
          ttsRate={marathonTtsRate}
          ttsPitch={marathonTtsPitch}
          ttsVolume={marathonTtsVolume}
          ttsVoiceURI={marathonTtsVoiceURI}
          ttsAdvanceOnEnd={marathonTtsAdvanceOnEnd}
          ttsAdvanceDelayMs={marathonTtsAdvanceDelayMs}
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

      <MarathonFilterDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          const prev = categoriesSnapshotRef.current;
          const changed = prev.size !== marathonCategories.size || Array.from(marathonCategories).some((id) => !prev.has(id));
          if (changed) {
            localStorage.setItem("tef-marathon-categories", JSON.stringify(Array.from(marathonCategories)));
            deck.startSession();
          }
        }}
        groups={[
          {
            id: "patterns",
            label: "Modèles",
            options: [
              { id: "oral-interaction",   label: "Renseignements",  count: MARATHON_SOURCES["oral-interaction"].length },
              { id: "oral-monologue",     label: "Persuasion",      count: MARATHON_SOURCES["oral-monologue"].length },
              { id: "ecrit-faits-divers", label: "Faits divers",    count: MARATHON_SOURCES["ecrit-faits-divers"].length },
              { id: "connecteurs",        label: "Connecteurs",     count: MARATHON_SOURCES["connecteurs"].length },
              { id: "argumentation",      label: "Argumentatif",    count: MARATHON_SOURCES["argumentation"].length },
              { id: "mrs-vandertramp",    label: "Mrs Vandertramp", count: MARATHON_SOURCES["mrs-vandertramp"].length },
            ],
          },
          {
            id: "vocabulaire",
            label: "Vocabulaire",
            options: [
              { id: "vocab-verbes",      label: "Verbes",      count: MARATHON_SOURCES["vocab-verbes"].length },
              { id: "vocab-adjectifs",   label: "Adjectifs",   count: MARATHON_SOURCES["vocab-adjectifs"].length },
              { id: "vocab-noms",        label: "Noms",        count: MARATHON_SOURCES["vocab-noms"].length },
              { id: "vocab-expressions", label: "Expressions", count: MARATHON_SOURCES["vocab-expressions"].length },
              { id: "vocab-genre",       label: "Genre",       count: MARATHON_SOURCES["vocab-genre"].length },
              { id: "vocab-erreurs",     label: "Erreurs",     count: MARATHON_SOURCES["vocab-erreurs"].length },
              { id: "vocab-accents",     label: "Accents",     count: MARATHON_SOURCES["vocab-accents"].length },
            ],
          },
          {
            id: "voyage",
            label: "Voyage",
            options: [
              { id: "voyage-restaurant",  label: "Restaurant",  count: MARATHON_SOURCES["voyage-restaurant"].length },
              { id: "voyage-transport",   label: "Transport",   count: MARATHON_SOURCES["voyage-transport"].length },
              { id: "voyage-hebergement", label: "Hébergement", count: MARATHON_SOURCES["voyage-hebergement"].length },
              { id: "voyage-shopping",    label: "Shopping",    count: MARATHON_SOURCES["voyage-shopping"].length },
              { id: "voyage-orientation", label: "Orientation", count: MARATHON_SOURCES["voyage-orientation"].length },
              { id: "voyage-urgences",    label: "Urgences",    count: MARATHON_SOURCES["voyage-urgences"].length },
            ],
          },
        ]}
        selectedCategories={marathonCategories}
        onToggle={handleToggleCategory}
        onToggleGroup={handleToggleGroup}
        onDefault={handleDefault}
        onSelectAll={handleSelectAll}
        onUnselectAll={handleUnselectAll}
        totalSelectedCards={marathonCards.length}
      />
      <MarathonSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onRestart={() => {
          localStorage.setItem("tef-marathon-autoplay", marathonAutoPlay ? "1" : "0");
          localStorage.setItem("tef-marathon-autoseconds", String(marathonAutoSeconds));
          localStorage.setItem("tef-marathon-order", marathonOrder);
          localStorage.setItem("tef-marathon-mode", marathonMode);
          localStorage.setItem("tef-marathon-repstyle", repetitionStyle);
          localStorage.setItem("tef-marathon-ttsautoplay", marathonTtsAutoplay ? "1" : "0");
          localStorage.setItem("tef-marathon-ttsrate", String(marathonTtsRate));
          localStorage.setItem("tef-marathon-ttspitch", String(marathonTtsPitch));
          localStorage.setItem("tef-marathon-ttsvolume", String(marathonTtsVolume));
          if (marathonTtsVoiceURI) {
            localStorage.setItem("tef-marathon-ttsvoiceuri", marathonTtsVoiceURI);
          } else {
            localStorage.removeItem("tef-marathon-ttsvoiceuri");
          }
          localStorage.setItem("tef-marathon-ttsadvanceonend", marathonTtsAdvanceOnEnd ? "1" : "0");
          localStorage.setItem("tef-marathon-ttsadvancedelay", String(marathonTtsAdvanceDelayMs));
          deck.startSession();
        }}
        autoPlay={marathonAutoPlay}
        onAutoPlayChange={setMarathonAutoPlay}
        autoSeconds={marathonAutoSeconds}
        onAutoSecondsChange={setMarathonAutoSeconds}
        order={marathonOrder}
        onOrderChange={setMarathonOrder}
        mode={marathonMode}
        onModeChange={setMarathonMode}
        repetitionStyle={repetitionStyle}
        onRepetitionStyleChange={setRepetitionStyle}
        ttsAutoplay={marathonTtsAutoplay}
        onTtsAutoplayChange={setMarathonTtsAutoplay}
        ttsRate={marathonTtsRate}
        onTtsRateChange={setMarathonTtsRate}
        ttsPitch={marathonTtsPitch}
        onTtsPitchChange={setMarathonTtsPitch}
        ttsVolume={marathonTtsVolume}
        onTtsVolumeChange={setMarathonTtsVolume}
        ttsVoiceURI={marathonTtsVoiceURI}
        onTtsVoiceURIChange={setMarathonTtsVoiceURI}
        ttsVoices={tts.voices}
        onTtsTest={() => tts.speak("Bonjour, voici un exemple de phrase en français.")}
        ttsAdvanceOnEnd={marathonTtsAdvanceOnEnd}
        onTtsAdvanceOnEndChange={setMarathonTtsAdvanceOnEnd}
        ttsAdvanceDelayMs={marathonTtsAdvanceDelayMs}
        onTtsAdvanceDelayMsChange={setMarathonTtsAdvanceDelayMs}
      />
    </AuthGate>
  );
}
