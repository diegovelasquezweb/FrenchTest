"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { VocabListView } from "@/src/features/vocabulary/VocabListView";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { VOCABULAIRE_CARDS } from "@/src/data/vocabulaireCards";
import { VOCABULAIRE_EXTRA_CARDS } from "@/src/data/vocabulaireExtraCards";
import { GENRE_CARDS } from "@/src/data/genreCards";
import { PIEGES_CARDS } from "@/src/data/piegesCards";
import { ACCENTS_CARDS } from "@/src/data/accentsCards";
import type { Flashcard } from "@/src/types";

const ALL_VOCAB_CARDS: Flashcard[] = [
  ...VOCABULAIRE_CARDS,
  ...VOCABULAIRE_EXTRA_CARDS,
  ...GENRE_CARDS,
  ...PIEGES_CARDS,
  ...ACCENTS_CARDS,
];

const VOCAB_SUB_CATS = new Set(["verbes", "adjectifs", "noms", "expressions"]);

export default function VocabListPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { isFavoriteCard, toggleFavoriteCard } = useFavoriteCards();

  function handlePractice(card: Flashcard) {
    if (card.subCategory && VOCAB_SUB_CATS.has(card.subCategory)) {
      void router.push(`/vocabulaire/${card.subCategory}`);
    } else {
      void router.push("/vocabulaire/mix");
    }
  }

  return (
    <AuthGate>
      <div className="px-4 py-6">
        <VocabListView
          cards={ALL_VOCAB_CARDS}
          query={query}
          onQueryChange={setQuery}
          isFavoriteCard={isFavoriteCard}
          onToggleFavorite={toggleFavoriteCard}
          onPractice={handlePractice}
        />
      </div>
    </AuthGate>
  );
}
