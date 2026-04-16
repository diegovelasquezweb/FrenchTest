interface ScoreBoardProps {
  score: number;
  index: number;
  total: number;
}

export function ScoreBoard({ score, index, total }: ScoreBoardProps) {
  const questionNumber = Math.min(index + 1, total);
  const percent = total > 0 ? (questionNumber / total) * 100 : 0;

  return (
    <section
      aria-label="Progression du quiz"
      className="mx-auto mt-3 flex w-full max-w-xl items-center gap-3 px-1"
    >
      <span className="shrink-0 text-xs font-semibold tabular-nums text-(--color-muted)">
        {questionNumber} / {total}
      </span>
      <div
        role="progressbar"
        aria-valuenow={questionNumber}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Question ${questionNumber} sur ${total}`}
        className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-(--color-ink)/10"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-(--color-brand) to-(--color-brand)/70 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span
        className="shrink-0 text-xs font-semibold tabular-nums text-(--color-brand)"
        aria-label={`Score : ${score} correct${score > 1 ? "s" : ""}`}
      >
        ✓ {score}
      </span>
    </section>
  );
}
