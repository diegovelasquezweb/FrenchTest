"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { TOURISTE_CARDS } from "@/src/data/touristeCards";
import { FlashcardCategoryShell } from "@/src/components/shells";

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

const VOYAGE_TITLES: Record<VoyageCategory, string> = {
  restaurant: "Restaurant",
  transport: "Transport",
  hebergement: "Hébergement",
  shopping: "Shopping",
  orientation: "Orientation",
  urgences: "Urgences",
};

export default function VoyageCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();

  const restaurant = useFlashcards(restaurantCards, "tef-voyage-restaurant");
  const transport = useFlashcards(transportCards, "tef-voyage-transport");
  const hebergement = useFlashcards(hebergementCards, "tef-voyage-hebergement");
  const shopping = useFlashcards(shoppingCards, "tef-voyage-shopping");
  const orientation = useFlashcards(orientationCards, "tef-voyage-orientation");
  const urgences = useFlashcards(urgencesCards, "tef-voyage-urgences");

  const deckMap: Record<VoyageCategory, typeof restaurant> = {
    restaurant,
    transport,
    hebergement,
    shopping,
    orientation,
    urgences,
  };

  if (!VALID.has(category)) notFound();

  const deck = deckMap[category as VoyageCategory];
  const title = VOYAGE_TITLES[category as VoyageCategory] ?? category;

  return (
    <FlashcardCategoryShell
      title={title}
      deck={deck}
      isFavoriteCard={isFavoriteCard}
      toggleFavoriteCard={toggleFavoriteCard}
    />
  );
}
