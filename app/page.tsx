"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gamepad2 } from "lucide-react";

const MOBILE_SECTIONS = [
  {
    id: "marathon",
    label: "Marathon",
    href: "/marathon",
    icon: Gamepad2,
    featured: true,
  },
  {
    id: "oral",
    label: "Oral",
    items: [
      { label: "Renseignements",   href: "/parcours/oral-interaction" },
      { label: "Persuasion",       href: "/parcours/oral-monologue" },
      { label: "Test oral",        href: "/quiz/oral" },
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
      { label: "Test grammaire",         href: "/quiz/grammaire" },
    ],
  },
  {
    id: "vocabulaire",
    label: "Vocabulaire",
    items: [
      { label: "Verbes",            href: "/vocabulaire/verbes" },
      { label: "Adjectifs",         href: "/vocabulaire/adjectifs" },
      { label: "Noms",              href: "/vocabulaire/noms" },
      { label: "Expressions",       href: "/vocabulaire/expressions" },
      { label: "Genre",             href: "/vocabulaire/genre" },
      { label: "Erreurs",           href: "/vocabulaire/erreurs" },
      { label: "Accents",           href: "/vocabulaire/accents" },
      { label: "Mixte",             href: "/vocabulaire/mix" },
      { label: "Liste vocabulaire", href: "/vocabulaire/liste" },
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
  {
    id: "guides",
    label: "Guides",
    items: [
      { label: "Verbes essentiels",    href: "/guides/verbes-essentiels" },
      { label: "Terminaisons verbales", href: "/guides/terminaisons" },
    ],
  },
  {
    id: "outils",
    label: "Outils",
    items: [
      { label: "Traducteur", href: "/traducteur" },
      { label: "Mes notes",  href: "/mes-notes" },
    ],
  },
] as const;

export default function HomePage() {
  const router = useRouter();

  // On desktop, redirect directly to Marathon.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) {
      void router.replace("/marathon");
    }
  }, [router]);

  return (
    <div className="md:hidden flex flex-col gap-4 px-4 py-6">
      <div className="flex flex-col gap-1 text-center mb-2">
        <p className="text-base font-semibold text-(--color-ink)">Prêt à pratiquer ?</p>
        <p className="text-sm text-(--color-muted)">Choisissez un exercice ci-dessous.</p>
      </div>

      {MOBILE_SECTIONS.map((section) => {
        if ("featured" in section && section.featured) {
          return (
            <div
              key={section.id}
              className="w-full rounded overflow-hidden border border-(--color-brand)/25 bg-(--color-brand)/6 shadow-sm"
            >
              <Link
                href={section.href}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/12 hover:text-(--color-brand)"
              >
                <Gamepad2 size={16} className="shrink-0" />
                {section.label}
              </Link>
            </div>
          );
        }

        if ("items" in section) {
          return (
            <div
              key={section.id}
              className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm"
            >
              <div className="px-4 py-2.5 border-b border-(--color-ink)/8">
                <span className="text-[11px] font-bold uppercase tracking-widest text-(--color-muted)">
                  {section.label}
                </span>
              </div>
              {section.items.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) ${
                    i > 0 ? "border-t border-(--color-ink)/8" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
