"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, BookOpen, Headphones, PenSquare, Mic } from "lucide-react";
import {
  TEF_TESTS,
  CLB_THRESHOLDS,
  GENERAL_FACTS,
  GENERAL_TIPS,
  type TefTest,
  type TefTestId,
} from "../../data/tefInfo";

const ICONS: Record<TefTestId, typeof BookOpen> = {
  ce: BookOpen,
  co: Headphones,
  ee: PenSquare,
  eo: Mic,
};

function TestPanel({ test }: { test: TefTest }) {
  return (
    <div className="space-y-4">
      <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <h3 className="text-sm font-bold text-ink">{test.fullLabel}</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded border border-ink/8 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Durée</p>
            <p className="text-sm text-ink">{test.duration}</p>
          </div>
          {test.questions && (
            <div className="rounded border border-ink/8 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Questions</p>
              <p className="text-sm text-ink">{test.questions}</p>
            </div>
          )}
          <div className="rounded border border-ink/8 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Score</p>
            <p className="text-sm text-ink">{test.scoreMax}</p>
          </div>
          <div className="rounded border border-ink/8 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Format</p>
            <p className="text-sm text-ink">{test.format}</p>
          </div>
        </div>
      </section>

      {test.sections && (
        <section className="rounded-card overflow-hidden border border-ink/10 bg-surface shadow-sm">
          {test.sections.map((section, idx) => (
            <div
              key={section.label}
              className={idx > 0 ? "border-t border-ink/8 px-4 py-4" : "px-4 py-4"}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-sm font-bold text-brand">{section.label}</h4>
                <span className="shrink-0 text-xs font-semibold text-muted">{section.duration}</span>
              </div>
              <p className="mt-1 text-sm text-ink" lang="fr">
                {section.task}
              </p>
              {section.details && (
                <ul className="mt-2 space-y-1">
                  {section.details.map((detail) => (
                    <li key={detail} className="text-sm text-ink" lang="fr">
                      • {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted">Conseils</h4>
        <ul className="mt-2 space-y-1.5">
          {test.tips.map((tip) => (
            <li key={tip} className="text-sm text-ink" lang="fr">
              • {tip}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function CommentFonctionneTefGuide() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6">
      <header className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <h1 className="text-lg font-bold text-ink">Comment fonctionne le TEF Canada</h1>
        <p className="mt-1 text-sm text-muted" lang="fr">
          Structure officielle des 4 épreuves, barème et conseils pratiques (édition 2026).
        </p>
      </header>

      <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <h2 className="text-sm font-bold text-ink">L&apos;essentiel</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {GENERAL_FACTS.map((fact) => (
            <div key={fact.label} className="rounded border border-ink/8 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{fact.label}</p>
              <p className="text-sm text-ink" lang="fr">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Tabs.Root defaultValue="ce" className="space-y-4">
        <Tabs.List
          className="flex gap-1 overflow-x-auto rounded-card border border-ink/10 bg-surface p-1 shadow-sm"
          aria-label="Épreuves du TEF Canada"
        >
          {TEF_TESTS.map((test) => {
            const Icon = ICONS[test.id];
            return (
              <Tabs.Trigger
                key={test.id}
                value={test.id}
                className="rounded-button flex flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap px-2 py-2 text-xs font-semibold text-muted transition-colors hover:text-ink data-[state=active]:bg-brand data-[state=active]:text-white sm:text-sm"
              >
                <Icon size={14} className="shrink-0" />
                <span className="hidden sm:inline">{test.shortLabel}</span>
                <span className="sm:hidden">{test.id.toUpperCase()}</span>
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {TEF_TESTS.map((test) => (
          <Tabs.Content key={test.id} value={test.id} className="outline-none">
            <TestPanel test={test} />
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <section className="rounded-card overflow-hidden border border-ink/10 bg-surface shadow-sm">
        <Accordion.Root type="single" collapsible defaultValue="bareme">
          <Accordion.Item value="bareme">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left">
                <span className="text-sm font-bold text-ink">Barème NCLC / CLB</span>
                <ChevronDown
                  size={16}
                  className="shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden">
              <div className="px-5 pb-5">
                <div className="overflow-x-auto rounded border border-ink/8">
                  <table className="w-full text-sm">
                    <thead className="bg-ink/3 text-muted">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                          Niveau
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">CE</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">CO</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">EE</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">EO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CLB_THRESHOLDS.map((row) => (
                        <tr key={row.level} className="border-t border-ink/8">
                          <td className="px-3 py-2 font-semibold text-ink">{row.level}</td>
                          <td className="px-3 py-2 text-ink">{row.ce}</td>
                          <td className="px-3 py-2 text-ink">{row.co}</td>
                          <td className="px-3 py-2 text-ink">{row.ee}</td>
                          <td className="px-3 py-2 text-ink">{row.eo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ul className="mt-3 space-y-1">
                  {CLB_THRESHOLDS.map((row) => (
                    <li key={row.level} className="text-xs text-muted" lang="fr">
                      <span className="font-semibold text-ink">{row.level} :</span> {row.usage}
                    </li>
                  ))}
                </ul>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </section>

      <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <h2 className="text-sm font-bold text-ink">À retenir</h2>
        <ul className="mt-2 space-y-1.5">
          {GENERAL_TIPS.map((tip) => (
            <li key={tip} className="text-sm text-ink" lang="fr">
              • {tip}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-muted" lang="fr">
        Source : Le Français des Affaires (CCI Paris Île-de-France) — données officielles 2026.
      </p>
    </div>
  );
}
