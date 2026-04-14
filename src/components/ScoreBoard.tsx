interface ScoreBoardProps {
  score: number;
  index: number;
  total: number;
}

export function ScoreBoard({ score, index, total }: ScoreBoardProps) {
  const questionNumber = Math.min(index + 1, total);

  return (
    <section
      aria-label="Progression du quiz"
      className="mx-auto mt-3 flex w-full max-w-xl items-center gap-3 px-1"
    >
      <span className="shrink-0 text-xs font-semibold tabular-nums text-(--color-muted)">
        {questionNumber} / {total}
      </span>
      <progress
        max={total}
        value={questionNumber}
        aria-label={`Question ${questionNumber} sur ${total}`}
        className="h-1.5 flex-1 rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-(--color-ink)/10 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-(--color-brand) [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-300"
      />
      <span
        className="shrink-0 text-xs font-semibold tabular-nums text-(--color-brand)"
        aria-label={`Score : ${score} correct${score > 1 ? "s" : ""}`}
      >
        ✓ {score}
      </span>
    </section>
  );
}
