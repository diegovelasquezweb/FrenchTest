import type { SubjonctifQuestion } from "../types";
import { AnswerState } from "../types";
import { BaseQuizCard } from "./BaseQuizCard";
import { SubjonctifTable } from "./SubjonctifTable";
import { SubjonctifWrongTable } from "./SubjonctifWrongTable";

interface SubjonctifQuizCardProps {
  question: SubjonctifQuestion;
  answerState: AnswerState;
  selectedIndex: number | null;
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
  isWeak?: boolean;
  onToggleWeak?(): void;
  score: number;
}

export function SubjonctifQuizCard({
  question,
  answerState,
  selectedIndex,
  onSelect,
  onNext,
  questionNumber,
  total,
  isWeak,
  onToggleWeak,
  score,
}: SubjonctifQuizCardProps) {
  const wrongSubject =
    selectedIndex !== null && selectedIndex !== question.correctIndex
      ? question.optionSubjects[selectedIndex]
      : undefined;

  const header = (
    <div className="mb-2 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
        Subjonctif présent
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-(--color-ink) sm:text-4xl" lang="fr">
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
  );

  const feedback = (
    <>
      {selectedIndex !== null && selectedIndex === question.correctIndex && (
        <SubjonctifTable verb={question.verb} />
      )}
      {wrongSubject !== undefined && selectedIndex !== null && (
        <SubjonctifWrongTable
          verb={question.verb}
          wrongForm={question.options[selectedIndex] ?? ""}
          wrongSubject={wrongSubject}
          targetSubject={question.targetSubject}
        />
      )}
    </>
  );

  return (
    <BaseQuizCard
      header={header}
      question={question}
      answerState={answerState}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
      onNext={onNext}
      questionNumber={questionNumber}
      total={total}
      feedback={feedback}
      isWeak={isWeak}
      onToggleWeak={onToggleWeak}
      score={score}
    />
  );
}
