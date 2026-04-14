import { useEffect, useRef, useState } from "react";
import { VERBS } from "./data/verbs";
import { useQuiz } from "./hooks/useQuiz";
import { QuizPhase } from "./types";
import { ScoreBoard } from "./components/ScoreBoard";
import { QuizCard } from "./components/QuizCard";
import { ResultScreen } from "./components/ResultScreen";

const QUESTION_COUNT = 10;

export default function App() {
  const { state, startQuiz, selectAnswer, nextQuestion, restartQuiz, goHome, currentQuestion, progress } =
    useQuiz(VERBS, QUESTION_COUNT);

  const [announcement, setAnnouncement] = useState("");
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (state.phase === QuizPhase.Answering) {
        const digit = parseInt(e.key, 10);
        if (digit >= 1 && digit <= 4) {
          selectAnswer(digit - 1);
        }
      }

      if (state.phase === QuizPhase.Feedback && e.key === "Enter") {
        nextQuestion();
      }

      if (state.phase === QuizPhase.Complete && e.key === "Escape") {
        restartQuiz();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state.phase, selectAnswer, nextQuestion, restartQuiz]);

  useEffect(() => {
    if (state.phase === QuizPhase.Feedback && currentQuestion) {
      const correct = currentQuestion.options[currentQuestion.correctIndex] ?? "";
      if (state.answerState === "correct") {
        setAnnouncement("Correct!");
      } else {
        setAnnouncement(`Incorrect. The correct answer is ${correct}.`);
      }
    } else {
      setAnnouncement("");
    }
  }, [state.phase, state.answerState, currentQuestion]);

  const showScoreBoard =
    state.phase === QuizPhase.Answering || state.phase === QuizPhase.Feedback;

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg)">
      <header className="border-b border-black/10 bg-(--color-surface) px-4 py-4">
        <div className="relative flex items-center justify-center">
          <h1 className="text-xl font-bold tracking-tight text-(--color-ink)">
            Participe Passé Quiz
          </h1>
          {showScoreBoard && (
            <button
              type="button"
              onClick={goHome}
              aria-label="Retour à l'accueil"
              className="absolute left-0 text-sm text-(--color-muted) hover:text-(--color-ink) transition-colors duration-150"
            >
              ← Accueil
            </button>
          )}
        </div>
        {showScoreBoard && (
          <ScoreBoard
            score={state.score}
            index={progress.index}
            total={progress.total}
          />
        )}
      </header>

      <div
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        {state.phase === QuizPhase.Idle && (
          <div className="mx-auto w-full max-w-xl rounded-(--radius-card) bg-(--color-surface) p-8 text-center shadow-sm">
            <p className="mb-2 text-4xl">🇫🇷</p>
            <h2 className="text-2xl font-bold text-(--color-ink)">
              Test your French participes passés
            </h2>

            <button
              type="button"
              onClick={startQuiz}
              className="mt-6 min-h-11 rounded-xl bg-(--color-brand) px-10 py-3 font-semibold text-white transition-colors duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
            >
              Start Quiz
            </button>
          </div>
        )}

        {(state.phase === QuizPhase.Answering || state.phase === QuizPhase.Feedback) &&
          currentQuestion && (
            <QuizCard
              question={currentQuestion}
              answerState={state.answerState}
              selectedIndex={state.selectedIndex}
              onSelect={selectAnswer}
              onNext={nextQuestion}
              questionNumber={progress.index + 1}
              total={progress.total}
            />
          )}

        {state.phase === QuizPhase.Complete && (
          <ResultScreen
            history={state.history}
            score={state.score}
            total={progress.total}
            onRestart={restartQuiz}
          />
        )}
      </main>
    </div>
  );
}
