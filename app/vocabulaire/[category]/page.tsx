"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { FlashcardView } from "@/src/components/FlashcardView";
import { FlashcardResults } from "@/src/components/FlashcardResults";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { VOCABULAIRE_CARDS } from "@/src/data/vocabulaireCards";
import { VOCABULAIRE_EXTRA_CARDS } from "@/src/data/vocabulaireExtraCards";
import { GENRE_CARDS } from "@/src/data/genreCards";
import { PIEGES_CARDS } from "@/src/data/piegesCards";
import { ACCENTS_CARDS } from "@/src/data/accentsCards";

type VocabCategory =
  | "verbes"
  | "adjectifs"
  | "noms"
  | "expressions"
  | "genre"
  | "erreurs"
  | "accents"
  | "mix";

const VALID = new Set<string>([
  "verbes",
  "adjectifs",
  "noms",
  "expressions",
  "genre",
  "erreurs",
  "accents",
  "mix",
]);

const VOCAB_CARDS = [...VOCABULAIRE_CARDS, ...VOCABULAIRE_EXTRA_CARDS];

const verbesCards = VOCAB_CARDS.filter(
  (c) => !c.subCategory || c.subCategory === "verbes",
);
const adjectifsCards = VOCAB_CARDS.filter((c) => c.subCategory === "adjectifs");
const nomsCards = VOCAB_CARDS.filter((c) => c.subCategory === "noms");
const expressionsCards = VOCAB_CARDS.filter(
  (c) => c.subCategory === "expressions",
);

export default function VocabulaireCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const router = useRouter();
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();

  const verbes = useFlashcards(verbesCards, "tef-vocab-verbes");
  const adjectifs = useFlashcards(adjectifsCards, "tef-vocab-adjectifs");
  const noms = useFlashcards(nomsCards, "tef-vocab-noms");
  const expressions = useFlashcards(expressionsCards, "tef-vocab-expressions");
  const genre = useFlashcards(GENRE_CARDS, "tef-vocab-genre");
  const erreurs = useFlashcards(PIEGES_CARDS, "tef-vocab-erreurs");
  const accents = useFlashcards(ACCENTS_CARDS, "tef-vocab-accents");
  const mix = useFlashcards(VOCAB_CARDS, "tef-vocab-mix");

  const deckMap: Record<VocabCategory, typeof verbes> = {
    verbes,
    adjectifs,
    noms,
    expressions,
    genre,
    erreurs,
    accents,
    mix,
  };

  const deck = VALID.has(category)
    ? deckMap[category as VocabCategory]
    : null;

  useEffect(() => {
    deck?.startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!VALID.has(category)) notFound();

  return (
    <AuthGate>
      {deck!.state.phase === "session" && deck!.currentCard && (
        <FlashcardView
          card={deck!.currentCard}
          index={deck!.progress.index}
          total={deck!.progress.total}
          onRate={deck!.rate}
          onSkip={deck!.skip}
          onBack={deck!.back}
          isFavorite={isFavoriteCard(deck!.currentCard.id)}
          onToggleFavorite={() => toggleFavoriteCard(deck!.currentCard!.id)}
        />
      )}
      {deck!.state.phase === "complete" && (
        <FlashcardResults
          sessionResults={deck!.state.sessionResults}
          masteredCount={deck!.masteredCount}
          totalCards={deck!.totalCards}
          cards={deck!.state.deck}
          onRestart={deck!.restart}
          onHome={() => router.push("/")}
        />
      )}
    </AuthGate>
  );
}
