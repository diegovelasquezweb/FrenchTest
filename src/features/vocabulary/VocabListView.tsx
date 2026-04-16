import { useEffect, useMemo, useState } from "react";
import { Bookmark, Search } from "lucide-react";
import type { Flashcard } from "../../types";

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
  const [activeLetter, setActiveLetter] = useState<string>("A");
  const [isIndexOpen, setIsIndexOpen] = useState(false);

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
  const availableLetterList = LETTERS.filter((letter) => availableLetters.has(letter));

  useEffect(() => {
    if (availableLetterList.length === 0) return;
    if (!availableLetters.has(activeLetter)) {
      setActiveLetter(availableLetterList[0]);
    }
  }, [activeLetter, availableLetterList, availableLetters]);

  return (
    <div className="mx-auto w-full max-w-4xl rounded-card bg-surface shadow-sm overflow-hidden">
      <div className="border-b border-ink/8 px-4 py-4 sm:px-6">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher en français, anglais, espagnol ou dans l’exemple"
            className="w-full rounded border border-ink/12 bg-bg py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-muted">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </p>
          <button
            type="button"
            onClick={() => setIsIndexOpen((v) => !v)}
            className="px-1 h-7 text-xs text-muted underline underline-offset-2 hover:text-ink transition-colors duration-150"
          >
            {isIndexOpen ? "masquer l’indice" : "afficher l’indice"}
          </button>
        </div>
      </div>

      {isIndexOpen && (
        <div className="border-b border-ink/8 bg-surface px-3 py-2 sm:px-6">
          <div className="flex flex-wrap gap-1.5">
            {LETTERS.map((letter) => {
              const enabled = availableLetters.has(letter);
              const isActive = activeLetter === letter && enabled;
              return (
                <button
                  key={letter}
                  type="button"
                  disabled={!enabled}
                  onClick={() => {
                    setActiveLetter(letter);
                    document.getElementById(`vocab-index-${letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`h-6 min-w-6 rounded px-1 text-[11px] font-semibold transition-colors ${
                    isActive
                      ? "bg-brand/16 text-brand"
                      : enabled
                      ? "bg-ink/7 text-ink hover:bg-brand/14 hover:text-brand"
                      : "bg-ink/4 text-muted/50 cursor-not-allowed"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-3 py-3 sm:px-6">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted">
            Aucun résultat pour cette recherche.
          </div>
        ) : (
          <div className="space-y-4">
            {LETTERS.filter((letter) => availableLetters.has(letter)).map((letter) => (
              <section key={letter} id={`vocab-index-${letter}`}>
                <div className="mb-2 py-1">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-brand/12 px-2 text-xs font-bold text-brand">
                    {letter}
                  </span>
                </div>
                <ul className="space-y-2">
                  {(groups.get(letter) ?? []).map((card) => (
                    <li key={card.id} className="rounded border border-ink/8 p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-ink" lang="fr">
                            {card.front}
                          </p>
                          <span className="mt-1 inline-flex rounded bg-ink/6 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                            {categoryFromCard(card)}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onPractice(card)}
                            className="rounded border border-ink/12 px-2.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-ink/6"
                          >
                            Pratiquer
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleFavorite(card.id)}
                            aria-label={isFavoriteCard(card.id) ? "Retirer des favoris" : "Sauvegarder"}
                            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                              isFavoriteCard(card.id)
                                ? "text-ink"
                                : "text-muted hover:text-ink"
                            }`}
                          >
                            <Bookmark size={13} fill={isFavoriteCard(card.id) ? "currentColor" : "none"} />
                            Sauvegarder
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted" lang="en">
                        ENG: {card.translationEn}
                      </p>
                      <p className="mt-0.5 text-xs text-muted" lang="es">
                        ESP: {card.translationEs}
                      </p>
                      <p className="mt-2 text-xs text-muted" lang="fr">
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
