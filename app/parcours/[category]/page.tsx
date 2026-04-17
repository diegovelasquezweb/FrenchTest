"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { FLASHCARDS } from "@/src/data/flashcards";
import { FlashcardCategoryTemplate } from "@/src/components/templates";

type ParcoursCategory =
  | "connecteurs"
  | "oral-interaction"
  | "oral-monologue"
  | "ecrit-faits-divers"
  | "ecrit-argumentatif";

const VALID = new Set<string>([
  "connecteurs",
  "oral-interaction",
  "oral-monologue",
  "ecrit-faits-divers",
  "ecrit-argumentatif",
]);

const connecteursCards = FLASHCARDS.filter((c) => c.category === "connecteurs");
const oralCards = FLASHCARDS.filter((c) => c.category === "oral");
const persuasionCards = FLASHCARDS.filter((c) => c.category === "oral-persuasion");
const faitsDiversCards = FLASHCARDS.filter((c) => c.category === "écrit-faits-divers");
const argumentatifCards = FLASHCARDS.filter((c) => c.category === "argumentation");

const PARCOURS_TITLES: Record<ParcoursCategory, string> = {
  connecteurs: "Connecteurs",
  "oral-interaction": "Renseignements",
  "oral-monologue": "Persuasion",
  "ecrit-faits-divers": "Faits divers",
  "ecrit-argumentatif": "Argumentatif",
};

export default function ParcoursCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();

  const connecteurs = useFlashcards(connecteursCards, "tef-p-connecteurs");
  const oral = useFlashcards(oralCards, "tef-p-oral-interaction");
  const monologue = useFlashcards(persuasionCards, "tef-p-oral-monologue");
  const faits = useFlashcards(faitsDiversCards, "tef-p-ecrit-faits-divers");
  const arg = useFlashcards(argumentatifCards, "tef-p-ecrit-argumentatif");

  const deckMap: Record<ParcoursCategory, typeof connecteurs> = {
    connecteurs,
    "oral-interaction": oral,
    "oral-monologue": monologue,
    "ecrit-faits-divers": faits,
    "ecrit-argumentatif": arg,
  };

  if (!VALID.has(category)) notFound();

  const deck = deckMap[category as ParcoursCategory];
  const title = PARCOURS_TITLES[category as ParcoursCategory] ?? category;

  return (
    <FlashcardCategoryTemplate
      title={title}
      deck={deck}
      isFavoriteCard={isFavoriteCard}
      toggleFavoriteCard={toggleFavoriteCard}
    />
  );
}
