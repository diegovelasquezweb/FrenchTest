import type { ReactNode } from "react";
import type { Verb } from "../../types";
import { AnswerState } from "../../types";
import { BaseQuizCard } from "./BaseQuizCard";

interface VerbConjugationQuestion {
  verb: Verb;
  options: string[];
  correctIndex: number;
  targetSubject: string;
  optionSubjects: string[];
}

interface VerbConjugationCardProps {
  question: VerbConjugationQuestion;
  tenseName: string;
  correctFeedback: ReactNode;
  wrongFeedback: (wrongForm: string, wrongSubject: string) => ReactNode;
  answerState: AnswerState;
  selectedIndex: number | null;
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
  isWeak?: boolean;
  onToggleWeak?(): void;
}

export function VerbConjugationCard({
  question,
  tenseName,
  correctFeedback,
  wrongFeedback,
  answerState,
  selectedIndex,
  onSelect,
  onNext,
  questionNumber,
  total,
  isWeak,
  onToggleWeak,
}: VerbConjugationCardProps) {
  const wrongSubject =
    selectedIndex !== null && selectedIndex !== question.correctIndex
      ? question.optionSubjects[selectedIndex]
      : undefined;

  const header = (
    <div className="mb-2 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {tenseName}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl" lang="fr">
        {question.verb.infinitive}
      </p>
      <p className="mt-1 text-sm text-muted">
        <span lang="en">{question.verb.translation}</span>
        <span className="mx-2 opacity-40">·</span>
        <span lang="es">{question.verb.translationEs}</span>
      </p>
      <p className="mt-3 inline-block rounded-button bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
        {question.targetSubject}
      </p>
    </div>
  );

  const feedback = (
    <>
      {selectedIndex !== null && selectedIndex === question.correctIndex && correctFeedback}
      {wrongSubject !== undefined && selectedIndex !== null &&
        wrongFeedback(question.options[selectedIndex] ?? "", wrongSubject)}
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
    />
  );
}
