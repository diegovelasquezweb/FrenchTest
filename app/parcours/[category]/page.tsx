"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { FLASHCARDS } from "@/src/data/flashcards";
import { FlashcardCategoryTemplate } from "@/src/components/templates";
import type { Flashcard } from "@/src/types";

type ParcoursCategory =
  | "connecteurs"
  | "ecrit-connecteurs"
  | "oral-interaction"
  | "oral-monologue"
  | "ecrit-faits-divers"
  | "ecrit-argumentatif"
  | "ecrit-developper";

const VALID = new Set<string>([
  "connecteurs",
  "ecrit-connecteurs",
  "oral-interaction",
  "oral-monologue",
  "ecrit-faits-divers",
  "ecrit-argumentatif",
  "ecrit-developper",
]);

const connecteursCards = FLASHCARDS.filter((c) => c.category === "connecteurs");
const oralCards = FLASHCARDS.filter((c) => c.category === "oral");
const persuasionCards = FLASHCARDS.filter((c) => c.category === "oral-persuasion");
const faitsDiversCards = FLASHCARDS.filter((c) => c.category === "écrit-faits-divers");
const argumentatifCards = FLASHCARDS.filter(
  (c) => c.category === "argumentation" && !c.id.startsWith("dev-"),
);
const developperCards = FLASHCARDS.filter((c) => c.category === "argumentation" && c.id.startsWith("dev-"));

const SOURCES: Record<ParcoursCategory, { cards: Flashcard[]; storageKey: string; title: string }> = {
  connecteurs:          { cards: connecteursCards, storageKey: "tef-p-connecteurs",          title: "Connecteurs" },
  "ecrit-connecteurs":  { cards: connecteursCards, storageKey: "tef-p-ecrit-connecteurs",    title: "Connecteurs" },
  "oral-interaction":   { cards: oralCards,        storageKey: "tef-p-oral-interaction",     title: "Renseignements" },
  "oral-monologue":     { cards: persuasionCards,  storageKey: "tef-p-oral-monologue",       title: "Persuasion" },
  "ecrit-faits-divers": { cards: faitsDiversCards, storageKey: "tef-p-ecrit-faits-divers",   title: "Faits divers" },
  "ecrit-argumentatif": { cards: argumentatifCards, storageKey: "tef-p-ecrit-argumentatif",  title: "Argumentatif" },
  "ecrit-developper":   { cards: developperCards,  storageKey: "tef-p-ecrit-developper",     title: "Développer ses idées" },
};

export default function ParcoursCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();

  if (!VALID.has(category)) notFound();

  const source = SOURCES[category as ParcoursCategory];
  const enableTts = category === "oral-interaction" || category === "oral-monologue";

  return (
    <FlashcardCategoryTemplate
      title={source.title}
      cards={source.cards}
      storageKey={source.storageKey}
      isFavoriteCard={isFavoriteCard}
      toggleFavoriteCard={toggleFavoriteCard}
      enableTts={enableTts}
    />
  );
}
