import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle(): void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      onClick={onToggle}
      className="flex h-7 w-12 items-center rounded-full border border-btn-border bg-btn-bg p-0.5 shadow-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span
        aria-hidden="true"
        className={[
          "flex h-5 w-5 items-center justify-center rounded-full text-[11px] transition-transform duration-200",
          isDark
            ? "translate-x-[calc(48px-20px-4px)] bg-brand text-white"
            : "translate-x-0 bg-surface shadow-sm",
        ].join(" ")}
      >
        {isDark ? <Moon size={11} /> : <Sun size={11} />}
      </span>
    </button>
  );
}
