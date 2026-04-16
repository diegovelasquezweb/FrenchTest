import { ScoreBoard } from "./ScoreBoard";

interface QuizPageHeaderProps {
  title: string;
  score: number;
  questionNumber: number;
  total: number;
  showScore?: boolean;
}

export function QuizPageHeader({ title, score, questionNumber, total, showScore = true }: QuizPageHeaderProps) {
  return (
    <>
      <header className="hidden md:flex items-center justify-between gap-4 border-b border-(--color-ink)/8 bg-(--color-surface) px-6 py-3">
        <span className="text-sm font-semibold text-(--color-ink) shrink-0">{title}</span>
        {showScore && <ScoreBoard score={score} index={questionNumber - 1} total={total} />}
      </header>
      <header className="md:hidden border-b border-(--color-ink)/8 bg-(--color-surface) px-4 py-3 flex flex-col gap-2">
        {showScore && <ScoreBoard score={score} index={questionNumber - 1} total={total} />}
      </header>
    </>
  );
}
