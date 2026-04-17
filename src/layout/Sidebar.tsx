"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import {
  BookCheck,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Heart,
} from "lucide-react";
import { ThemeToggle } from "@/src/components/ui/ThemeToggle";
import { useAuth } from "@/src/lib/auth-context";
import { useTheme } from "@/src/hooks/useTheme";
import { logout } from "@/src/lib/auth";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";
import { getItem, setItem, subscribeToStore } from "@/src/lib/store";
import { NAV_GROUPS, NO_SEPARATOR_IDS } from "@/src/lib/nav";

interface SidebarProps {
  onOpenAiChat?: () => void;
}

export function Sidebar({ onOpenAiChat }: SidebarProps) {
  const pathname = usePathname();
  const { session, status } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["favoris"]));
  const { weakVerbList } = useWeakVerbs();
  const { favoriteCardList, favoriteVocabList } = useFavoriteCards();
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { const s = getItem("tef-favorites"); return s ? (JSON.parse(s) as string[]) : []; } catch { return []; }
  });
  const favInitialized = useRef(false);

  useEffect(() => subscribeToStore(() => {
    try {
      const s = getItem("tef-favorites");
      const next = s ? (JSON.parse(s) as string[]) : [];
      setFavorites((prev) => {
        if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
        return next;
      });
    } catch { /* noop */ }
  }), []);

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

  useEffect(() => {
    for (const group of NAV_GROUPS) {
      if (group.type === "accordion") {
        if (group.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))) {
          setOpenGroups((prev) => new Set([...prev, group.id]));
        }
      }
    }
  }, [pathname]);

  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  async function handleLogout() {
    await logout();
    window.location.assign("/");
  }

  const login =
    status === "authed"
      ? (session?.login ?? "?")
      : status === "guest"
        ? "Invité"
        : "?";
  const initial = login[0]?.toUpperCase() ?? "?";

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-ink/8 bg-surface">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-ink/8">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-ink hover:text-brand transition-colors duration-150"
        >
          🇨🇦 TEF Pratiquer
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1" aria-label="Navigation">
        {/* Marathon — always first */}
        {(() => {
          const g = NAV_GROUPS.find(g => g.id === "marathon")!;
          if (g.type !== "single") return null;
          const isActive = pathname === g.href;
          return (
            <div key={g.id}>
              <Link
                href={g.href}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? "bg-brand/14 text-brand"
                    : "text-ink bg-brand/6 border border-brand/20 hover:bg-brand/10"
                }`}
              >
                <g.icon size={16} className="shrink-0" />
                <span className="flex-1">{g.label}</span>
              </Link>
            </div>
          );
        })()}

        {/* Leçons favorites — collapsible accordion, open by default, hidden when empty */}
        {favorites.length > 0 && (() => {
          const hrefMap = new Map<string, string>();
          for (const g of NAV_GROUPS) {
            if (g.type === "accordion") {
              for (const item of g.items) hrefMap.set(item.label, item.href);
            }
          }
          const isOpen = openGroups.has("favoris");
          return (
            <div>
              <button
                type="button"
                onClick={() => toggleGroup("favoris")}
                className="w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors duration-150 hover:bg-ink/5 group"
              >
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-ink transition-colors">
                  <Heart size={12} className="shrink-0" />
                  Leçons favorites
                </span>
                {isOpen
                  ? <ChevronDown size={16} className="text-ink transition-transform duration-200" />
                  : <ChevronRight size={16} className="text-ink transition-transform duration-200" />}
              </button>
              {isOpen && (
                <div className="mt-0.5 mb-2 flex flex-col gap-0.5">
                  {favorites.map((label) => {
                    const href = hrefMap.get(label);
                    if (!href) return null;
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    return (
                      <div key={label} className="group/item relative">
                        <Link
                          href={href}
                          className={`flex items-center gap-2.5 px-3 py-2 pr-8 rounded text-sm font-medium transition-colors duration-150 ${
                            isActive
                              ? "bg-brand/10 text-brand"
                              : "text-ink hover:bg-ink/6"
                          }`}
                        >
                          <BookCheck size={15} className="shrink-0" />
                          {label}
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(label, e)}
                          aria-label={`Retirer ${label} des favoris`}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                        >
                          <Heart size={13} fill="currentColor" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {NAV_GROUPS.map((group, idx) => {
          const isFirst = idx === 0;
          const noSep = isFirst || NO_SEPARATOR_IDS.has(group.id);
          const sepClass = noSep ? "" : "pt-2 border-t border-ink/16";

          if (group.type === "single") {
            if (group.id === "marathon") return null; // rendered separately above
            if (group.id === "difficiles" && weakVerbList.length === 0) return null;
            if (group.id === "mes-patterns" && favoriteCardList.length === 0) return null;
            if (group.id === "mes-vocab" && favoriteVocabList.length === 0) return null;

            const isActive = pathname === group.href;
            const isMarathon = group.marathon === true;
            const badge =
              group.id === "difficiles" ? weakVerbList.length :
              group.id === "mes-patterns" ? favoriteCardList.length :
              group.id === "mes-vocab" ? favoriteVocabList.length : 0;

            return (
              <div key={group.id} className={sepClass}>
                <Link
                  href={group.href}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? "bg-brand/14 text-brand"
                      : isMarathon
                        ? "text-ink bg-brand/6 border border-brand/20 hover:bg-brand/10"
                        : "text-ink hover:bg-ink/6"
                  }`}
                >
                  <group.icon size={16} className="shrink-0" />
                  <span className="flex-1">{group.label}</span>
                  {badge > 0 && (
                    <span className="text-[10px] font-bold text-muted">{badge}</span>
                  )}
                </Link>
              </div>
            );
          }

          const isOpen = openGroups.has(group.id);
          const hasActive = group.items.some(
            (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
          );

          return (
            <div key={group.id} className={sepClass}>
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors duration-150 hover:bg-ink/5 ${
                  hasActive && !isOpen ? "text-brand" : ""
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">
                  {group.label}
                </span>
                {isOpen ? (
                  <ChevronDown size={16} className="text-ink" />
                ) : (
                  <ChevronRight size={16} className="text-ink" />
                )}
              </button>

              {isOpen && (
                <div className="mt-0.5 mb-2 flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon ?? BookCheck;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const isFav = favorites.includes(item.label);
                    return (
                      <div key={item.href} className="group/item relative">
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 pr-8 rounded text-sm font-medium transition-colors duration-150 ${
                            isActive
                              ? "bg-brand/10 text-brand"
                              : "text-ink hover:bg-ink/6"
                          }`}
                        >
                          <Icon size={14} className="shrink-0" />
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(item.label, e)}
                          aria-label={isFav ? `Retirer ${item.label} des favoris` : `Ajouter ${item.label} aux favoris`}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-150 ${
                            isFav
                              ? "text-muted"
                              : "opacity-0 group-hover/item:opacity-60 text-muted"
                          }`}
                        >
                          <Heart size={13} fill={isFav ? "currentColor" : "none"} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* AI Chat (authed only) */}
      {status === "authed" && (
        <div className="px-4 py-2 border-t border-ink/8">
          <button
            type="button"
            onClick={onOpenAiChat}
            className="w-full flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:bg-ink/6 hover:text-ink"
          >
            <MessageCircle size={15} className="shrink-0" />
            Demander à l&apos;IA
          </button>
        </div>
      )}

      {/* User footer */}
      <div className="border-t border-ink/8 flex items-center justify-between px-4 py-3">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-ink/5 transition-colors duration-150"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
                {initial}
              </span>
              <span className="text-xs font-medium text-ink max-w-24 truncate">{login}</span>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              align="start"
              sideOffset={8}
              className="z-50 min-w-36 rounded-card border border-ink/8 bg-surface py-1 shadow-lg"
            >
              {status === "authed" && (
                <Link
                  href="/mes-notes"
                  className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-ink/5 transition-colors duration-150"
                >
                  Mes notes
                </Link>
              )}
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/8 transition-colors duration-150"
              >
                Déconnexion
              </button>
              <Popover.Arrow className="fill-surface" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
    </aside>
  );
}
