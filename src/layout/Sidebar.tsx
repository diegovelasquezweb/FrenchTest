"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import {
  Gamepad2,
  Bookmark,
  BookCheck,
  FlaskConical,
  Columns3,
  PenSquare,
  Globe,
  Map,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  UtensilsCrossed,
  Bus,
  BedDouble,
  ShoppingBag,
  Siren,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { useAuth } from "@/src/lib/auth-context";
import { useTheme } from "@/src/hooks/useTheme";
import { logout } from "@/src/lib/auth";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { useFavoriteCards } from "@/src/hooks/useFavoriteCards";

type NavItem = { label: string; href: string; icon?: LucideIcon };

type NavGroupSingle = {
  id: string;
  type: "single";
  label: string;
  href: string;
  icon: LucideIcon;
  marathon?: true;
};

type NavGroupAccordion = {
  id: string;
  type: "accordion";
  label: string;
  items: NavItem[];
};

type NavGroup = NavGroupSingle | NavGroupAccordion;

const NAV_GROUPS: NavGroup[] = [
  { id: "marathon",     type: "single", label: "Marathon",              href: "/marathon",                  icon: Gamepad2,          marathon: true },
  { id: "difficiles",   type: "single", label: "Mes difficiles",        href: "/mes-difficiles",            icon: Bookmark },
  { id: "mes-patterns", type: "single", label: "Mes patterns",          href: "/mes-patterns",              icon: Bookmark },
  { id: "mes-vocab",    type: "single", label: "Mon vocabulaire",       href: "/mon-vocabulaire",           icon: Bookmark },
  {
    id: "oral", type: "accordion", label: "Oral",
    items: [
      { label: "Renseignements", href: "/parcours/oral-interaction" },
      { label: "Persuasion",     href: "/parcours/oral-monologue" },
      { label: "Test oral",      href: "/quiz/oral",               icon: FlaskConical },
    ],
  },
  {
    id: "ecrit", type: "accordion", label: "Écrit",
    items: [
      { label: "Faits divers",  href: "/parcours/ecrit-faits-divers" },
      { label: "Argumentatif",  href: "/parcours/ecrit-argumentatif" },
      { label: "Test écrit",    href: "/quiz/ecrit",               icon: FlaskConical },
    ],
  },
  {
    id: "grammaire", type: "accordion", label: "Grammaire",
    items: [
      { label: "Participe passé",        href: "/quiz/participe" },
      { label: "Imparfait",              href: "/quiz/imparfait" },
      { label: "Présent",                href: "/quiz/present" },
      { label: "Subjonctif",             href: "/quiz/subjonctif" },
      { label: "Plus-que-parfait",       href: "/quiz/plus-que-parfait" },
      { label: "Articles & contractions", href: "/quiz/articles" },
      { label: "Orthographe",            href: "/quiz/orthographe" },
      { label: "Futur simple",           href: "/quiz/futur" },
      { label: "Conditionnel",           href: "/quiz/conditionnel" },
      { label: "Pronominales",           href: "/quiz/pronominales" },
      { label: "Test grammaire",         href: "/quiz/grammaire",    icon: FlaskConical },
    ],
  },
  {
    id: "vocabulaire", type: "accordion", label: "Vocabulaire",
    items: [
      { label: "Verbes",          href: "/vocabulaire/verbes" },
      { label: "Adjectifs",       href: "/vocabulaire/adjectifs" },
      { label: "Noms",            href: "/vocabulaire/noms" },
      { label: "Expressions",     href: "/vocabulaire/expressions" },
      { label: "Genre",           href: "/vocabulaire/genre" },
      { label: "Erreurs",         href: "/vocabulaire/erreurs" },
      { label: "Accents",         href: "/vocabulaire/accents" },
      { label: "Mixte",           href: "/vocabulaire/mix" },
      { label: "Liste vocabulaire", href: "/vocabulaire/liste",    icon: SlidersHorizontal },
    ],
  },
  {
    id: "connecteurs", type: "accordion", label: "Connecteurs",
    items: [
      { label: "Connecteurs",      href: "/parcours/connecteurs" },
      { label: "Test connecteurs", href: "/quiz/connecteurs",     icon: FlaskConical },
    ],
  },
  {
    id: "etre-avoir", type: "accordion", label: "MRS VANDERTRAMP",
    items: [
      { label: "Être / avoir",      href: "/parcours/etre-avoir" },
      { label: "Test être / avoir", href: "/quiz/etre-avoir",      icon: FlaskConical },
      { label: "Liste des verbes",  href: "/guides/etre-avoir",    icon: Columns3 },
    ],
  },
  {
    id: "voyage", type: "accordion", label: "Voyage",
    items: [
      { label: "Restaurant",  href: "/voyage/restaurant",  icon: UtensilsCrossed },
      { label: "Transport",   href: "/voyage/transport",   icon: Bus },
      { label: "Hébergement", href: "/voyage/hebergement", icon: BedDouble },
      { label: "Shopping",    href: "/voyage/shopping",    icon: ShoppingBag },
      { label: "Orientation", href: "/voyage/orientation", icon: Map },
      { label: "Urgences",    href: "/voyage/urgences",    icon: Siren },
    ],
  },
  { id: "verbes",      type: "single", label: "Verbes essentiels",    href: "/guides/verbes-essentiels", icon: Columns3 },
  { id: "terminaisons", type: "single", label: "Terminaisons verbales", href: "/guides/terminaisons",  icon: PenSquare },
  { id: "traducteur",  type: "single", label: "Traducteur",            href: "/traducteur",               icon: Globe },
];

