import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

type Row = { subject: string; ending: string; example: string };

interface TenseBlock {
  title: string;
  note?: string;
  usage: string;
  dailyExamples: string[];
  rows: Row[];
}

interface ComparisonBlock {
  title: string;
  points: string[];
}

const TENSES: TenseBlock[] = [
  {
    title: "Présent (-er)",
    usage: "S'utilise pour les habitudes, les faits généraux et les actions actuelles.",
    dailyExamples: [
      "Je prends le métro tous les matins.",
      "Nous travaillons à distance aujourd'hui.",
      "Ils dînent à 20 h.",
    ],
    rows: [
      { subject: "je", ending: "-e", example: "je parle" },
      { subject: "tu", ending: "-es", example: "tu parles" },
      { subject: "il / elle", ending: "-e", example: "il parle" },
      { subject: "nous", ending: "-ons", example: "nous parlons" },
      { subject: "vous", ending: "-ez", example: "vous parlez" },
      { subject: "ils / elles", ending: "-ent", example: "ils parlent" },
    ],
  },
  {
    title: "Imparfait",
    usage: "S'utilise pour les descriptions dans le passé, le contexte et les habitudes passées.",
    dailyExamples: [
      "Quand j'étais enfant, je jouais au parc.",
      "Il pleuvait, alors on restait à la maison.",
      "Tous les soirs, nous regardions un film.",
    ],
    rows: [
      { subject: "je", ending: "-ais", example: "je parlais" },
      { subject: "tu", ending: "-ais", example: "tu parlais" },
      { subject: "il / elle", ending: "-ait", example: "elle parlait" },
      { subject: "nous", ending: "-ions", example: "nous parlions" },
      { subject: "vous", ending: "-iez", example: "vous parliez" },
      { subject: "ils / elles", ending: "-aient", example: "ils parlaient" },
    ],
  },
  {
    title: "Futur simple",
    usage: "S'utilise pour les actions futures, les plans et les promesses.",
    dailyExamples: [
      "Je t'appellerai ce soir.",
      "Nous finirons ce projet demain.",
      "Ils arriveront vers 19 h.",
    ],
    rows: [
      { subject: "je", ending: "-ai", example: "je parlerai" },
      { subject: "tu", ending: "-as", example: "tu parleras" },
      { subject: "il / elle", ending: "-a", example: "il parlera" },
      { subject: "nous", ending: "-ons", example: "nous parlerons" },
      { subject: "vous", ending: "-ez", example: "vous parlerez" },
      { subject: "ils / elles", ending: "-ont", example: "elles parleront" },
    ],
  },
  {
    title: "Conditionnel présent",
    usage: "S'utilise pour demander poliment, donner un conseil ou exprimer une hypothèse.",
    dailyExamples: [
      "Je voudrais un café, s'il vous plaît.",
      "Tu devrais te reposer un peu.",
      "On pourrait sortir ce week-end.",
    ],
    rows: [
      { subject: "je", ending: "-ais", example: "je parlerais" },
      { subject: "tu", ending: "-ais", example: "tu parlerais" },
      { subject: "il / elle", ending: "-ait", example: "elle parlerait" },
      { subject: "nous", ending: "-ions", example: "nous parlerions" },
      { subject: "vous", ending: "-iez", example: "vous parleriez" },
      { subject: "ils / elles", ending: "-aient", example: "ils parleraient" },
    ],
  },
  {
    title: "Subjonctif présent",
    note: "Schéma clé : il faut que + subjonctif",
    usage: "Règle pratique à mémoriser : après « il faut que », on utilise le subjonctif.",
    dailyExamples: [
      "Il faut que tu viennes à l'heure.",
      "Il faut que nous finissions avant midi.",
      "Il faut qu'ils soient prêts demain.",
    ],
    rows: [
      { subject: "que je", ending: "-e", example: "que je parle" },
      { subject: "que tu", ending: "-es", example: "que tu parles" },
      { subject: "qu'il / elle", ending: "-e", example: "qu'il parle" },
      { subject: "que nous", ending: "-ions", example: "que nous parlions" },
      { subject: "que vous", ending: "-iez", example: "que vous parliez" },
      { subject: "qu'ils / elles", ending: "-ent", example: "qu'elles parlent" },
    ],
  },
  {
    title: "Passé composé (avoir)",
    note: "Auxiliaire au présent + participe passé",
    usage: "S'utilise pour les actions terminées et ponctuelles dans le passé.",
    dailyExamples: [
      "J'ai fini mon travail à 18 h.",
      "Nous avons réservé une table.",
      "Elles ont regardé la série hier soir.",
    ],
    rows: [
      { subject: "je", ending: "ai + PP", example: "j'ai parlé" },
      { subject: "tu", ending: "as + PP", example: "tu as parlé" },
      { subject: "il / elle", ending: "a + PP", example: "elle a parlé" },
      { subject: "nous", ending: "avons + PP", example: "nous avons parlé" },
      { subject: "vous", ending: "avez + PP", example: "vous avez parlé" },
      { subject: "ils / elles", ending: "ont + PP", example: "ils ont parlé" },
    ],
  },
  {
    title: "Plus-que-parfait (avoir)",
    note: "Auxiliaire à l'imparfait + participe passé",
    usage: "S'utilise pour une action passée antérieure à une autre action passée.",
    dailyExamples: [
      "J'avais déjà mangé quand tu es arrivé.",
      "Nous avions préparé la réunion avant 9 h.",
      "Il avait oublié ses clés, donc il est rentré tard.",
    ],
    rows: [
      { subject: "je", ending: "avais + PP", example: "j'avais parlé" },
      { subject: "tu", ending: "avais + PP", example: "tu avais parlé" },
      { subject: "il / elle", ending: "avait + PP", example: "il avait parlé" },
      { subject: "nous", ending: "avions + PP", example: "nous avions parlé" },
      { subject: "vous", ending: "aviez + PP", example: "vous aviez parlé" },
      { subject: "ils / elles", ending: "avaient + PP", example: "elles avaient parlé" },
    ],
  },
];

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
];

