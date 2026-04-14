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
      className="fixed right-4 top-3 z-50 flex h-7 w-12 items-center rounded-full border border-(--color-btn-border) bg-(--color-btn-bg) p-0.5 shadow-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
    >
      <span
        aria-hidden="true"
        className={[
          "flex h-5 w-5 items-center justify-center rounded-full text-[11px] transition-transform duration-200",
          isDark
            ? "translate-x-[calc(48px-20px-4px)] bg-(--color-brand) text-white"
            : "translate-x-0 bg-(--color-surface) shadow-sm",
        ].join(" ")}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
