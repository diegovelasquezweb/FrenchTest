import type { PronominalQuestion } from "../lib/pronominalQuestions";
import { AnswerState } from "../types";
import { BaseQuizCard } from "./BaseQuizCard";

interface PronominalQuizCardProps {
  question: PronominalQuestion;
  answerState: AnswerState;
  selectedIndex: number | null;
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
}

export function PronominalQuizCard({
  question,
  answerState,
  selectedIndex,
  onSelect,
  onNext,
  questionNumber,
  total,
}: PronominalQuizCardProps) {
  const header = (
    <div className="mb-6 text-center">
      <p className="text-2xl font-bold tracking-tight text-(--color-ink) sm:text-4xl" lang="fr">
        {question.verb.infinitive}
      </p>
      <p className="mt-1 text-sm text-(--color-muted)">
        <span lang="en">{question.verb.translation}</span>
        <span className="mx-2 opacity-40">·</span>
        <span lang="es">{question.verb.translationEs}</span>
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-(--color-muted)/60">
        {question.tense}
      </p>
    </div>
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
      optionsGridClassName="grid grid-cols-1 gap-3 sm:grid-cols-2"
      cardPaddingClassName="p-4 sm:p-8"
    />
  );
}
