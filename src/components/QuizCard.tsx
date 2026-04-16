import type { QuizQuestion } from "../types";
import { AnswerState } from "../types";
import { PasseComposeTable } from "./PasseComposeTable";
import { WrongAnswerTable } from "./WrongAnswerTable";
import { BaseQuizCard } from "./BaseQuizCard";

interface QuizCardProps {
  question: QuizQuestion;
  answerState: AnswerState;
  selectedIndex: number | null;
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
  isWeak?: boolean;
  onToggleWeak?(): void;
}

export function QuizCard({
  question,
  answerState,
  selectedIndex,
  onSelect,
  onNext,
  questionNumber,
  total,
  isWeak,
  onToggleWeak,
}: QuizCardProps) {
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
    </div>
  );

  const feedback = (
    <>
      {selectedIndex !== null && selectedIndex === question.correctIndex && (
        <PasseComposeTable verb={question.verb} />
      )}
      {selectedIndex !== null && selectedIndex !== question.correctIndex && (() => {
        const wrongOption = question.options[selectedIndex];
        return wrongOption ? (
          <WrongAnswerTable verb={question.verb} wrongOption={wrongOption} />
        ) : null;
      })()}
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
      optionsGridClassName="grid grid-cols-1 gap-3 sm:grid-cols-2"
      cardPaddingClassName="p-4 sm:p-8"
      isWeak={isWeak}
      onToggleWeak={onToggleWeak}
    />
  );
}
