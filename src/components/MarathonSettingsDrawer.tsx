import { X, Shuffle } from "lucide-react";
import { useEffect } from "react";

interface MarathonSettingsDrawerProps {
  open: boolean;
  onClose(): void;
  autoPlay: boolean;
  onAutoPlayChange(v: boolean): void;
  autoSeconds: number;
  onAutoSecondsChange(v: number): void;
  random: boolean;
  onRandomChange(v: boolean): void;
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
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)",
        checked
          ? "border-(--color-brand)/45 bg-(--color-brand)/18"
          : "border-(--color-ink)/20 bg-(--color-ink)/10",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "h-4 w-4 rounded-full transition-transform duration-200",
          checked
            ? "translate-x-[calc(40px-16px-4px)] bg-(--color-brand)"
            : "translate-x-0 bg-(--color-ink)/70",
        ].join(" ")}
      />
    </button>
  );
}

export function MarathonSettingsDrawer({
  open,
  onClose,
  autoPlay,
  onAutoPlayChange,
  autoSeconds,
  onAutoSecondsChange,
  random,
  onRandomChange,
}: MarathonSettingsDrawerProps) {
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
        aria-label="Réglages du Marathon"
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-[90vw] flex flex-col bg-(--color-surface) shadow-xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-ink)/8 shrink-0">
          <span className="text-sm font-semibold text-(--color-ink)">Réglages</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-7 w-7 items-center justify-center rounded text-(--color-muted) hover:bg-(--color-ink)/8 hover:text-(--color-ink) transition-colors duration-150"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">

          {/* Auto-advance */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-(--color-ink)">Auto</p>
                <p className="text-xs text-(--color-muted)">Passage automatique</p>
              </div>
              <Toggle
                checked={autoPlay}
                onChange={onAutoPlayChange}
                label={autoPlay ? "Désactiver le passage auto" : "Activer le passage auto"}
              />
            </div>

            {/* Speed slider — horizontal */}
            <div
              aria-hidden={!autoPlay}
              className={`flex items-center gap-3 transition-opacity duration-200 ${autoPlay ? "opacity-100" : "opacity-40 pointer-events-none"}`}
            >
              <span className="text-xs text-(--color-muted) w-4 shrink-0">1s</span>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={autoSeconds}
                onChange={(e) => onAutoSecondsChange(Number(e.target.value))}
                disabled={!autoPlay}
                aria-label="Délai auto en secondes"
                className="flex-1 accent-(--color-brand) h-1"
              />
              <span className="text-xs text-(--color-muted) w-6 shrink-0">30s</span>
              <span className="text-xs font-semibold text-(--color-ink) w-6 text-right shrink-0">
                {autoSeconds}s
              </span>
            </div>
          </div>

          <div className="border-t border-(--color-ink)/8" />

          {/* Random */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shuffle size={14} className="text-(--color-muted)" />
              <div>
                <p className="text-sm font-medium text-(--color-ink)">Aléatoire</p>
                <p className="text-xs text-(--color-muted)">Ignorer la progression</p>
              </div>
            </div>
            <Toggle
              checked={random}
              onChange={onRandomChange}
              label={random ? "Désactiver le mode aléatoire" : "Activer le mode aléatoire"}
            />
          </div>

        </div>
      </div>
    </>
  );
}
