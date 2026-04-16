import { AnswerState } from "../types";
import { BaseQuizCard } from "./BaseQuizCard";

interface ArticlesQuestion {
  sentence: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

interface ArticlesQuizCardProps {
  question: ArticlesQuestion;
  answerState: AnswerState;
  selectedIndex: number | null;
  onSelect(i: number): void;
  onNext(): void;
  questionNumber: number;
  total: number;
}

function SentenceDisplay({ sentence, filled }: { sentence: string; filled?: string }) {
  const parts = sentence.split("___");
  return (
    <p className="text-base font-medium leading-relaxed text-(--color-ink) sm:text-lg" lang="fr">
      {parts[0]}
      <span className="inline-block min-w-12 border-b-2 border-(--color-brand) px-1 text-center font-bold text-(--color-brand)">
        {filled ?? "\u00A0\u00A0\u00A0\u00A0"}
      </span>
      {parts[1]}
    </p>
  );
}

export function ArticlesQuizCard({
  question,
  answerState,
  selectedIndex,
  onSelect,
  onNext,
  questionNumber,
  total,
}: ArticlesQuizCardProps) {
  const isWrongPick = selectedIndex !== null && selectedIndex !== question.correctIndex;
  const selectedWord = selectedIndex !== null ? question.options[selectedIndex] : undefined;
  const correctWord = question.options[question.correctIndex] ?? "";

  const header = (
    <>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
        Articles & contractions
      </p>
      <div className="mb-6 rounded-(--radius-button) bg-(--color-bg) px-4 py-4">
        <SentenceDisplay sentence={question.sentence} filled={selectedWord} />
      </div>
    </>
  );

  const feedback = selectedIndex !== null ? (
    <div
      className={`mt-4 rounded-(--radius-button) border-l-4 px-4 py-3 text-sm ${
        isWrongPick
          ? "border-(--color-wrong) bg-[color-mix(in_oklch,var(--color-wrong)_8%,transparent)] text-(--color-ink)"
          : "border-(--color-correct) bg-[color-mix(in_oklch,var(--color-correct)_8%,transparent)] text-(--color-ink)"
      }`}
    >
      {isWrongPick ? (
        <p className="mb-1" lang="fr">
          <span className="font-semibold text-red-500">✗ Incorrect :</span>{" "}
          tu as choisi « {selectedWord} », la bonne réponse est « {correctWord} ».
        </p>
      ) : (
        <p className="mb-1 font-semibold text-emerald-600 dark:text-emerald-400" lang="fr">
          ✓ Correct : {correctWord}
        </p>
      )}
      <p lang="fr">{question.explanation}</p>
    </div>
  ) : undefined;

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
      optionsGridClassName="grid grid-cols-2 gap-3"
      nextButtonSpacing="mt-4"
    />
  );
}
