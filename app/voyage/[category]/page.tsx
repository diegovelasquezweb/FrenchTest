"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { useFlashcards } from "@/src/hooks/useFlashcards";
import { FlashcardView } from "@/src/components/FlashcardView";
import { FlashcardResults } from "@/src/components/FlashcardResults";
import { useSetFlashcardHeader } from "@/src/lib/header-context";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { TOURISTE_CARDS } from "@/src/data/touristeCards";

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

const restaurantCards = TOURISTE_CARDS.filter(
  (c) => c.subCategory === "restaurant",
);
const transportCards = TOURISTE_CARDS.filter(
  (c) => c.subCategory === "transport",
);
const hebergementCards = TOURISTE_CARDS.filter(
  (c) => c.subCategory === "hebergement",
);
const shoppingCards = TOURISTE_CARDS.filter(
  (c) => c.subCategory === "shopping",
);
const orientationCards = TOURISTE_CARDS.filter(
  (c) => c.subCategory === "orientation",
);
const urgencesCards = TOURISTE_CARDS.filter(
  (c) => c.subCategory === "urgences",
);

export default function VoyageCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const router = useRouter();
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

  const deck = VALID.has(category)
    ? deckMap[category as VoyageCategory]
    : null;

  const VOYAGE_TITLES: Record<VoyageCategory, string> = {
    restaurant: "Restaurant",
    transport: "Transport",
    hebergement: "Hébergement",
    shopping: "Shopping",
    orientation: "Orientation",
    urgences: "Urgences",
  };

  useSetFlashcardHeader(VOYAGE_TITLES[category as VoyageCategory] ?? category, deck!);

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
