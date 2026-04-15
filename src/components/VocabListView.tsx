import { useMemo } from "react";
import { Bookmark, Search } from "lucide-react";
import type { Flashcard } from "../types";

interface VocabListViewProps {
  cards: Flashcard[];
  query: string;
  onQueryChange(value: string): void;
  isFavoriteCard(id: string): boolean;
  onToggleFavorite(id: string): void;
  onPractice(card: Flashcard): void;
}

const LETTERS = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "#",
] as const;

const CATEGORY_LABEL: Record<string, string> = {
  verbes: "Verbes",
  adjectifs: "Adjectifs",
  noms: "Noms",
  expressions: "Expressions",
  genre: "Genre",
  erreurs: "Erreurs",
  accents: "Accents",
};

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function firstLetter(front: string): string {
  const normalized = normalize(front).trim();
  const found = normalized.match(/[a-z]/)?.[0]?.toUpperCase() ?? "#";
  return /[A-Z]/.test(found) ? found : "#";
}

function categoryFromCard(card: Flashcard): string {
  return CATEGORY_LABEL[card.subCategory ?? "verbes"] ?? "Autres";
}

export function VocabListView({
  cards,
  query,
  onQueryChange,
  isFavoriteCard,
  onToggleFavorite,
  onPractice,
}: VocabListViewProps) {
  const filtered = useMemo(() => {
    const q = normalize(query);
    const base = q.length === 0
      ? cards
      : cards.filter((card) => {
          const haystack = normalize(`${card.front} ${card.translationEn} ${card.translationEs} ${card.usage}`);
          return haystack.includes(q);
        });
    return [...base].sort((a, b) => normalize(a.front).localeCompare(normalize(b.front), "fr"));
  }, [cards, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Flashcard[]>();
    for (const letter of LETTERS) map.set(letter, []);
    for (const card of filtered) {
      const key = firstLetter(card.front);
      map.get(key)?.push(card);
    }
    return map;
  }, [filtered]);

  const availableLetters = new Set(
    LETTERS.filter((letter) => (groups.get(letter)?.length ?? 0) > 0)
  );

  return (
    <div className="mx-auto w-full max-w-4xl rounded-(--radius-card) bg-(--color-surface) shadow-sm overflow-hidden">
      <div className="border-b border-(--color-ink)/8 px-4 py-4 sm:px-6">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher en français, anglais, espagnol ou dans l’exemple"
            className="w-full rounded border border-(--color-ink)/12 bg-(--color-bg) py-2.5 pl-9 pr-3 text-sm text-(--color-ink) outline-none transition-colors focus:border-(--color-brand)/40 focus:ring-2 focus:ring-(--color-brand)/20"
          />
        </div>
        <p className="mt-2 text-xs text-(--color-muted)">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="sticky top-0 z-10 border-b border-(--color-ink)/8 bg-(--color-surface)/95 px-3 py-2 backdrop-blur-sm sm:px-6">
        <div className="flex flex-wrap gap-1.5">
          {LETTERS.map((letter) => {
            const enabled = availableLetters.has(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={!enabled}
                onClick={() => document.getElementById(`vocab-index-${letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className={`h-6 min-w-6 rounded px-1 text-[11px] font-semibold transition-colors ${
                  enabled
                    ? "bg-(--color-ink)/7 text-(--color-ink) hover:bg-(--color-brand)/14 hover:text-(--color-brand)"
                    : "bg-(--color-ink)/4 text-(--color-muted)/50 cursor-not-allowed"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-h-[65vh] overflow-y-auto px-3 py-3 sm:px-6">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-(--color-muted)">
            Aucun résultat pour cette recherche.
          </div>
        ) : (
          <div className="space-y-4">
            {LETTERS.filter((letter) => availableLetters.has(letter)).map((letter) => (
              <section key={letter} id={`vocab-index-${letter}`} className="scroll-mt-20">
                <div className="mb-2 sticky top-0 z-[1] bg-(--color-surface)/95 backdrop-blur-sm py-1">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-(--color-brand)/12 px-2 text-xs font-bold text-(--color-brand)">
                    {letter}
                  </span>
                </div>
                <ul className="space-y-2">
                  {(groups.get(letter) ?? []).map((card) => (
                    <li key={card.id} className="rounded border border-(--color-ink)/8 p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-(--color-ink)" lang="fr">
                            {card.front}
                          </p>
                          <span className="mt-1 inline-flex rounded bg-(--color-ink)/6 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-(--color-muted)">
                            {categoryFromCard(card)}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onPractice(card)}
                            className="rounded border border-(--color-ink)/12 px-2.5 py-1.5 text-xs font-semibold text-(--color-ink) transition-colors hover:bg-(--color-ink)/6"
                          >
                            Pratiquer
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleFavorite(card.id)}
                            aria-label={isFavoriteCard(card.id) ? "Retirer des favoris" : "Sauvegarder"}
                            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                              isFavoriteCard(card.id)
                                ? "text-(--color-ink)"
                                : "text-(--color-muted) hover:text-(--color-ink)"
                            }`}
                          >
                            <Bookmark size={13} fill={isFavoriteCard(card.id) ? "currentColor" : "none"} />
                            Sauvegarder
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-(--color-muted)" lang="en">
                        ENG: {card.translationEn}
                      </p>
                      <p className="mt-0.5 text-xs text-(--color-muted)" lang="es">
                        ESP: {card.translationEs}
                      </p>
                      <p className="mt-2 text-xs text-(--color-muted)" lang="fr">
                        {card.usage}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
