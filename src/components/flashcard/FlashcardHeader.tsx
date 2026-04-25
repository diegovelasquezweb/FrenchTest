import { SlidersHorizontal, Settings } from "lucide-react";

interface FlashcardHeaderBaseProps {
  masteredCount: number;
  totalCards: number;
  onReset?: () => void;
}

interface FlashcardHeaderMarathonProps extends FlashcardHeaderBaseProps {
  variant: "marathon";
  onFilter: () => void;
  onSettings: () => void;
}

interface FlashcardHeaderSettingsProps extends FlashcardHeaderBaseProps {
  variant: "flashcard";
  onSettings: () => void;
}

interface FlashcardHeaderDefaultProps extends FlashcardHeaderBaseProps {
  variant?: "default";
}

type FlashcardHeaderProps =
  | FlashcardHeaderMarathonProps
  | FlashcardHeaderSettingsProps
  | FlashcardHeaderDefaultProps;

export function FlashcardHeader(props: FlashcardHeaderProps) {
  if (props.variant === "marathon") {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{props.masteredCount}</span> / {props.totalCards} dominées
        </p>
        <div className="flex items-center gap-3">
          {props.onReset && (
            <button
              type="button"
              onClick={props.onReset}
              className="text-xs text-muted underline underline-offset-2 hover:text-red-500 transition-colors duration-150"
            >
              Réinitialiser
            </button>
          )}
          <button
            type="button"
            onClick={props.onFilter}
            className="flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors duration-150"
          >
            <SlidersHorizontal size={12} />
            Filtrer
          </button>
          <button
            type="button"
            onClick={props.onSettings}
            className="flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors duration-150"
          >
            <Settings size={12} />
            Réglages
          </button>
        </div>
      </div>
    );
  }

  if (props.variant === "flashcard") {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={props.onSettings}
          className="flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors duration-150"
        >
          <Settings size={12} />
          Réglages
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <p className="text-sm text-muted">
        <span className="font-semibold text-ink">{props.masteredCount}</span> / {props.totalCards} dominées
      </p>
      <button
        type="button"
        onClick={props.onReset}
        className="text-xs text-muted underline underline-offset-2 hover:text-red-500 transition-colors duration-150"
      >
        Réinitialiser
      </button>
    </div>
  );
}
