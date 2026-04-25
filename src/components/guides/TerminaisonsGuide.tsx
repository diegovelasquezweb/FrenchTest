"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { ChevronDown } from "lucide-react";
import {
  TENSES,
  TENSE_GROUPS,
  VERB_MODELS,
  type Conjugation,
  type TenseGroup,
  type TenseMeta,
  type VerbModel,
} from "../../data/verbConjugations";

interface ComparisonBlock {
  title: string;
  points: string[];
}

const QUICK_COMPARISONS: ComparisonBlock[] = [
  {
    title: "Imparfait vs Passé composé",
    points: [
      "Imparfait = contexte, description ou habitude dans le passé.",
      "Passé composé = action ponctuelle/terminée dans le passé.",
      "Exemple : Il pleuvait quand j'ai raté le bus.",
    ],
  },
  {
    title: "Passé composé vs Plus-que-parfait",
    points: [
      "Passé composé = action passée principale.",
      "Plus-que-parfait = action qui s'est produite avant une autre action passée.",
      "Exemple : J'avais mangé avant de sortir.",
    ],
  },
  {
    title: "Passé composé vs Passé récent",
    points: [
      "Passé composé = action terminée à n'importe quel moment du passé.",
      "Passé récent = action qui vient juste de se terminer (il y a quelques secondes/minutes).",
      "Exemple : J'ai mangé à midi / Je viens de manger.",
    ],
  },
  {
    title: "Futur simple vs Futur proche",
    points: [
      "Futur simple = projet, promesse ou action lointaine/abstraite.",
      "Futur proche = action imminente ou planifiée à court terme.",
      "Exemple : Je partirai en vacances en juillet / Je vais partir dans cinq minutes.",
    ],
  },
  {
    title: "Conditionnel présent vs Conditionnel passé",
    points: [
      "Conditionnel présent = hypothèse, demande polie ou conseil au présent.",
      "Conditionnel passé = regret, reproche ou action irréalisée dans le passé.",
      "Exemple : J'aimerais venir / J'aurais aimé venir.",
    ],
  },
  {
    title: "Indicatif présent vs Présent progressif",
    points: [
      "Indicatif présent = habitude, fait général ou action actuelle.",
      "Présent progressif (être en train de) = insiste sur une action en cours maintenant.",
      "Exemple : Je travaille à Paris / Je suis en train de travailler, rappelle plus tard.",
    ],
  },
  {
    title: "Subjonctif présent vs Indicatif présent",
    points: [
      "Indicatif = fait, certitude (« je sais que tu viens »).",
      "Subjonctif = nécessité, doute, émotion (« il faut que tu viennes »).",
      "Déclencheur fréquent : il faut que, je veux que, bien que, pour que.",
    ],
  },
];

