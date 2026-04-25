import { X, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import * as Select from "@radix-ui/react-select";
import type { CardOrder } from "../../hooks/useFlashcards";
import type { MarathonMode, RepetitionStyle } from "../flashcard/FlashcardView";

interface MarathonSettingsDrawerProps {
  open: boolean;
  onClose(): void;
  onRestart(): void;
  autoPlay: boolean;
  onAutoPlayChange(v: boolean): void;
  autoSeconds: number;
  onAutoSecondsChange(v: number): void;
  order: CardOrder;
  onOrderChange(v: CardOrder): void;
  mode: MarathonMode;
  onModeChange(v: MarathonMode): void;
  repetitionStyle: RepetitionStyle;
  onRepetitionStyleChange(v: RepetitionStyle): void;
  hideRevisionMode?: boolean;
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange(v: boolean): void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "flex h-6 w-10 shrink-0 items-center rounded-full border p-0.5 transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        checked
          ? "border-brand/45 bg-brand/18"
          : "border-ink/20 bg-ink/10",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "h-4 w-4 rounded-full transition-transform duration-200",
          checked
            ? "translate-x-[calc(40px-16px-4px)] bg-brand"
            : "translate-x-0 bg-ink/70",
        ].join(" ")}
      />
    </button>
  );
}

const ORDER_OPTIONS: { value: CardOrder; label: string; description: string }[] = [
  { value: "fixed",  label: "Fixe",      description: "Toujours dans le même ordre" },
  { value: "random", label: "Aléatoire", description: "Mélanger les cartes" },
  { value: "alpha",  label: "A → Z",     description: "Ordre alphabétique" },
];

export function MarathonSettingsDrawer({
  open,
  onClose,
  onRestart,
  autoPlay,
  onAutoPlayChange,
  autoSeconds,
  onAutoSecondsChange,
  order,
  onOrderChange,
  mode,
  onModeChange,
  repetitionStyle: _repetitionStyle,
  onRepetitionStyleChange: _onRepetitionStyleChange,
  hideRevisionMode = false,
}: MarathonSettingsDrawerProps) {
  const MODE_OPTIONS = (
    [
      { value: "lecture",    label: "Lecture",    description: "Défilement sans évaluation" },
      { value: "répétition", label: "Répétition", description: "3 taps avant d'évaluer" },
      { value: "révision",   label: "Révision",   description: "Swipe + évaluation immédiate" },
    ] as const
  ).filter((opt) => !(hideRevisionMode && opt.value === "révision"));
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>

      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />


      <div
        role="dialog"
        aria-modal="true"
        aria-label="Réglages du Marathon"
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-[90vw] flex flex-col bg-surface shadow-xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >

        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/8 shrink-0">
          <span className="text-sm font-semibold text-ink">Réglages</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-ink/8 hover:text-ink transition-colors duration-150"
          >
            <X size={16} />
          </button>
        </div>


        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">


          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">Auto</p>
                <p className="text-xs text-muted">Passage automatique</p>
              </div>
              <Toggle
                checked={autoPlay}
                onChange={onAutoPlayChange}
                label={autoPlay ? "Désactiver le passage auto" : "Activer le passage auto"}
              />
            </div>

            <div
              aria-hidden={!autoPlay}
              className={`flex items-center gap-3 transition-opacity duration-200 ${autoPlay ? "opacity-100" : "opacity-40 pointer-events-none"}`}
            >
              <span className="text-xs text-muted w-4 shrink-0">1s</span>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={autoSeconds}
                onChange={(e) => onAutoSecondsChange(Number(e.target.value))}
                disabled={!autoPlay}
                aria-label="Délai auto en secondes"
                className="flex-1 accent-brand h-1"
              />
              <span className="text-xs text-muted w-6 shrink-0">30s</span>
              <span className="text-xs font-semibold text-ink w-6 text-right shrink-0">
                {autoSeconds}s
              </span>
            </div>
          </div>

          <div className="border-t border-ink/8" />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-ink">Mode</p>
            {MODE_OPTIONS.map(({ value, label, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => onModeChange(value)}
                className={`flex items-start gap-3 rounded-button border px-3 py-2.5 text-left transition-colors duration-150 ${
                  mode === value ? "border-brand/40 bg-brand/8" : "border-ink/12 hover:bg-ink/4"
                }`}
              >
                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  mode === value ? "border-brand bg-brand" : "border-ink/30"
                }`}>
                  {mode === value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink">{label}</p>
                  <p className="text-[11px] text-muted leading-snug">{description}</p>
                </div>
              </button>
            ))}
          </div>

          {mode === "répétition" && (
            <div className="flex flex-col gap-3">
              {(["intensity", "masking"] as const).map((style) => (
                <div key={style} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {style === "intensity" ? "Intensité progressive" : "Masquage"}
                    </p>
                    <p className="text-xs text-muted">
                      {style === "intensity"
                        ? "La phrase s'affirme visuellement à chaque étape"
                        : "La phrase se floute puis disparaît pour forcer le rappel"}
                    </p>
                  </div>
                  <Toggle
                    checked={_repetitionStyle === style}
                    onChange={() => _onRepetitionStyleChange(style)}
                    label={style === "intensity" ? "Intensité progressive" : "Masquage"}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-ink/8" />

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Ordre</p>
            <Select.Root value={order} onValueChange={(v) => onOrderChange(v as CardOrder)}>
              <Select.Trigger
                aria-label="Ordre des cartes"
                className="flex items-center gap-1.5 rounded-button border border-ink/12 bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors duration-150"
              >
                <Select.Value />
                <Select.Icon><ChevronDown size={12} /></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  position="popper"
                  sideOffset={4}
                  className="z-60 min-w-35 rounded-card border border-ink/8 bg-surface py-1 shadow-lg"
                >
                  <Select.Viewport>
                    {ORDER_OPTIONS.map(({ value, label, description }) => (
                      <Select.Item
                        key={value}
                        value={value}
                        className="flex flex-col px-3 py-2 text-xs text-ink cursor-pointer select-none hover:bg-ink/5 focus:bg-ink/5 focus:outline-none data-[state=checked]:text-brand"
                      >
                        <Select.ItemText>{label}</Select.ItemText>
                        <span className="text-[10px] text-muted">{description}</span>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

        </div>


        <div className="shrink-0 border-t border-ink/8 px-4 py-3">
          <button
            type="button"
            onClick={() => { onRestart(); onClose(); }}
            className="w-full rounded-button bg-brand/12 py-2 text-sm font-medium text-brand hover:bg-brand/20 transition-colors duration-150"
          >
            Appliquer
          </button>
        </div>
      </div>
    </>
  );
}
