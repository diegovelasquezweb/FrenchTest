import * as Accordion from "@radix-ui/react-accordion";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronDown } from "lucide-react";
import {
  TENSES,
  TENSE_GROUPS,
  VERB_MODELS,
  type Conjugation,
  type TenseMeta,
  type VerbModel,
} from "../../data/verbConjugations";

function ConjugationBlock({ tense, conjugation }: { tense: TenseMeta; conjugation: Conjugation }) {
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
      <div className="rounded border border-ink/10 p-3">
        <p className="text-sm font-semibold text-ink">{tense.label}</p>
        {tense.note && <p className="text-[11px] text-muted">{tense.note}</p>}
        {conjugation.template && (
          <p className="mt-1 text-[11px] font-semibold text-brand" lang="fr">
            {conjugation.template}
          </p>
        )}
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline gap-1">
              <span className="text-muted">{row.label}</span>
              <span className="font-medium text-ink" lang="fr">
                {row.value}
              </span>
            </div>
          ))}
        </div>
        {tense.dailyExamples[0] && (
          <p className="mt-2 text-xs text-muted" lang="fr">
            {tense.dailyExamples[0]}
          </p>
        )}
      </div>
    );
  }

  if (conjugation.kind === "imperative") {
    return (
      <div className="rounded border border-ink/10 p-3">
        <p className="text-sm font-semibold text-ink">{tense.label}</p>
        {tense.note && <p className="text-[11px] text-muted">{tense.note}</p>}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span>
            <span className="text-muted">tu </span>
            <span className="font-medium text-ink" lang="fr">
              {conjugation.tu}
            </span>
          </span>
          <span>
            <span className="text-muted">nous </span>
            <span className="font-medium text-ink" lang="fr">
              {conjugation.nous}
            </span>
          </span>
          <span>
            <span className="text-muted">vous </span>
            <span className="font-medium text-ink" lang="fr">
              {conjugation.vous}
            </span>
          </span>
        </div>
        {tense.dailyExamples[0] && (
          <p className="mt-2 text-xs text-muted" lang="fr">
            {tense.dailyExamples[0]}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded border border-ink/10 p-3">
      <p className="text-sm font-semibold text-ink">{tense.label}</p>
      {tense.note && <p className="text-[11px] text-muted">{tense.note}</p>}
      <p className="mt-2 text-sm font-semibold text-brand" lang="fr">
        {conjugation.form}
      </p>
      <p className="mt-1 text-xs text-muted" lang="fr">
        {conjugation.exampleSentence}
      </p>
    </div>
  );
}

function VerbAccordionItem({ verb, isFirst }: { verb: VerbModel; isFirst: boolean }) {
  return (
    <Accordion.Item
      value={verb.id}
      className={isFirst ? "" : "border-t border-ink/8"}
    >
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left">
          <div>
            <span className="text-base font-bold text-ink" lang="fr">
              {verb.infinitive}
            </span>
            <span className="ml-2 text-xs text-muted">
              {verb.translationEs} · auxiliaire :{" "}
              <span lang="fr">{verb.auxiliary}</span>
            </span>
          </div>
          <ChevronDown
            size={16}
            className="shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden">
        <div className="px-5 pb-5">
          <Tabs.Root defaultValue="present" className="space-y-4">
            <Tabs.List
              className="flex gap-1 rounded-card border border-ink/10 bg-bg p-1"
              aria-label={`Groupes temporels — ${verb.infinitive}`}
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
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {TENSES.filter((t) => t.group === group.id).map((tense) => (
                    <ConjugationBlock
                      key={tense.id}
                      tense={tense}
                      conjugation={verb.conjugations[tense.id]}
                    />
                  ))}
                </div>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export function EssentialVerbsGuide() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <Accordion.Root
        type="single"
        collapsible
        className="rounded-card overflow-hidden border border-ink/10 bg-surface shadow-sm"
      >
        {VERB_MODELS.map((verb, i) => (
          <VerbAccordionItem key={verb.id} verb={verb} isFirst={i === 0} />
        ))}
      </Accordion.Root>
    </div>
  );
}
