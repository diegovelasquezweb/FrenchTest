"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { TOURISTE_CARDS } from "@/src/data/touristeCards";
import { FlashcardCategoryTemplate } from "@/src/components/templates";
import type { Flashcard } from "@/src/types";

type VoyageCategory =
  | "restaurant"
  | "transport"
  | "hebergement"
  | "shopping"
  | "orientation"
  | "urgences";

const VALID = new Set<string>([
  "restaurant",
  "transport",
  "hebergement",
  "shopping",
  "orientation",
  "urgences",
]);

const restaurantCards = TOURISTE_CARDS.filter((c) => c.subCategory === "restaurant");
const transportCards = TOURISTE_CARDS.filter((c) => c.subCategory === "transport");
const hebergementCards = TOURISTE_CARDS.filter((c) => c.subCategory === "hebergement");
const shoppingCards = TOURISTE_CARDS.filter((c) => c.subCategory === "shopping");
const orientationCards = TOURISTE_CARDS.filter((c) => c.subCategory === "orientation");
const urgencesCards = TOURISTE_CARDS.filter((c) => c.subCategory === "urgences");

const SOURCES: Record<VoyageCategory, { cards: Flashcard[]; storageKey: string; title: string }> = {
  restaurant:  { cards: restaurantCards,  storageKey: "tef-voyage-restaurant",  title: "Restaurant" },
  transport:   { cards: transportCards,   storageKey: "tef-voyage-transport",   title: "Transport" },
  hebergement: { cards: hebergementCards, storageKey: "tef-voyage-hebergement", title: "Hébergement" },
  shopping:    { cards: shoppingCards,    storageKey: "tef-voyage-shopping",    title: "Shopping" },
  orientation: { cards: orientationCards, storageKey: "tef-voyage-orientation", title: "Orientation" },
  urgences:    { cards: urgencesCards,    storageKey: "tef-voyage-urgences",    title: "Urgences" },
};

export default function VoyageCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();

  if (!VALID.has(category)) notFound();

  const source = SOURCES[category as VoyageCategory];

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
