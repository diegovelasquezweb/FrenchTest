import type { ConditionnelQuestion } from "../types";
import { AnswerState } from "../types";
import { ConditionnelTable } from "./ConditionnelTable";
import { ConditionnelWrongTable } from "./ConditionnelWrongTable";
import { BaseQuizCard } from "./BaseQuizCard";

interface ConditionnelQuizCardProps {
  question: ConditionnelQuestion;
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

export function ConditionnelQuizCard({
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
}: ConditionnelQuizCardProps) {
  const wrongSubject =
    selectedIndex !== null && selectedIndex !== question.correctIndex
      ? question.optionSubjects[selectedIndex]
      : undefined;

  const header = (
    <div className="mb-2 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
        Conditionnel
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-(--color-ink) sm:text-4xl" lang="fr">
        {question.verb.infinitive}
      </p>
      <p className="mt-1 text-sm text-(--color-muted)">
        <span lang="en">{question.verb.translation}</span>
        <span className="mx-2 opacity-40">·</span>
        <span lang="es">{question.verb.translationEs}</span>
      </p>
      <p className="mt-3 inline-block rounded bg-(--color-brand)/10 px-3 py-1 text-sm font-semibold text-(--color-brand)">
        {question.targetSubject}
      </p>
    </div>
  );

  const feedback = (
    <>
      {selectedIndex !== null && selectedIndex === question.correctIndex && (
        <ConditionnelTable verb={question.verb} conditionnel3sg={question.conditionnel3sg} />
      )}
      {wrongSubject !== undefined && selectedIndex !== null && (
        <ConditionnelWrongTable
          verb={question.verb}
          wrongForm={question.options[selectedIndex] ?? ""}
          wrongSubject={wrongSubject}
          targetSubject={question.targetSubject}
          conditionnel3sg={question.conditionnel3sg}
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
