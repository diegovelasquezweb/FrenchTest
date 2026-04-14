import { useState, useCallback } from "react";
import type { Flashcard } from "../types";
import { FLASHCARDS } from "../data/flashcards";
import { getFavoriteCards, saveFavoriteCards } from "../lib/favoriteCards";

const PATTERNS_CATEGORIES = new Set<Flashcard["category"]>([
  "oral", "oral-persuasion", "écrit-faits-divers", "connecteurs", "argumentation",
]);

export interface UseFavoriteCardsReturn {
  favoriteIds: Set<string>;
  isFavoriteCard(id: string): boolean;
  toggleFavoriteCard(id: string): void;
  favoriteCardList: Flashcard[];
}

export function useFavoriteCards(): UseFavoriteCardsReturn {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(getFavoriteCards);

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

  const favoriteCardList = FLASHCARDS.filter(
    c => favoriteIds.has(c.id) && PATTERNS_CATEGORIES.has(c.category)
  );

  return { favoriteIds, isFavoriteCard, toggleFavoriteCard, favoriteCardList };
}
