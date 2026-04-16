import { X, SquareCheck, Square } from "lucide-react";
import { useEffect } from "react";
import { MarathonCategoryPicker, ALL_MARATHON_CATEGORY_IDS } from "./MarathonCategoryPicker";
import type { MarathonCategoryId, MarathonGroupId, MarathonGroup } from "./MarathonCategoryPicker";

interface MarathonFilterDrawerProps {
  open: boolean;
  onClose(): void;
  groups: MarathonGroup[];
  selectedCategories: Set<MarathonCategoryId>;
  onToggle(id: MarathonCategoryId): void;
  onToggleGroup(groupId: MarathonGroupId, ids: MarathonCategoryId[]): void;
  onSelectAll(): void;
  onUnselectAll(): void;
  onDefault(): void;
  totalSelectedCards: number;
}

export function MarathonFilterDrawer({
  open,
  onClose,
  groups,
  selectedCategories,
  onToggle,
  onToggleGroup,
  onSelectAll,
  onUnselectAll,
  onDefault,
  totalSelectedCards,
}: MarathonFilterDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtrer le Marathon"
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[90vw] flex flex-col bg-(--color-surface) shadow-xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-ink)/8 shrink-0">
          <span className="text-sm font-semibold text-(--color-ink)">Filtrer le Marathon</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-7 w-7 items-center justify-center rounded text-(--color-muted) hover:bg-(--color-ink)/8 hover:text-(--color-ink) transition-colors duration-150"
          >
            <X size={16} />
          </button>
        </div>

        {/* Select all / Unselect all */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-(--color-ink)/8 shrink-0 bg-(--color-bg)/40">
          <p className="text-xs text-(--color-muted)">
            {totalSelectedCards > 0 ? `${totalSelectedCards} cartes` : "Aucune carte"}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onDefault}
              title="Réinitialiser aux catégories par défaut"
              aria-label="Défaut"
              className="px-1 h-7 text-xs text-(--color-muted) underline underline-offset-2 hover:text-(--color-ink) transition-colors duration-150"
            >
              défaut
            </button>
            <button
              type="button"
              onClick={onSelectAll}
              disabled={selectedCategories.size === ALL_MARATHON_CATEGORY_IDS.length}
              title="Tout sélectionner"
              aria-label="Tout sélectionner"
              className="flex h-7 w-7 items-center justify-center rounded text-(--color-brand) hover:bg-(--color-brand)/10 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SquareCheck size={15} />
            </button>
            <button
              type="button"
              onClick={onUnselectAll}
              disabled={selectedCategories.size <= 1}
              title="Tout désélectionner"
              aria-label="Tout désélectionner"
              className="flex h-7 w-7 items-center justify-center rounded text-(--color-muted) hover:bg-(--color-ink)/8 hover:text-(--color-ink) transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Square size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <MarathonCategoryPicker
            groups={groups}
            selectedCategories={selectedCategories}
            onToggle={onToggle}
            onToggleGroup={onToggleGroup}
          />
        </div>
      </div>
    </>
  );
}
