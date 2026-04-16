"use client";

import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { FavoriteCollectionShell } from "@/src/components/templates";

export default function MonVocabulairePage() {
  const { isFavoriteCard, toggleFavoriteCard, favoriteVocabList } = useFavoriteCards();

  return (
    <FavoriteCollectionShell
      title="Mon vocabulaire"
      storageKey="tef-mes-vocab-progress"
      favoriteList={favoriteVocabList}
      isFavoriteCard={isFavoriteCard}
      toggleFavoriteCard={toggleFavoriteCard}
      copy={{
        emptyHeading: "Aucun mot sauvegardé",
        emptyDescription:
          "Marque des mots comme favoris dans la liste de vocabulaire pour les retrouver ici.",
        countLabel: (n) => `${n} mot${n > 1 ? "s" : ""}`,
      }}
    />
  );
}
