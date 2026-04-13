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
    "border-black/10 bg-white hover:bg-(--color-surface) text-(--color-ink)",
  correct:
    "border-(--color-correct) bg-[color-mix(in_oklch,var(--color-correct)_12%,transparent)] text-(--color-correct)",
  wrong:
    "border-(--color-wrong) bg-[color-mix(in_oklch,var(--color-wrong)_12%,transparent)] text-(--color-wrong)",
  dimmed: "border-black/10 bg-white text-(--color-ink) opacity-60",
};

function StateIcon({ buttonState }: { buttonState: ButtonState }) {
  if (buttonState === "correct") {
    return (
      <span aria-hidden="true" className="shrink-0 text-lg font-bold leading-none">
        ✓
      </span>
    );
  }
  if (buttonState === "wrong") {
    return (
      <span aria-hidden="true" className="shrink-0 text-lg font-bold leading-none">
        ✗
      </span>
    );
  }
  return null;
}

export const AnswerButton = forwardRef<HTMLButtonElement, AnswerButtonProps>(
  function AnswerButton({ label, index, state, disabled, onClick, shortcut }, ref) {
    const suffix =
      state === "correct"
        ? " — correct"
        : state === "wrong"
          ? " — incorrect"
          : "";

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        data-index={index}
        aria-label={`Option ${shortcut}: ${label}${suffix}`}
        className={[
          "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left",
          "min-h-11 transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)",
          "disabled:cursor-not-allowed",
          stateClasses[state],
        ].join(" ")}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-surface) text-xs font-semibold text-(--color-muted)"
          aria-hidden="true"
        >
          {shortcut}
        </span>
        <span className="flex-1 font-medium">{label}</span>
        <StateIcon buttonState={state} />
      </button>
    );
  }
);
