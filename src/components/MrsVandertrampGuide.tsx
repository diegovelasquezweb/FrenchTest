const VERBS: { letter: string; verb: string; participle: string; note?: string }[] = [
  { letter: "M", verb: "Monter",    participle: "monté",    note: "avoir si COD direct" },
  { letter: "R", verb: "Rester",    participle: "resté" },
  { letter: "S", verb: "Sortir",    participle: "sorti",    note: "avoir si COD direct" },
  { letter: "V", verb: "Venir",     participle: "venu",     note: "+ devenir, revenir, parvenir…" },
  { letter: "A", verb: "Aller",     participle: "allé" },
  { letter: "N", verb: "Naître",    participle: "né" },
  { letter: "D", verb: "Descendre", participle: "descendu", note: "avoir si COD direct" },
  { letter: "E", verb: "Entrer",    participle: "entré",    note: "+ rentrer" },
  { letter: "R", verb: "Retourner", participle: "retourné" },
  { letter: "T", verb: "Tomber",    participle: "tombé" },
  { letter: "R", verb: "Rentrer",   participle: "rentré" },
  { letter: "A", verb: "Arriver",   participle: "arrivé" },
  { letter: "M", verb: "Mourir",    participle: "mort" },
  { letter: "P", verb: "Partir",    participle: "parti",    note: "+ repartir" },
];

export function MrsVandertrampGuide() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6">
      <ol className="flex flex-col gap-1.5">
        {VERBS.map(({ letter, verb, participle, note }, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-(--radius-button) bg-(--color-surface) px-4 py-3 shadow-sm"
          >
            <span className="w-5 shrink-0 text-center text-base font-extrabold text-(--color-brand)">
              {letter}
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-sm font-bold text-(--color-ink)" lang="fr">{verb}</span>
              {note && (
                <span className="ml-2 text-[10px] font-medium text-(--color-muted)">{note}</span>
              )}
            </span>
            <span className="shrink-0 text-xs font-semibold text-teal-600 dark:text-teal-400" lang="fr">
              {participle}(e)
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-(--radius-card) border border-(--color-ink)/8 bg-(--color-surface) px-4 py-3 shadow-sm">
        <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-widest mb-2">Accord du participe</p>
        <div className="flex flex-col gap-1 text-sm" lang="fr">
          <p><span className="font-semibold text-(--color-ink)">Il</span> est allé · <span className="font-semibold text-(--color-ink)">Elle</span> est allé<span className="text-teal-600 dark:text-teal-400 font-bold">e</span></p>
          <p><span className="font-semibold text-(--color-ink)">Ils</span> sont allé<span className="text-teal-600 dark:text-teal-400 font-bold">s</span> · <span className="font-semibold text-(--color-ink)">Elles</span> sont allé<span className="text-teal-600 dark:text-teal-400 font-bold">es</span></p>
        </div>
      </div>
    </div>
  );
}
