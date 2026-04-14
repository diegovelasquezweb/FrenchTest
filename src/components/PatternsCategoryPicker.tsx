export type PatternsCategory =
  | "all"
  | "connecteurs"
  | "oral-interaction"
  | "oral-monologue"
  | "ecrit-faits-divers"
  | "ecrit-argumentatif";

export interface CategoryOption {
  id: PatternsCategory;
  icon: string;
  label: string;
  sub: string;
  color: string;
  totalCards: number;
  masteredCount: number;
  onSelect(): void;
}

interface PatternsCategoryPickerProps {
  options: CategoryOption[];
}

export function PatternsCategoryPicker({ options }: PatternsCategoryPickerProps) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <p className="mb-4 text-center text-sm text-(--color-muted)">
        Choisissez une catégorie à pratiquer
      </p>
      <div className="grid grid-cols-2 gap-3">
        {options.map(({ id, icon, label, sub, color, totalCards, masteredCount, onSelect }) => (
          <button
            key={id}
            type="button"
            onClick={onSelect}
            className={`group flex flex-col items-start gap-3 rounded bg-(--color-surface) p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring) ${id === "all" ? "col-span-2" : ""}`}
          >
            <div className="flex w-full items-center gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded text-base ${color}`}>
                {icon}
              </span>
              <span className="flex-1 text-left">
                <span className="block text-sm font-semibold text-(--color-ink)">{label}</span>
                <span className="block text-xs text-(--color-muted) leading-snug">{sub}</span>
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
