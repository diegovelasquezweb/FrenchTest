import type { OrthographeQuestion } from "../types";
import { AnswerState } from "../types";
import { BaseQuizCard } from "./BaseQuizCard";

interface OrthographeQuizCardProps {
  question: OrthographeQuestion;
  answerState: AnswerState;
  selectedIndex: number | null;
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
  label?: string;
}

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
  label = "Orthographe — choisissez la bonne forme",
}: OrthographeQuizCardProps) {
  const isRevealed = answerState !== AnswerState.Idle;
  const selectedWord = selectedIndex !== null ? question.options[selectedIndex] : undefined;

  const header = (
    <>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
        {label}
      </p>
      <div className="mb-6 rounded-(--radius-button) bg-(--color-bg) px-4 py-4">
        <SentenceDisplay sentence={question.sentence} filled={selectedWord} />
      </div>
    </>
  );

  const feedback = isRevealed ? (
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
  ) : undefined;

  return (
    <BaseQuizCard
      header={header}
      options={question.options}
      answerState={answerState}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
      onNext={onNext}
      questionNumber={questionNumber}
      total={total}
      feedback={feedback}
      optionsGridClassName="grid grid-cols-2 gap-3"
      nextButtonSpacing="mt-4"
    />
  );
}
