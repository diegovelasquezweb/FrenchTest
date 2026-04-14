import { forwardRef } from "react";

type ButtonState = "default" | "correct" | "wrong" | "dimmed";

interface AnswerButtonProps {
  label: string;
  index: number;
  state: ButtonState;
  disabled: boolean;
  onClick(): void;
  shortcut: number;
}

const stateClasses: Record<ButtonState, string> = {
  default:
    "border-(--color-btn-border) bg-(--color-btn-bg) text-(--color-ink) hover:border-(--color-brand)/60 hover:bg-[color-mix(in_oklch,var(--color-brand)_6%,transparent)] active:scale-[0.98]",
  correct:
    "border-(--color-correct) bg-[color-mix(in_oklch,var(--color-correct)_12%,transparent)] text-(--color-correct)",
  wrong:
    "border-(--color-wrong) bg-[color-mix(in_oklch,var(--color-wrong)_12%,transparent)] text-(--color-wrong)",
  dimmed:
    "border-(--color-btn-border) bg-(--color-btn-bg) text-(--color-muted)",
};

export const AnswerButton = forwardRef<HTMLButtonElement, AnswerButtonProps>(
  function AnswerButton({ label, index, state, disabled, onClick, shortcut }, ref) {
    const ariaLabel =
      state === "correct"
        ? `Option ${shortcut} : ${label} — correcte`
        : state === "wrong"
          ? `Option ${shortcut} : ${label} — incorrecte`
          : `Option ${shortcut} : ${label}`;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        data-index={index}
        aria-label={ariaLabel}
        className={[
          "flex w-full items-center justify-between gap-3 px-4 py-3.5",
          "min-h-12 rounded-(--radius-button) border-2",
          "text-left font-medium transition-all duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)",
          stateClasses[state],
        ].join(" ")}
      >
        <span lang="fr">{label}</span>
        <span className="shrink-0 text-xs font-semibold tabular-nums opacity-40" aria-hidden="true">
          {state === "correct" ? "✓" : state === "wrong" ? "✗" : shortcut}
        </span>
      </button>
    );
  }
);
