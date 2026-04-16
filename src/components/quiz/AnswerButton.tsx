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
    "border-btn-border bg-btn-bg text-ink hover:border-brand/60 hover:bg-[color-mix(in_oklch,var(--color-brand)_6%,transparent)] active:scale-[0.98]",
  correct:
    "border-correct bg-[color-mix(in_oklch,var(--color-correct)_12%,transparent)] text-correct",
  wrong:
    "border-wrong bg-[color-mix(in_oklch,var(--color-wrong)_12%,transparent)] text-wrong",
  dimmed:
    "border-btn-border bg-btn-bg text-muted",
};

export const AnswerButton = forwardRef<HTMLButtonElement, AnswerButtonProps>(
  function AnswerButton({ label, index, state, disabled, onClick, shortcut }, ref) {
    const ariaLabel =
      state === "correct"
        ? `Option ${shortcut} : ${label} — correcte`
        : state === "wrong"
          ? `Option ${shortcut} : ${label} — incorrecte`
          : `Option ${shortcut} : ${label}`;

    const rightIndicator = state === "correct" ? "✓" : state === "wrong" ? "✗" : String(shortcut);
    const hideOnMobile = state === "default";

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
          "min-h-12 rounded-button border-2",
          "text-left font-medium transition-all duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          stateClasses[state],
        ].join(" ")}
      >
        <span lang="fr" className="text-[13px] leading-snug sm:text-base">{label}</span>
        <span
          className={[
            "shrink-0 text-xs font-semibold tabular-nums opacity-40",
            hideOnMobile ? "hidden md:inline" : "inline",
          ].join(" ")}
          aria-hidden="true"
        >
          {rightIndicator}
        </span>
      </button>
    );
  }
);
