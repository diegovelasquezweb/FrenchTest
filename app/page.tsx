"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Gamepad2,
  Heart,
  Bookmark,
  Columns3,
  PenSquare,
  ChevronDown,
} from "lucide-react";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { getItem, setItem, subscribeToStore } from "@/src/lib/store";

/** Collapse verbose "Test X" labels to just "Test" inside their section. */
function displayLabel(label: string): string {
  return label.startsWith("Test ") ? "Test" : label;
}

type NavItem = { label: string; href: string };

const ACCORDION_SECTIONS: { id: string; label: string; items: NavItem[] }[] = [
  {
    id: "vocabulaire",
    label: "Vocabulaire",
    items: [
      { label: "Verbes",              href: "/vocabulaire/verbes" },
      { label: "Adjectifs",           href: "/vocabulaire/adjectifs" },
      { label: "Noms",                href: "/vocabulaire/noms" },
      { label: "Expressions",         href: "/vocabulaire/expressions" },
      { label: "Genre",               href: "/vocabulaire/genre" },
      { label: "Erreurs",             href: "/vocabulaire/erreurs" },
      { label: "Accents",             href: "/vocabulaire/accents" },
      { label: "Mixte",               href: "/vocabulaire/mix" },
      { label: "Liste vocabulaire",   href: "/vocabulaire/liste" },
    ],
  },
  {
    id: "oral",
    label: "Oral",
    items: [
      { label: "Renseignements",  href: "/parcours/oral-interaction" },
      { label: "Persuasion",      href: "/parcours/oral-monologue" },
      { label: "Test oral",       href: "/quiz/oral" },
    ],
  },
  {
    id: "ecrit",
    label: "Écrit",
    items: [
      { label: "Faits divers",    href: "/parcours/ecrit-faits-divers" },
      { label: "Argumentatif",    href: "/parcours/ecrit-argumentatif" },
      { label: "Test écrit",      href: "/quiz/ecrit" },
    ],
  },
  {
    id: "grammaire",
    label: "Grammaire",
    items: [
      { label: "Participe passé",         href: "/quiz/participe" },
      { label: "Imparfait",               href: "/quiz/imparfait" },
      { label: "Présent",                 href: "/quiz/present" },
      { label: "Subjonctif",              href: "/quiz/subjonctif" },
      { label: "Plus-que-parfait",        href: "/quiz/plus-que-parfait" },
      { label: "Articles & contractions", href: "/quiz/articles" },
      { label: "Orthographe",             href: "/quiz/orthographe" },
      { label: "Futur simple",            href: "/quiz/futur" },
      { label: "Conditionnel",            href: "/quiz/conditionnel" },
      { label: "Pronominales",            href: "/quiz/pronominales" },
      { label: "Test grammaire",          href: "/quiz/grammaire" },
    ],
  },
  {
    id: "connecteurs",
    label: "Connecteurs",
    items: [
      { label: "Connecteurs",      href: "/parcours/connecteurs" },
      { label: "Test connecteurs", href: "/quiz/connecteurs" },
    ],
  },
  {
    id: "etre-avoir",
    label: "MRS VANDERTRAMP",
    items: [
      { label: "Être / avoir",      href: "/parcours/etre-avoir" },
      { label: "Test être / avoir", href: "/quiz/etre-avoir" },
      { label: "Liste des verbes",  href: "/guides/etre-avoir" },
    ],
  },
  {
    id: "voyage",
    label: "Voyage",
    items: [
      { label: "Restaurant",  href: "/voyage/restaurant" },
      { label: "Transport",   href: "/voyage/transport" },
      { label: "Hébergement", href: "/voyage/hebergement" },
      { label: "Shopping",    href: "/voyage/shopping" },
      { label: "Orientation", href: "/voyage/orientation" },
      { label: "Urgences",    href: "/voyage/urgences" },
    ],
  },
];

// Flat label→href lookup for the favorites section.
const ITEM_LOOKUP: Record<string, string> = Object.fromEntries(
  ACCORDION_SECTIONS.flatMap((s) => s.items.map((i) => [i.label, i.href])),
);

