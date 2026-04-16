export type MarathonCategoryId =
  | "oral-interaction" | "oral-monologue" | "ecrit-faits-divers" | "connecteurs" | "argumentation" | "mrs-vandertramp"
  | "vocab-verbes" | "vocab-adjectifs" | "vocab-noms" | "vocab-expressions" | "vocab-genre" | "vocab-erreurs" | "vocab-accents"
  | "voyage-restaurant" | "voyage-transport" | "voyage-hebergement" | "voyage-shopping" | "voyage-orientation" | "voyage-urgences";

export type MarathonGroupId = "patterns" | "vocabulaire" | "voyage";

export interface MarathonCategoryOption {
  id: MarathonCategoryId;
  label: string;
  count: number;
}

export interface MarathonGroup {
  id: MarathonGroupId;
  label: string;
  options: MarathonCategoryOption[];
}

export const ALL_MARATHON_CATEGORY_IDS: MarathonCategoryId[] = [
  "oral-interaction", "oral-monologue", "ecrit-faits-divers", "connecteurs", "argumentation", "mrs-vandertramp",
  "vocab-verbes", "vocab-adjectifs", "vocab-noms", "vocab-expressions", "vocab-genre", "vocab-erreurs", "vocab-accents",
  "voyage-restaurant", "voyage-transport", "voyage-hebergement", "voyage-shopping", "voyage-orientation", "voyage-urgences",
];

interface MarathonCategoryPickerProps {
  groups: MarathonGroup[];
  selectedCategories: Set<MarathonCategoryId>;
  onToggle(id: MarathonCategoryId): void;
  onToggleGroup(groupId: MarathonGroupId, ids: MarathonCategoryId[]): void;
}

export function MarathonCategoryPicker({
  groups,
  selectedCategories,
  onToggle,
  onToggleGroup,
}: MarathonCategoryPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      {groups.map(group => {
        const selectedInGroup = group.options.filter(o => selectedCategories.has(o.id));
        const allSelected = selectedInGroup.length === group.options.length;
        const someSelected = selectedInGroup.length > 0 && !allSelected;

        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => onToggleGroup(group.id, group.options.map(o => o.id))}
              className="flex w-full items-center justify-between px-3 py-2 rounded hover:bg-ink/5 transition-colors duration-150"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-muted">{group.label}</span>
              <Checkbox checked={allSelected} indeterminate={someSelected} />
            </button>
            <ul>
              {group.options.map(option => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => onToggle(option.id)}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 rounded hover:bg-ink/5 transition-colors duration-150"
                  >
                    <Checkbox checked={selectedCategories.has(option.id)} />
                    <span className="flex-1 text-left text-sm text-ink">{option.label}</span>
                    <span className="shrink-0 text-xs text-muted">{option.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export function Checkbox({ checked, indeterminate = false }: { checked: boolean; indeterminate?: boolean }) {
  return (
    <span
      className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors duration-150 ${
        checked || indeterminate
          ? "bg-brand border-brand"
          : "border-ink/30 bg-transparent"
      }`}
    >
      {indeterminate && <span className="text-white text-[11px] font-bold leading-none select-none">−</span>}
      {checked && !indeterminate && <span className="text-white text-[11px] font-bold leading-none select-none">✓</span>}
    </span>
  );
}
