import { useEffect, useRef, useState } from "react";
import { VERBS } from "./data/verbs";
import { useQuiz } from "./hooks/useQuiz";
import { useImparfaitQuiz } from "./hooks/useImparfaitQuiz";
import { QuizPhase } from "./types";
import { ScoreBoard } from "./components/ScoreBoard";
import { QuizCard } from "./components/QuizCard";
import { ImparfaitQuizCard } from "./components/ImparfaitQuizCard";
import { ResultScreen } from "./components/ResultScreen";

const QUESTION_COUNT = 10;

type AppMode = "home" | "participe" | "imparfait";

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("home");

  const participe = useQuiz(VERBS, QUESTION_COUNT);
  const imparfait = useImparfaitQuiz();

  const liveRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState("");

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (appMode === "participe") {
        if (participe.state.phase === QuizPhase.Answering) {
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4) participe.selectAnswer(digit - 1);
        }
        if (participe.state.phase === QuizPhase.Feedback && e.key === "Enter") {
          participe.nextQuestion();
        }
      }

      if (appMode === "imparfait") {
        if (imparfait.state.phase === QuizPhase.Answering) {
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4) imparfait.selectAnswer(digit - 1);
        }
        if (imparfait.state.phase === QuizPhase.Feedback && e.key === "Enter") {
          imparfait.nextQuestion();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [appMode, participe, imparfait]);

  // Announcements
  useEffect(() => {
    if (appMode === "participe" && participe.state.phase === QuizPhase.Feedback && participe.currentQuestion) {
      const correct = participe.currentQuestion.options[participe.currentQuestion.correctIndex] ?? "";
      setAnnouncement(participe.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else if (appMode === "imparfait" && imparfait.state.phase === QuizPhase.Feedback && imparfait.currentQuestion) {
      const correct = imparfait.currentQuestion.options[imparfait.currentQuestion.correctIndex] ?? "";
      setAnnouncement(imparfait.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else {
      setAnnouncement("");
    }
  }, [appMode, participe.state.phase, participe.state.answerState, participe.currentQuestion, imparfait.state.phase, imparfait.state.answerState, imparfait.currentQuestion]);

  function handleGoHome() {
    if (appMode === "participe") participe.goHome();
    if (appMode === "imparfait") imparfait.goHome();
    setAppMode("home");
  }

  function handleStartParticipe() {
    participe.startQuiz();
    setAppMode("participe");
  }

  function handleStartImparfait() {
    imparfait.startQuiz();
    setAppMode("imparfait");
  }

  const activePhase = appMode === "participe" ? participe.state.phase : imparfait.state.phase;
  const activeProgress = appMode === "participe" ? participe.progress : imparfait.progress;
  const activeScore = appMode === "participe" ? participe.state.score : imparfait.state.score;
  const showScoreBoard = appMode !== "home" && (activePhase === QuizPhase.Answering || activePhase === QuizPhase.Feedback);

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg)">
      <header className="border-b border-black/10 bg-(--color-surface) px-4 py-4">
        <div className="relative flex items-center justify-center">
          <h1 className="text-xl font-bold tracking-tight text-(--color-ink)">
            Participe Passé Quiz
          </h1>
          {appMode !== "home" && (
            <button
              type="button"
              onClick={handleGoHome}
              aria-label="Retour à l'accueil"
              className="absolute left-0 text-sm text-(--color-muted) hover:text-(--color-ink) transition-colors duration-150"
            >
              ← Accueil
            </button>
          )}
        </div>
        {showScoreBoard && (
          <ScoreBoard
            score={activeScore}
            index={activeProgress.index}
            total={activeProgress.total}
          />
        )}
      </header>

      <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        {/* ── HOME ── */}
        {appMode === "home" && (
          <div className="mx-auto w-full max-w-xl space-y-4">
            <div className="rounded-(--radius-card) bg-(--color-surface) p-8 text-center shadow-sm">
              <p className="mb-2 text-4xl">🇫🇷</p>
              <h2 className="text-2xl font-bold text-(--color-ink)">
                Quel quiz ?
              </h2>
              <p className="mt-2 text-sm text-(--color-muted)">
                10 questions aléatoires · 4 choix chacune
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartParticipe}
              className="flex w-full flex-col items-start gap-1 rounded-(--radius-card) bg-(--color-surface) px-6 py-5 shadow-sm transition-colors duration-150 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
            >
              <span className="font-semibold text-(--color-ink)">Participe passé</span>
              <span className="text-sm text-(--color-muted)">Choisissez la bonne forme du participe passé</span>
            </button>
            <button
              type="button"
              onClick={handleStartImparfait}
              className="flex w-full flex-col items-start gap-1 rounded-(--radius-card) bg-(--color-surface) px-6 py-5 shadow-sm transition-colors duration-150 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
            >
              <span className="font-semibold text-(--color-ink)">Imparfait</span>
              <span className="text-sm text-(--color-muted)">Choisissez la forme à l'imparfait (il / elle)</span>
            </button>
          </div>
        )}

        {/* ── PARTICIPE QUIZ ── */}
        {appMode === "participe" && (
          <>
            {(participe.state.phase === QuizPhase.Answering || participe.state.phase === QuizPhase.Feedback) &&
              participe.currentQuestion && (
                <QuizCard
                  question={participe.currentQuestion}
                  answerState={participe.state.answerState}
                  selectedIndex={participe.state.selectedIndex}
                  onSelect={participe.selectAnswer}
                  onNext={participe.nextQuestion}
                  questionNumber={participe.progress.index + 1}
                  total={participe.progress.total}
                />
              )}
            {participe.state.phase === QuizPhase.Complete && (
              <ResultScreen
                history={participe.state.history}
                score={participe.state.score}
                total={participe.progress.total}
                onRestart={participe.restartQuiz}
              />
            )}
          </>
        )}

        {/* ── IMPARFAIT QUIZ ── */}
        {appMode === "imparfait" && (
          <>
            {(imparfait.state.phase === QuizPhase.Answering || imparfait.state.phase === QuizPhase.Feedback) &&
              imparfait.currentQuestion && (
                <ImparfaitQuizCard
                  question={imparfait.currentQuestion}
                  answerState={imparfait.state.answerState}
                  selectedIndex={imparfait.state.selectedIndex}
                  onSelect={imparfait.selectAnswer}
                  onNext={imparfait.nextQuestion}
                  questionNumber={imparfait.progress.index + 1}
                  total={imparfait.progress.total}
                />
              )}
            {imparfait.state.phase === QuizPhase.Complete && (
              <ResultScreen
                history={imparfait.state.history}
                score={imparfait.state.score}
                total={imparfait.progress.total}
                onRestart={imparfait.restartQuiz}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
