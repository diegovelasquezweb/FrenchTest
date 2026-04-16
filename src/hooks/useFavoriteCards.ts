import { useState, useCallback, useMemo, useEffect } from "react";
import type { Flashcard } from "../types";
import { FLASHCARDS } from "../data/flashcards";
import { VOCABULAIRE_CARDS } from "../data/vocabulaireCards";
import { VOCABULAIRE_EXTRA_CARDS } from "../data/vocabulaireExtraCards";
import { GENRE_CARDS } from "../data/genreCards";
import { PIEGES_CARDS } from "../data/piegesCards";
import { ACCENTS_CARDS } from "../data/accentsCards";
import { getFavoriteCards, saveFavoriteCards } from "../lib/favoriteCards";
import { subscribeToStore } from "../lib/store";

const PATTERNS_CATEGORIES = new Set<Flashcard["category"]>([
  "oral", "oral-persuasion", "écrit-faits-divers", "connecteurs", "argumentation",
]);

const ALL_VOCAB_CARDS: Flashcard[] = [
  ...VOCABULAIRE_CARDS,
  ...VOCABULAIRE_EXTRA_CARDS,
  ...GENRE_CARDS,
  ...PIEGES_CARDS,
  ...ACCENTS_CARDS,
];

export interface UseFavoriteCardsReturn {
  favoriteIds: Set<string>;
  isFavoriteCard(id: string): boolean;
  toggleFavoriteCard(id: string): void;
  favoriteCardList: Flashcard[];
  favoriteVocabList: Flashcard[];
}

export function useFavoriteCards(): UseFavoriteCardsReturn {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(getFavoriteCards);

  useEffect(() => subscribeToStore(() => setFavoriteIds(getFavoriteCards())), []);

  const isFavoriteCard = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds]
  );

  const toggleFavoriteCard = useCallback((id: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavoriteCards(next);
      return next;
    });
  }, []);

  const favoriteCardList = useMemo(
    () => FLASHCARDS.filter(c => favoriteIds.has(c.id) && PATTERNS_CATEGORIES.has(c.category)),
    [favoriteIds]
  );

  const favoriteVocabList = useMemo(
    () => ALL_VOCAB_CARDS.filter(c => favoriteIds.has(c.id)),
    [favoriteIds]
  );

  return { favoriteIds, isFavoriteCard, toggleFavoriteCard, favoriteCardList, favoriteVocabList };
}
