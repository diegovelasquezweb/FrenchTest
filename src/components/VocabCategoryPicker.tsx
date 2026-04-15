export type VocabCategory = "verbes" | "adjectifs" | "noms" | "expressions" | "genre" | "pièges" | "mix";

export interface VocabCategoryOption {
  id: VocabCategory;
  icon: string;
  label: string;
  totalCards: number;
  masteredCount: number;
  onClick(): void;
}

interface VocabCategoryPickerProps {
  options: VocabCategoryOption[];
}

export function VocabCategoryPicker({ options }: VocabCategoryPickerProps) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <p className="mb-4 text-center text-sm text-(--color-muted)">
        Choisissez un type de paires
      </p>
      <div className="grid grid-cols-2 gap-3">
        {options.map(({ id, icon, label, totalCards, masteredCount, onClick }) => (
          <button
            key={id}
            type="button"
            onClick={onClick}
            className={`group flex flex-col items-start gap-3 rounded bg-(--color-surface) p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring) ${id === "mix" ? "col-span-2" : ""}`}
          >
            <div className="flex w-full items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-base bg-(--color-ink)/5">
                {icon}
              </span>
              <span className="flex-1 text-left">
                <span className="block text-sm font-semibold text-(--color-ink)">{label}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-bold text-(--color-ink)">{masteredCount}</span>
                <span className="block text-xs text-(--color-muted)">/ {totalCards}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

