import {
  Gamepad2,
  Bookmark,
  FlaskConical,
  Columns3,
  PenSquare,
  Globe,
  Map as MapIcon,
  UtensilsCrossed,
  Bus,
  BedDouble,
  ShoppingBag,
  Siren,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: string; icon?: LucideIcon };

export type NavGroupSingle = {
  id: string;
  type: "single";
  label: string;
  href: string;
  icon: LucideIcon;
  /** Featured card style (Marathon). */
  marathon?: true;
  /** Hidden in mobile home, shown only in desktop sidebar. */
  sidebarOnly?: true;
};

export type NavGroupAccordion = {
  id: string;
  type: "accordion";
  label: string;
  items: NavItem[];
};

export type NavGroup = NavGroupSingle | NavGroupAccordion;

export const NAV_GROUPS: NavGroup[] = [
  { id: "marathon",      type: "single", label: "Marathon",               href: "/marathon",                  icon: Gamepad2,   marathon: true },
  { id: "difficiles",    type: "single", label: "Mes difficiles",         href: "/mes-difficiles",            icon: Bookmark },
  { id: "mes-patterns",  type: "single", label: "Mes modèles",           href: "/mes-patterns",              icon: Bookmark },
  { id: "mes-vocab",     type: "single", label: "Mon vocabulaire",        href: "/mon-vocabulaire",           icon: Bookmark },
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
      { label: "Développer ses idées", href: "/parcours/ecrit-developper" },
      { label: "Connecteurs", href: "/parcours/ecrit-connecteurs" },
      { label: "Test connecteurs", href: "/quiz/connecteurs", icon: FlaskConical },
      { label: "Test écrit",    href: "/quiz/ecrit",               icon: FlaskConical },
    ],
  },
  {
    id: "grammaire", type: "accordion", label: "Grammaire",
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
      { label: "Test grammaire",          href: "/quiz/grammaire",    icon: FlaskConical },
    ],
  },
  {
    id: "vocabulaire", type: "accordion", label: "Vocabulaire",
    items: [
      { label: "Verbes",            href: "/vocabulaire/verbes" },
      { label: "Adjectifs",         href: "/vocabulaire/adjectifs" },
      { label: "Noms",              href: "/vocabulaire/noms" },
      { label: "Expressions",       href: "/vocabulaire/expressions" },
      { label: "Genre",             href: "/vocabulaire/genre" },
      { label: "Erreurs",           href: "/vocabulaire/erreurs" },
      { label: "Accents",           href: "/vocabulaire/accents" },
      { label: "Mixte",             href: "/vocabulaire/mix" },
      { label: "Liste vocabulaire", href: "/vocabulaire/liste",    icon: SlidersHorizontal },
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
      { label: "Orientation", href: "/voyage/orientation", icon: MapIcon },
      { label: "Urgences",    href: "/voyage/urgences",    icon: Siren },
    ],
  },
  { id: "verbes",       type: "single", label: "Verbes essentiels",    href: "/guides/verbes-essentiels", icon: Columns3 },
  { id: "terminaisons", type: "single", label: "Terminaisons verbales", href: "/guides/terminaisons",     icon: PenSquare },
  { id: "traducteur",   type: "single", label: "Traducteur",            href: "/traducteur",               icon: Globe,     sidebarOnly: true },
];

export const NO_SEPARATOR_IDS = new Set(["difficiles", "mes-patterns", "mes-vocab", "terminaisons", "traducteur"]);

/** Flat label→href lookup built from all accordion items. Used for the favorites section. */
export const ITEM_HREF_LOOKUP: Record<string, string> = Object.fromEntries(
  NAV_GROUPS.flatMap(g => g.type === "accordion" ? g.items.map(i => [i.label, i.href]) : []),
);

/** Collapse "Test X" labels to just "Test" when inside their section group. */
export function displayLabel(label: string): string {
  return label.startsWith("Test ") ? "Test" : label;
}
