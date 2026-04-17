"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Accordion from "@radix-ui/react-accordion";
import { Heart, ChevronDown } from "lucide-react";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { getItem, setItem, subscribeToStore } from "@/src/lib/store";
import { NAV_GROUPS, ITEM_HREF_LOOKUP, displayLabel, type NavGroupSingle } from "@/src/lib/nav";

function singleGroup(id: string): NavGroupSingle {
  return NAV_GROUPS.find((g): g is NavGroupSingle => g.type === "single" && g.id === id)!;
}

// Accordion sections only (type === "accordion")
const ACCORDION_SECTIONS = NAV_GROUPS.filter(
  (g): g is Extract<typeof NAV_GROUPS[number], { type: "accordion" }> => g.type === "accordion",
);

// Standalone single buttons shown in mobile (not sidebarOnly, not conditional)
const STANDALONE_SINGLES = NAV_GROUPS.filter(
  (g): g is Extract<typeof NAV_GROUPS[number], { type: "single" }> =>
    g.type === "single" &&
    !g.marathon &&
    !["difficiles", "mes-patterns", "mes-vocab"].includes(g.id) &&
    !g.sidebarOnly,
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
        <p className="text-base font-semibold text-ink">Prêt à pratiquer ?</p>
        <p className="text-sm text-muted">Choisissez un exercice ci-dessous.</p>
      </div>

      {/* Marathon — featured */}
      <div className="w-full rounded overflow-hidden border border-brand/25 bg-brand/6 shadow-sm">
        <Link
          href="/marathon"
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-ink transition-colors hover:bg-brand/12 hover:text-brand active:bg-brand/18"
        >
          {(() => { const g = singleGroup("marathon"); return <g.icon size={16} className="shrink-0" />; })()}
          Marathon
        </Link>
      </div>

      {/* Leçons favorites */}
      {favorites.length > 0 && (
        <div className="w-full">
          <p className="mb-2 px-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted">
            <Heart size={12} className="shrink-0" />
            Leçons favorites
          </p>
          <div className="rounded overflow-hidden border border-ink/10 bg-surface shadow-sm">
            {favorites.map((label) => {
              const href = ITEM_HREF_LOOKUP[label];
              if (!href) return null;
              return (
                <div key={label} className="relative border-t border-ink/8 first:border-t-0">
                  <Link
                    href={href}
                    className="flex w-full items-center gap-2.5 px-4 py-3 pr-12 text-left text-sm font-medium text-ink transition-colors hover:bg-brand/8 hover:text-brand active:bg-brand/15"
                  >
                    {label}
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(label, e)}
                    aria-label={`Retirer ${label} des favoris`}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted"
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
        <div className="w-full rounded overflow-hidden border border-ink/10 bg-surface shadow-sm">
          <Link
            href="/mes-difficiles"
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-ink transition-colors hover:bg-brand/8 hover:text-brand active:bg-brand/15"
          >
            {(() => { const g = singleGroup("difficiles"); return <g.icon size={16} className="shrink-0" />; })()}
            Mes difficiles
            <span className="ml-auto text-[10px] font-bold text-muted">{weakVerbList.length}</span>
          </Link>
        </div>
      )}


      {favoriteCardList.length > 0 && (
        <div className="w-full rounded overflow-hidden border border-ink/10 bg-surface shadow-sm">
          <Link
            href="/mes-patterns"
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-ink transition-colors hover:bg-brand/8 hover:text-brand active:bg-brand/15"
          >
            {(() => { const g = singleGroup("mes-patterns"); return <g.icon size={16} className="shrink-0" />; })()}
            Mes modèles
            <span className="ml-auto text-[10px] font-bold text-muted">{favoriteCardList.length}</span>
          </Link>
        </div>
      )}

      {/* Accordion sections */}
      <Accordion.Root type="multiple" className="w-full rounded overflow-hidden border border-ink/10 bg-surface shadow-sm">
        {ACCORDION_SECTIONS.map((section, si) => (
          <Accordion.Item
            key={section.id}
            value={section.id}
            className={si > 0 ? "border-t border-ink/8" : ""}
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-ink data-[state=open]:text-ink">
                {section.label}
                <ChevronDown
                  size={15}
                  className="text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
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
                        className="w-full block px-4 py-3 pr-12 text-left text-sm font-medium text-ink transition-colors hover:bg-brand/8 hover:text-brand active:bg-brand/15"
                      >
                        {displayLabel(label)}
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(label, e)}
                        aria-label={isFav ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted"
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

      {/* Standalone single buttons (Verbes essentiels, Terminaisons verbales) */}
      {STANDALONE_SINGLES.map((group) => (
        <div key={group.id} className="w-full rounded overflow-hidden border border-ink/10 bg-surface shadow-sm">
          <Link
            href={group.href}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-ink transition-colors hover:bg-brand/8 hover:text-brand active:bg-brand/15"
          >
            <group.icon size={16} className="shrink-0" />
            {group.label}
          </Link>
        </div>
      ))}
    </div>
  );
}
