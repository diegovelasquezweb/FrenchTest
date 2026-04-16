"use client";

import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { FavoriteCollectionShell } from "@/src/components/shells";

export default function MesPatternsPage() {
  const { isFavoriteCard, toggleFavoriteCard, favoriteCardList } = useFavoriteCards();

  return (
    <FavoriteCollectionShell
      title="Mes patterns"
      storageKey="tef-mes-patterns-progress"
      favoriteList={favoriteCardList}
      isFavoriteCard={isFavoriteCard}
      toggleFavoriteCard={toggleFavoriteCard}
      copy={{
        emptyHeading: "Aucun pattern sauvegardé",
        emptyDescription:
          "Marque des patterns comme favoris pendant tes sessions pour les retrouver ici.",
        countLabel: (n) => `${n} pattern${n > 1 ? "s" : ""}`,
      }}
    />
  );
}
