import { useRef, useEffect } from "react";
import type { FuturQuestion } from "../types";
import { AnswerState } from "../types";
import { AnswerButton } from "./AnswerButton";
import { FuturTable } from "./FuturTable";
import { FuturWrongTable } from "./FuturWrongTable";
import { SwipeCard } from "./SwipeCard";

type ButtonState = "default" | "correct" | "wrong" | "dimmed";

interface FuturQuizCardProps {
  question: FuturQuestion;
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

export function FuturQuizCard({
  question,
  answerState,
  selectedIndex,
  onSelect,
  onNext,
  questionNumber,
  total,
}: FuturQuizCardProps) {
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

  const wrongSubject =
    selectedIndex !== null && selectedIndex !== question.correctIndex
      ? question.optionSubjects[selectedIndex]
      : undefined;

  return (
    <SwipeCard
      className="mx-auto w-full max-w-xl rounded-(--radius-card) bg-(--color-surface) p-6 shadow-sm sm:p-8"
      aria-label={`Question ${questionNumber} sur ${total}`}
      resetKey={questionNumber}
      onSwipeRight={isRevealed ? onNext : undefined}
    >
      <div className="mb-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
          Futur simple
        </p>
        <p
          className="mt-2 text-3xl font-bold tracking-tight text-(--color-ink) sm:text-4xl"
          lang="fr"
        >
          {question.verb.infinitive}
        </p>
        <p className="mt-1 text-sm text-(--color-muted)">
          <span lang="en">{question.verb.translation}</span>
          <span className="mx-2 opacity-40">·</span>
          <span lang="es">{question.verb.translationEs}</span>
        </p>
        <p className="mt-3 inline-block rounded-(--radius-button) bg-(--color-brand)/10 px-3 py-1 text-sm font-semibold text-(--color-brand)">
          {question.targetSubject}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

      {selectedIndex !== null && selectedIndex === question.correctIndex && (
        <FuturTable verb={question.verb} futur3sg={question.futur3sg} />
      )}
      {wrongSubject !== undefined && selectedIndex !== null && (
        <FuturWrongTable
          verb={question.verb}
          wrongForm={question.options[selectedIndex] ?? ""}
          wrongSubject={wrongSubject}
          targetSubject={question.targetSubject}
          futur3sg={question.futur3sg}
        />
      )}

      {isRevealed && (
        <div className="mt-6 flex justify-center">
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
  );
}
