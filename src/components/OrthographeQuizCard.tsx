import { useRef, useEffect } from "react";
import type { OrthographeQuestion } from "../types";
import { AnswerState } from "../types";
import { AnswerButton } from "./AnswerButton";

type ButtonState = "default" | "correct" | "wrong" | "dimmed";

interface OrthographeQuizCardProps {
  question: OrthographeQuestion;
  answerState: AnswerState;
  selectedIndex: number | null;
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
}

function deriveButtonState(
  optionIndex: number,
  answerState: AnswerState,
  selectedIndex: number | null
): ButtonState {
  if (optionIndex !== selectedIndex) return "default";
  if (answerState === AnswerState.Correct) return "correct";
  return "wrong";
}

/** Renders the sentence, replacing ___ with a styled blank */
function SentenceDisplay({ sentence, filled }: { sentence: string; filled?: string }) {
  const parts = sentence.split("___");
  return (
    <p className="text-lg font-medium leading-relaxed text-(--color-ink)" lang="fr">
      {parts[0]}
      <span className="inline-block min-w-12 border-b-2 border-(--color-brand) px-1 text-center font-bold text-(--color-brand)">
        {filled ?? "\u00A0\u00A0\u00A0\u00A0"}
      </span>
      {parts[1]}
    </p>
  );
}

export function OrthographeQuizCard({
  question,
  answerState,
  selectedIndex,
  onSelect,
  onNext,
  questionNumber,
  total,
}: OrthographeQuizCardProps) {
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

  const selectedWord =
    selectedIndex !== null ? question.options[selectedIndex] : undefined;

  return (
    <div
      className="mx-auto w-full max-w-xl rounded-(--radius-card) bg-(--color-surface) p-6 shadow-sm sm:p-8"
      aria-label={`Question ${questionNumber} sur ${total}`}
    >
      {/* Label */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
        Orthographe — choisissez la bonne forme
      </p>

      {/* Sentence with blank */}
      <div className="mb-6 rounded-(--radius-button) bg-(--color-bg) px-4 py-4">
        <SentenceDisplay sentence={question.sentence} filled={selectedWord} />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, i) => {
          const btnState = deriveButtonState(i, answerState, selectedIndex);
          return (
            <AnswerButton
              key={`${option}-${i}`}
              label={option}
              index={i}
              state={btnState}
              disabled={false}
              onClick={() => onSelect(i)}
              shortcut={i + 1}
              ref={i === 0 ? firstButtonRef : undefined}
            />
          );
        })}
      </div>

      {/* Explanation — shown after answering */}
      {isRevealed && (
        <div
          className={`mt-4 rounded-(--radius-button) border-l-4 px-4 py-3 text-sm ${
            answerState === AnswerState.Correct
              ? "border-(--color-correct) bg-[color-mix(in_oklch,var(--color-correct)_8%,transparent)] text-(--color-ink)"
              : "border-(--color-wrong) bg-[color-mix(in_oklch,var(--color-wrong)_8%,transparent)] text-(--color-ink)"
          }`}
        >
          {answerState !== AnswerState.Correct && (
            <p className="mb-1 font-semibold text-(--color-correct)" lang="fr">
              ✓ {question.options[question.correctIndex]}
            </p>
          )}
          <p lang="fr">{question.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isRevealed && (
        <div className="mt-4 flex justify-center">
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
    </div>
  );
}