const NO_SEPARATOR_IDS = new Set(["difficiles", "mes-patterns", "mes-vocab", "terminaisons", "traducteur"]);

interface SidebarProps {
  onOpenAiChat?: () => void;
}

export function Sidebar({ onOpenAiChat }: SidebarProps) {
  const pathname = usePathname();
  const { session, status } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const { weakVerbList } = useWeakVerbs();
  const { favoriteCardList, favoriteVocabList } = useFavoriteCards();

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
      next.has(id) ? next.delete(id) : next.add(id);
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
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-(--color-ink)/8 bg-(--color-surface)">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-(--color-ink)/8">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-(--color-ink) hover:text-(--color-brand) transition-colors duration-150"
        >
          🇨🇦 TEF Pratiquer
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1" aria-label="Navigation">
        {NAV_GROUPS.map((group, idx) => {
          const isFirst = idx === 0;
          const noSep = isFirst || NO_SEPARATOR_IDS.has(group.id);
          const sepClass = noSep ? "" : "pt-2 border-t border-(--color-ink)/16";

          if (group.type === "single") {
            // Hide data-dependent items when empty (matches original behavior).
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
                      ? "bg-(--color-brand)/14 text-(--color-brand)"
                      : isMarathon
                        ? "text-(--color-ink) bg-(--color-brand)/6 border border-(--color-brand)/20 hover:bg-(--color-brand)/10"
                        : "text-(--color-ink) hover:bg-(--color-ink)/6"
                  }`}
                >
                  <group.icon size={16} className="shrink-0" />
                  <span className="flex-1">{group.label}</span>
                  {badge > 0 && (
                    <span className="text-[10px] font-bold text-(--color-muted)">{badge}</span>
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors duration-150 hover:bg-(--color-ink)/5 ${
                  hasActive && !isOpen ? "text-(--color-brand)" : ""
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-(--color-ink)">
                  {group.label}
                </span>
                {isOpen ? (
                  <ChevronDown size={16} className="text-(--color-ink)" />
                ) : (
                  <ChevronRight size={16} className="text-(--color-ink)" />
                )}
              </button>

              {isOpen && (
                <div className="mt-0.5 mb-2 flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon ?? BookCheck;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors duration-150 ${
                          isActive
                            ? "bg-(--color-brand)/10 text-(--color-brand)"
                            : "text-(--color-ink) hover:bg-(--color-ink)/6"
                        }`}
                      >
                        <Icon size={14} className="shrink-0" />
                        {item.label}
                      </Link>
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
        <div className="px-4 py-2 border-t border-(--color-ink)/8">
          <button
            type="button"
            onClick={onOpenAiChat}
            className="w-full flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium text-(--color-muted) transition-colors duration-150 hover:bg-(--color-ink)/6 hover:text-(--color-ink)"
          >
            <MessageCircle size={15} className="shrink-0" />
            Demander à l&apos;IA
          </button>
        </div>
      )}

      {/* User footer */}
      <div className="border-t border-(--color-ink)/8 flex items-center justify-between px-4 py-3">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-(--color-ink)/5 transition-colors duration-150"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-brand)/15 text-xs font-bold text-(--color-brand)">
                {initial}
              </span>
              <span className="text-xs font-medium text-(--color-ink) max-w-24 truncate">{login}</span>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              align="start"
              sideOffset={8}
              className="z-50 min-w-36 rounded-(--radius-card) border border-(--color-ink)/8 bg-(--color-surface) py-1 shadow-lg"
            >
              {status === "authed" && (
                <Link
                  href="/mes-notes"
                  className="block w-full px-3 py-2 text-left text-sm text-(--color-ink) hover:bg-(--color-ink)/5 transition-colors duration-150"
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
              <Popover.Arrow className="fill-(--color-surface)" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
    </aside>
  );
}
