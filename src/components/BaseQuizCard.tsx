import { useEffect, useRef } from "react";
import { Bookmark } from "lucide-react";
import { AnswerState } from "../types";
import { AnswerButton } from "./AnswerButton";
import { SwipeCard } from "./SwipeCard";

type ButtonState = "default" | "correct" | "wrong" | "dimmed";

/** Minimal shape shared by every quiz question type. */
export interface AnswerableQuestion {
  options: readonly string[];
  correctIndex: number;
}

function deriveButtonState(
  optionIndex: number,
  selectedIndex: number | null,
  correctIndex: number
): ButtonState {
  if (optionIndex !== selectedIndex) return "default";
  return optionIndex === correctIndex ? "correct" : "wrong";
}

interface BaseQuizCardProps {
  header: React.ReactNode;
  question: AnswerableQuestion;
  answerState: AnswerState;
  selectedIndex: number | null;
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
  feedback?: React.ReactNode;
  /** Override the options grid. Default: 1 col mobile, 2 cols sm+ */
  optionsGridClassName?: string;
  /** Override card padding. Default: "p-6 sm:p-8" */
  cardPaddingClassName?: string;
  /** Spacing above the Next button. Default: "mt-6" */
  nextButtonSpacing?: string;
  /** Weak-verb bookmark — shown when provided */
  isWeak?: boolean;
  onToggleWeak?(): void;
}

export function BaseQuizCard({
  header,
  question,
  answerState,
  selectedIndex,
  onSelect,
  onNext,
  questionNumber,
  total,
  feedback,
  optionsGridClassName = "mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2",
  cardPaddingClassName = "p-6 sm:p-8",
  nextButtonSpacing = "mt-6",
  isWeak,
  onToggleWeak,
}: BaseQuizCardProps) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const isRevealed = answerState !== AnswerState.Idle;

  useEffect(() => {
    if (isRevealed) {
      nextButtonRef.current?.focus();
    } else {
      firstButtonRef.current?.focus();
    }
  }, [isRevealed, questionNumber]);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {onToggleWeak !== undefined && (
        <button
          type="button"
          aria-label={isWeak ? "Retirer des difficiles" : "Ajouter aux difficiles"}
          className={`absolute -top-8 right-0 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors duration-150 ${
            isWeak
              ? "text-amber-500 hover:text-amber-600"
              : "text-(--color-muted) hover:text-(--color-ink)"
          }`}
          onClick={(e) => { e.stopPropagation(); onToggleWeak(); }}
          onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onToggleWeak(); }}
        >
          <Bookmark size={13} fill={isWeak ? "currentColor" : "none"} />
          {isWeak ? "Difficile" : "Marquer"}
        </button>
      )}
      <SwipeCard
        className={`w-full rounded-(--radius-card) bg-(--color-surface) shadow-sm ${cardPaddingClassName}`}
        aria-label={`Question ${questionNumber} sur ${total}`}
        resetKey={questionNumber}
        onSwipeLeft={isRevealed ? onNext : undefined}
      >
        {header}

        <div className={optionsGridClassName}>
          {question.options.map((option, i) => (
            <AnswerButton
              key={`${option}-${i}`}
              label={option}
              index={i}
              state={deriveButtonState(i, selectedIndex, question.correctIndex)}
              disabled={false}
              onClick={() => onSelect(i)}
              shortcut={i + 1}
              ref={i === 0 ? firstButtonRef : undefined}
            />
          ))}
        </div>

        {feedback}

        {isRevealed && (
          <div className={`${nextButtonSpacing} flex justify-center`}>
            <button
              ref={nextButtonRef}
              type="button"
              onClick={onNext}
              className="min-h-11 rounded-(--radius-card) bg-(--color-brand) px-8 py-3 font-semibold text-white transition-colors duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
            >
              {questionNumber >= total ? "Voir les résultats" : "Suivant →"}
            </button>
          </div>
        )}
      </SwipeCard>
    </div>
  );
}
