import type { ImparfaitQuestion } from "../types";
import { AnswerState } from "../types";
import { ImparfaitTable } from "./ImparfaitTable";
import { ImparfaitWrongTable } from "./ImparfaitWrongTable";
import { BaseQuizCard } from "./BaseQuizCard";

interface ImparfaitQuizCardProps {
  question: ImparfaitQuestion;
  answerState: AnswerState;
  selectedIndex: number | null;
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
}

export function ImparfaitQuizCard({
  question,
  answerState,
  selectedIndex,
  onSelect,
  onNext,
  questionNumber,
  total,
}: ImparfaitQuizCardProps) {
  const wrongSubject =
    selectedIndex !== null && selectedIndex !== question.correctIndex
      ? question.optionSubjects[selectedIndex]
      : undefined;

  const header = (
    <div className="mb-2 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
        Imparfait
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
        <ImparfaitTable verb={question.verb} imparfait3sg={question.imparfait3sg} />
      )}
      {wrongSubject !== undefined && selectedIndex !== null && (
        <ImparfaitWrongTable
          verb={question.verb}
          wrongForm={question.options[selectedIndex] ?? ""}
          wrongSubject={wrongSubject}
          targetSubject={question.targetSubject}
          imparfait3sg={question.imparfait3sg}
        />
      )}
    </>
  );

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
    />
  );
}
