"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { VOCABULAIRE_CARDS } from "@/src/data/vocabulaireCards";
import { VOCABULAIRE_EXTRA_CARDS } from "@/src/data/vocabulaireExtraCards";
import { GENRE_CARDS } from "@/src/data/genreCards";
import { PIEGES_CARDS } from "@/src/data/piegesCards";
import { ACCENTS_CARDS } from "@/src/data/accentsCards";
import { FlashcardCategoryTemplate } from "@/src/components/templates";
import type { Flashcard } from "@/src/types";

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

const verbesCards = VOCAB_CARDS.filter((c) => !c.subCategory || c.subCategory === "verbes");
const adjectifsCards = VOCAB_CARDS.filter((c) => c.subCategory === "adjectifs");
const nomsCards = VOCAB_CARDS.filter((c) => c.subCategory === "noms");
const expressionsCards = VOCAB_CARDS.filter((c) => c.subCategory === "expressions");

const SOURCES: Record<VocabCategory, { cards: Flashcard[]; storageKey: string; title: string }> = {
  verbes:      { cards: verbesCards,      storageKey: "tef-vocab-verbes",      title: "Verbes" },
  adjectifs:   { cards: adjectifsCards,   storageKey: "tef-vocab-adjectifs",   title: "Adjectifs" },
  noms:        { cards: nomsCards,        storageKey: "tef-vocab-noms",        title: "Noms" },
  expressions: { cards: expressionsCards, storageKey: "tef-vocab-expressions", title: "Expressions" },
  genre:       { cards: GENRE_CARDS,      storageKey: "tef-vocab-genre",       title: "Genre" },
  erreurs:     { cards: PIEGES_CARDS,     storageKey: "tef-vocab-erreurs",     title: "Erreurs" },
  accents:     { cards: ACCENTS_CARDS,    storageKey: "tef-vocab-accents",     title: "Accents" },
  mix:         { cards: VOCAB_CARDS,      storageKey: "tef-vocab-mix",         title: "Mix" },
};

export default function VocabulaireCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();

  if (!VALID.has(category)) notFound();

  const source = SOURCES[category as VocabCategory];

  return (
    <FlashcardCategoryTemplate
      title={source.title}
      cards={source.cards}
      storageKey={source.storageKey}
      isFavoriteCard={isFavoriteCard}
      toggleFavoriteCard={toggleFavoriteCard}
    />
  );
}