export default function HomePage() {
  const router = useRouter();
  const { weakVerbList } = useWeakVerbs();
  const { favoriteCardList } = useFavoriteCards();
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const s = getItem("tef-favorites");
      return s ? (JSON.parse(s) as string[]) : [];
    } catch {
      return [];
    }
  });
  const favInitialized = useRef(false);

  // Sync favorites from store (cross-tab / Sidebar writes).
  useEffect(
    () =>
      subscribeToStore(() => {
        try {
          const s = getItem("tef-favorites");
          const next = s ? (JSON.parse(s) as string[]) : [];
          setFavorites((prev) => {
            if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
            return next;
          });
        } catch { /* noop */ }
      }),
    [],
  );

  // Persist favorites (skip initial render to avoid overwriting store).
  useEffect(() => {
    if (!favInitialized.current) { favInitialized.current = true; return; }
    setItem("tef-favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(label: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  }

  // On desktop, redirect directly to Marathon.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) {
      void router.replace("/marathon");
    }
  }, [router]);

  return (
    <div className="md:hidden flex flex-col gap-4 px-6 py-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-base font-semibold text-(--color-ink)">Prêt à pratiquer ?</p>
        <p className="text-sm text-(--color-muted)">Choisissez un exercice ci-dessous.</p>
      </div>

      {/* Marathon — featured */}
      <div className="w-full rounded overflow-hidden border border-(--color-brand)/25 bg-(--color-brand)/6 shadow-sm">
        <Link
          href="/marathon"
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/12 hover:text-(--color-brand) active:bg-(--color-brand)/18"
        >
          <Gamepad2 size={16} className="shrink-0" />
          Marathon
        </Link>
      </div>

      {/* Leçons favorites */}
      {favorites.length > 0 && (
        <div className="w-full">
          <p className="mb-2 px-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-(--color-muted)">
            <Heart size={12} className="shrink-0" />
            Leçons favorites
          </p>
          <div className="rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
            {favorites.map((label) => {
              const href = ITEM_LOOKUP[label];
              if (!href) return null;
              return (
                <div key={label} className="relative border-t border-(--color-ink)/8 first:border-t-0">
                  <Link
                    href={href}
                    className="flex w-full items-center gap-2.5 px-4 py-3 pr-12 text-left text-sm font-medium text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
                  >
                    {label}
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(label, e)}
                    aria-label={`Retirer ${label} des favoris`}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-(--color-muted)"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mes difficiles */}
      {weakVerbList.length > 0 && (
        <div className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
          <Link
            href="/mes-difficiles"
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
          >
            <Bookmark size={16} className="shrink-0" />
            Mes difficiles
            <span className="ml-auto text-[10px] font-bold text-(--color-muted)">{weakVerbList.length}</span>
          </Link>
        </div>
      )}

      {/* Mes patterns */}
      {favoriteCardList.length > 0 && (
        <div className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
          <Link
            href="/mes-patterns"
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
          >
            <Bookmark size={16} className="shrink-0" />
            Mes patterns
            <span className="ml-auto text-[10px] font-bold text-(--color-muted)">{favoriteCardList.length}</span>
          </Link>
        </div>
      )}

      {/* Accordion sections */}
      <Accordion.Root type="multiple" className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
        {ACCORDION_SECTIONS.map((section, si) => (
          <Accordion.Item
            key={section.id}
            value={section.id}
            className={si > 0 ? "border-t border-(--color-ink)/8" : ""}
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-(--color-muted) transition-colors hover:text-(--color-ink) data-[state=open]:text-(--color-ink)">
                {section.label}
                <ChevronDown
                  size={15}
                  className="text-(--color-muted) transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=open]:animate-none">
              <div className="flex flex-col pb-2">
                {section.items.map(({ label, href }) => {
                  const isFav = favorites.includes(label);
                  return (
                    <div key={label} className="relative">
                      <Link
                        href={href}
                        className="w-full block px-4 py-3 pr-12 text-left text-sm font-medium text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
                      >
                        {displayLabel(label)}
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(label, e)}
                        aria-label={isFav ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-(--color-muted)"
                      >
                        <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      {/* Verbes essentiels */}
      <div className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
        <Link
          href="/guides/verbes-essentiels"
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
        >
          <Columns3 size={16} className="shrink-0" />
          Verbes essentiels
        </Link>
      </div>

      {/* Terminaisons verbales */}
      <div className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
        <Link
          href="/guides/terminaisons"
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
        >
          <PenSquare size={16} className="shrink-0" />
          Terminaisons verbales
        </Link>
      </div>
    </div>
  );
}
