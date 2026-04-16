"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { VOCABULAIRE_CARDS } from "@/src/data/vocabulaireCards";
import { VOCABULAIRE_EXTRA_CARDS } from "@/src/data/vocabulaireExtraCards";
import { GENRE_CARDS } from "@/src/data/genreCards";
import { PIEGES_CARDS } from "@/src/data/piegesCards";
import { ACCENTS_CARDS } from "@/src/data/accentsCards";
import { FlashcardCategoryShell } from "@/src/components/templates";

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

const VOCAB_TITLES: Record<VocabCategory, string> = {
  verbes: "Verbes",
  adjectifs: "Adjectifs",
  noms: "Noms",
  expressions: "Expressions",
  genre: "Genre",
  erreurs: "Erreurs",
  accents: "Accents",
  mix: "Mix",
};

export default function VocabulaireCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
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

  if (!VALID.has(category)) notFound();

  const deck = deckMap[category as VocabCategory];
  const title = VOCAB_TITLES[category as VocabCategory] ?? category;

  return (
    <FlashcardCategoryShell
      title={title}
      deck={deck}
      isFavoriteCard={isFavoriteCard}
      toggleFavoriteCard={toggleFavoriteCard}
    />
  );
}