export function TerminaisonsGuide() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <Accordion.Root type="single" collapsible className="rounded-(--radius-card) overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
        {TENSES.map((tense, i) => (
          <Accordion.Item
            key={tense.title}
            value={tense.title}
            className={i > 0 ? "border-t border-(--color-ink)/8" : ""}
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left">
                <div>
                  <span className="text-sm font-bold text-(--color-ink)">{tense.title}</span>
                  {tense.note && <span className="ml-2 text-xs text-(--color-muted)">{tense.note}</span>}
                </div>
                <ChevronDown size={16} className="shrink-0 text-(--color-muted) transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none">
              <div className="px-5 pb-5 space-y-3">
                <p className="text-sm text-(--color-ink)">{tense.usage}</p>

                <div className="rounded border border-(--color-ink)/8 bg-(--color-ink)/3 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-(--color-muted)">Usage quotidien</p>
                  <ul className="mt-1 space-y-1">
                    {tense.dailyExamples.map((example) => (
                      <li key={example} className="text-sm text-(--color-ink)" lang="fr">• {example}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {tense.rows.map((row) => (
                    <div key={row.subject} className="rounded border border-(--color-ink)/8 px-3 py-2">
                      <p className="text-xs font-semibold text-(--color-muted)">{row.subject}</p>
                      <p className="text-sm font-semibold text-(--color-brand)">{row.ending}</p>
                      <p className="text-sm text-(--color-ink)" lang="fr">{row.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}

        {/* Comparaisons rapides */}
        <Accordion.Item value="comparaisons" className="border-t border-(--color-ink)/8">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left">
              <span className="text-sm font-bold text-(--color-ink)">Comparaisons rapides</span>
              <ChevronDown size={16} className="shrink-0 text-(--color-muted) transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none">
            <div className="px-5 pb-5 grid gap-3 md:grid-cols-2">
              {QUICK_COMPARISONS.map((block) => (
                <article key={block.title} className="rounded border border-(--color-ink)/8 px-3 py-2">
                  <h4 className="text-sm font-semibold text-(--color-brand)">{block.title}</h4>
                  <ul className="mt-1 space-y-1">
                    {block.points.map((point) => (
                      <li key={point} className="text-sm text-(--color-ink)">• {point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
