type Row = { subject: string; ending: string; example: string };

interface TenseBlock {
  title: string;
  note?: string;
  rows: Row[];
}

const TENSES: TenseBlock[] = [
  {
    title: "Présent (-er)",
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

export function TerminaisonsGuide() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      {TENSES.map((tense) => (
        <section key={tense.title} className="rounded-(--radius-card) border border-(--color-ink)/8 bg-(--color-surface) p-4 shadow-sm">
          <h3 className="text-base font-bold text-(--color-ink)">{tense.title}</h3>
          {tense.note && <p className="mt-1 text-xs text-(--color-muted)">{tense.note}</p>}
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tense.rows.map((row) => (
              <div key={`${tense.title}-${row.subject}`} className="rounded border border-(--color-ink)/8 px-3 py-2">
                <p className="text-xs font-semibold text-(--color-muted)">{row.subject}</p>
                <p className="text-sm font-semibold text-(--color-brand)">{row.ending}</p>
                <p className="text-sm text-(--color-ink)" lang="fr">{row.example}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

