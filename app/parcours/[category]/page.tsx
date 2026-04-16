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
import { FLASHCARDS } from "@/src/data/flashcards";

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

export default function ParcoursCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const router = useRouter();
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

  const deck = VALID.has(category)
    ? deckMap[category as ParcoursCategory]
    : null;

  const PARCOURS_TITLES: Record<ParcoursCategory, string> = {
    connecteurs: "Connecteurs",
    "oral-interaction": "Renseignements",
    "oral-monologue": "Persuasion",
    "ecrit-faits-divers": "Faits divers",
    "ecrit-argumentatif": "Argumentatif",
  };

  useSetFlashcardHeader(PARCOURS_TITLES[category as ParcoursCategory] ?? category, deck!);

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
