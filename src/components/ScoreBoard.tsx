interface ScoreBoardProps {
  score: number;
  index: number;
  total: number;
}

export function ScoreBoard({ score, index, total }: ScoreBoardProps) {
  const questionNumber = Math.min(index + 1, total);

  return (
    <section
      aria-label="Quiz progress"
      className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-(--color-muted)">
        Question{" "}
        <strong className="text-(--color-ink)">{questionNumber}</strong> of{" "}
        <strong className="text-(--color-ink)">{total}</strong>
      </p>
      <p
        className="text-sm font-semibold text-(--color-brand)"
        aria-label={`Score: ${score} out of ${total}`}
      >
        {score} / {total} correct
      </p>
      <progress
        max={total}
        value={questionNumber}
        aria-label={`Progress: question ${questionNumber} of ${total}`}
        className="h-2 w-full rounded-full sm:w-40 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-(--color-surface) [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-(--color-brand)"
      >
        {questionNumber} of {total}
      </progress>
    </section>
  );
}
