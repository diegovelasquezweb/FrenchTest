import { useRef, useEffect } from "react";
import type { QuizQuestion } from "../types";
import { AnswerState } from "../types";
import { AnswerButton } from "./AnswerButton";
import { PasseComposeTable } from "./PasseComposeTable";

type ButtonState = "default" | "correct" | "wrong" | "dimmed";

interface QuizCardProps {
  question: QuizQuestion;
  answerState: AnswerState;
  triedIndices: number[];
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
}

function deriveButtonState(
  optionIndex: number,
  correctIndex: number,
  _selectedIndex: number | null,
  answerState: AnswerState,
  triedIndices: number[]
): ButtonState {
  // Feedback phase (correct answer found)
  if (answerState === AnswerState.Correct) {
    if (optionIndex === correctIndex) return "correct";
    if (triedIndices.includes(optionIndex)) return "wrong";
    return "dimmed";
  }
  // Answering phase — mark tried options as wrong, rest default
  if (triedIndices.includes(optionIndex)) return "wrong";
  return "default";
}

export function QuizCard({
  question,
  answerState,
  triedIndices,
  onSelect,
  onNext,
  questionNumber,
  total,
}: QuizCardProps) {
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
    <div
      className="mx-auto w-full max-w-xl rounded-(--radius-card) bg-(--color-surface) p-6 shadow-sm transition-opacity duration-200 sm:p-8"
      aria-label={`Question ${questionNumber} of ${total}`}
    >
      <div className="mb-6 text-center">
        <p
          className="text-3xl font-bold tracking-tight text-(--color-ink) sm:text-4xl"
          lang="fr"
        >
          {question.verb.infinitive}
        </p>
        <p className="mt-1 text-sm text-(--color-muted)">
          <span lang="en">{question.verb.translation}</span>
          <span className="mx-2 opacity-40">·</span>
          <span lang="es">{question.verb.translationEs}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option, i) => {
          const btnState = deriveButtonState(
            i,
            question.correctIndex,
            null,
            answerState,
            triedIndices
          );
          const isTried = triedIndices.includes(i);
          return (
            <AnswerButton
              key={option}
              label={option}
              index={i}
              state={btnState}
              disabled={isRevealed || isTried}
              onClick={() => onSelect(i)}
              shortcut={i + 1}
              ref={i === 0 ? firstButtonRef : undefined}
            />
          );
        })}
      </div>

      {isRevealed && answerState === AnswerState.Correct && (
        <PasseComposeTable verb={question.verb} />
      )}

      {isRevealed && (
        <div className="mt-6 flex justify-center">
          <button
            ref={nextButtonRef}
            type="button"
            onClick={onNext}
            className="min-h-11 rounded-xl bg-(--color-brand) px-8 py-3 font-semibold text-white transition-colors duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
          >
            {questionNumber >= total ? "See Results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