function ConjugationRenderer({ conjugation }: { conjugation: Conjugation }) {
  if (conjugation.kind === "full") {
    const rows: { label: string; value: string }[] = [
      { label: "je", value: conjugation.je },
      { label: "tu", value: conjugation.tu },
      { label: "il / elle", value: conjugation.il },
      { label: "nous", value: conjugation.nous },
      { label: "vous", value: conjugation.vous },
      { label: "ils / elles", value: conjugation.ils },
    ];
    return (
      <div className="space-y-2">
        {conjugation.template && (
          <div className="rounded border border-ink/8 bg-ink/3 px-3 py-2">
            <p className="text-xs font-semibold text-muted">Structure</p>
            <p className="text-sm font-semibold text-brand" lang="fr">
              {conjugation.template}
            </p>
          </div>
        )}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div key={row.label} className="rounded border border-ink/8 px-3 py-2">
              <p className="text-xs font-semibold text-muted">{row.label}</p>
              <p className="text-sm text-ink" lang="fr">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (conjugation.kind === "imperative") {
    const rows = [
      { label: "(tu)", value: conjugation.tu },
      { label: "(nous)", value: conjugation.nous },
      { label: "(vous)", value: conjugation.vous },
    ];
    return (
      <div className="grid gap-2 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded border border-ink/8 px-3 py-2">
            <p className="text-xs font-semibold text-muted">{row.label}</p>
            <p className="text-sm text-ink" lang="fr">
              {row.value}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded border border-ink/8 px-3 py-2">
        <p className="text-xs font-semibold text-muted">Forme</p>
        <p className="text-sm font-semibold text-brand" lang="fr">
          {conjugation.form}
        </p>
      </div>
      <div className="rounded border border-ink/8 px-3 py-2">
        <p className="text-xs font-semibold text-muted">Exemple</p>
        <p className="text-sm text-ink" lang="fr">
          {conjugation.exampleSentence}
        </p>
      </div>
    </div>
  );
}

function TenseAccordionItem({ tense, verb }: { tense: TenseMeta; verb: VerbModel }) {
  const conjugation = verb.conjugations[tense.id];
  return (
    <Accordion.Item value={tense.id} className="border-t border-ink/8 first:border-t-0">
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-ink">{tense.label}</span>
            {tense.note && <span className="text-xs text-muted">{tense.note}</span>}
          </div>
          <ChevronDown
            size={16}
            className="shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden">
        <div className="space-y-3 px-5 pb-5">
          <p className="text-sm text-ink">{tense.usage}</p>

          <div className="rounded border border-ink/8 bg-ink/3 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Usage quotidien
            </p>
            <ul className="mt-1 space-y-1">
              {tense.dailyExamples.map((example) => (
                <li key={example} className="text-sm text-ink" lang="fr">
                  • {example}
                </li>
              ))}
            </ul>
          </div>

          <ConjugationRenderer conjugation={conjugation} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

function TenseGroupPanel({ group, verb }: { group: TenseGroup; verb: VerbModel }) {
  const tenses = TENSES.filter((t) => t.group === group);
  return (
    <Accordion.Root
      type="single"
      collapsible
      className="rounded-card overflow-hidden border border-ink/10 bg-surface shadow-sm"
    >
      {tenses.map((tense) => (
        <TenseAccordionItem key={tense.id} tense={tense} verb={verb} />
      ))}
    </Accordion.Root>
  );
}

export function TerminaisonsGuide() {
  const [verbId, setVerbId] = useState<string>(VERB_MODELS[0].id);
  const verb = VERB_MODELS.find((v) => v.id === verbId) ?? VERB_MODELS[0];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6">
      <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Verbe modèle
        </p>
        <ToggleGroup.Root
          type="single"
          value={verb.id}
          onValueChange={(value) => {
            if (value) setVerbId(value);
          }}
          className="mt-2 -mx-1 flex flex-wrap gap-2 overflow-x-auto px-1"
          aria-label="Choisir un verbe modèle"
        >
          {VERB_MODELS.map((v) => (
            <ToggleGroup.Item
              key={v.id}
              value={v.id}
              className="rounded-button cursor-pointer whitespace-nowrap border border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 data-[state=on]:border-brand data-[state=on]:bg-brand data-[state=on]:text-white"
            >
              {v.infinitive}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
        <p className="mt-2 text-xs text-muted" lang="es">
          {verb.translationEs} · auxiliaire :{" "}
          <span className="font-semibold text-ink" lang="fr">
            {verb.auxiliary}
          </span>
        </p>
      </section>

      <Tabs.Root defaultValue="passe" className="space-y-4">
        <Tabs.List
          className="flex gap-1 rounded-card border border-ink/10 bg-surface p-1 shadow-sm"
          aria-label="Groupes temporels"
        >
          {TENSE_GROUPS.map((group) => (
            <Tabs.Trigger
              key={group.id}
              value={group.id}
              className="rounded-button flex-1 cursor-pointer px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink data-[state=active]:bg-brand data-[state=active]:text-white"
            >
              {group.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {TENSE_GROUPS.map((group) => (
          <Tabs.Content key={group.id} value={group.id} className="outline-none">
            <TenseGroupPanel group={group.id} verb={verb} />
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <section className="rounded-card overflow-hidden border border-ink/10 bg-surface shadow-sm">
        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="comparaisons">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left">
                <span className="text-sm font-bold text-ink">Comparaisons rapides</span>
                <ChevronDown
                  size={16}
                  className="shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden">
              <div className="grid gap-3 px-5 pb-5 md:grid-cols-2">
                {QUICK_COMPARISONS.map((block) => (
                  <article key={block.title} className="rounded border border-ink/8 px-3 py-2">
                    <h4 className="text-sm font-semibold text-brand">{block.title}</h4>
                    <ul className="mt-1 space-y-1">
                      {block.points.map((point) => (
                        <li key={point} className="text-sm text-ink">
                          • {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </section>
    </div>
  );
}
