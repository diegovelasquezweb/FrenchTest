import { useEffect, useRef, useState } from "react";
import { VERBS } from "./data/verbs";
import { useQuiz } from "./hooks/useQuiz";
import { useImparfaitQuiz } from "./hooks/useImparfaitQuiz";
import { useConditionnelQuiz } from "./hooks/useConditionnelQuiz";
import { useFuturQuiz } from "./hooks/useFuturQuiz";
import { useOrthographeQuiz } from "./hooks/useOrthographeQuiz";
import { usePhrasesQuiz } from "./hooks/usePhrasesQuiz";
import { usePresentQuiz } from "./hooks/usePresentQuiz";
import { useEcritQuiz } from "./hooks/useEcritQuiz";
import { useOralQuiz } from "./hooks/useOralQuiz";
import { useFlashcards } from "./hooks/useFlashcards";
import { useTheme } from "./hooks/useTheme";
import { QuizPhase } from "./types";
import { ScoreBoard } from "./components/ScoreBoard";
import { QuizCard } from "./components/QuizCard";
import { ImparfaitQuizCard } from "./components/ImparfaitQuizCard";
import { ConditionnelQuizCard } from "./components/ConditionnelQuizCard";
import { FuturQuizCard } from "./components/FuturQuizCard";
import { OrthographeQuizCard } from "./components/OrthographeQuizCard";
import { ResultScreen } from "./components/ResultScreen";
import { OrthographeResultScreen } from "./components/OrthographeResultScreen";
import { PresentQuizCard } from "./components/PresentQuizCard";
import { FlashcardView } from "./components/FlashcardView";
import { FlashcardResults } from "./components/FlashcardResults";
import { ThemeToggle } from "./components/ThemeToggle";

const QUESTION_COUNT = 10;

type AppMode = "home" | "participe" | "imparfait" | "conditionnel" | "futur" | "orthographe" | "phrases" | "présent" | "écrit" | "oral" | "patterns";

const MODE_LABEL: Record<Exclude<AppMode, "home">, string> = {
  participe: "Participe passé",
  imparfait: "Imparfait",
  conditionnel: "Conditionnel",
  futur: "Futur simple",
  orthographe: "Grammaire",
  phrases: "Expressions du discours",
  présent: "Présent",
  écrit: "Écrit formel",
  oral: "Expression orale",
  patterns: "Patterns",
};

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [appMode, setAppMode] = useState<AppMode>("home");

  const participe = useQuiz(VERBS, QUESTION_COUNT);
  const imparfait = useImparfaitQuiz();
  const conditionnel = useConditionnelQuiz();
  const futur = useFuturQuiz();
  const orthographe = useOrthographeQuiz();
  const phrases = usePhrasesQuiz();
  const présent = usePresentQuiz();
  const écrit = useEcritQuiz();
  const oral = useOralQuiz();
  const flashcards = useFlashcards();

  const liveRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState("");

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

      if (appMode === "conditionnel") {
        if (conditionnel.state.phase === QuizPhase.Answering) {
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4) conditionnel.selectAnswer(digit - 1);
        }
        if (conditionnel.state.phase === QuizPhase.Feedback && e.key === "Enter") {
          conditionnel.nextQuestion();
        }
      }

      if (appMode === "futur") {
        if (futur.state.phase === QuizPhase.Answering) {
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4) futur.selectAnswer(digit - 1);
        }
        if (futur.state.phase === QuizPhase.Feedback && e.key === "Enter") {
          futur.nextQuestion();
        }
      }

      if (appMode === "orthographe") {
        if (orthographe.state.phase === QuizPhase.Answering) {
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4) orthographe.selectAnswer(digit - 1);
        }
        if (orthographe.state.phase === QuizPhase.Feedback && e.key === "Enter") {
          orthographe.nextQuestion();
        }
      }

      if (appMode === "phrases") {
        if (phrases.state.phase === QuizPhase.Answering) {
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4) phrases.selectAnswer(digit - 1);
        }
        if (phrases.state.phase === QuizPhase.Feedback && e.key === "Enter") {
          phrases.nextQuestion();
        }
      }

      if (appMode === "présent") {
        if (présent.state.phase === QuizPhase.Answering) {
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4) présent.selectAnswer(digit - 1);
        }
        if (présent.state.phase === QuizPhase.Feedback && e.key === "Enter") {
          présent.nextQuestion();
        }
      }

      if (appMode === "écrit") {
        if (écrit.state.phase === QuizPhase.Answering) {
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4) écrit.selectAnswer(digit - 1);
        }
        if (écrit.state.phase === QuizPhase.Feedback && e.key === "Enter") {
          écrit.nextQuestion();
        }
      }

      if (appMode === "oral") {
        if (oral.state.phase === QuizPhase.Answering) {
          const digit = parseInt(e.key, 10);
          if (digit >= 1 && digit <= 4) oral.selectAnswer(digit - 1);
        }
        if (oral.state.phase === QuizPhase.Feedback && e.key === "Enter") {
          oral.nextQuestion();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [appMode, participe, imparfait, conditionnel, futur, orthographe, phrases, présent, écrit, oral]);

  useEffect(() => {
    if (appMode === "participe" && participe.state.phase === QuizPhase.Feedback && participe.currentQuestion) {
      const correct = participe.currentQuestion.options[participe.currentQuestion.correctIndex] ?? "";
      setAnnouncement(participe.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else if (appMode === "imparfait" && imparfait.state.phase === QuizPhase.Feedback && imparfait.currentQuestion) {
      const correct = imparfait.currentQuestion.options[imparfait.currentQuestion.correctIndex] ?? "";
      setAnnouncement(imparfait.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else if (appMode === "conditionnel" && conditionnel.state.phase === QuizPhase.Feedback && conditionnel.currentQuestion) {
      const correct = conditionnel.currentQuestion.options[conditionnel.currentQuestion.correctIndex] ?? "";
      setAnnouncement(conditionnel.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else if (appMode === "futur" && futur.state.phase === QuizPhase.Feedback && futur.currentQuestion) {
      const correct = futur.currentQuestion.options[futur.currentQuestion.correctIndex] ?? "";
      setAnnouncement(futur.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else if (appMode === "orthographe" && orthographe.state.phase === QuizPhase.Feedback && orthographe.currentQuestion) {
      const correct = orthographe.currentQuestion.options[orthographe.currentQuestion.correctIndex] ?? "";
      setAnnouncement(orthographe.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else if (appMode === "phrases" && phrases.state.phase === QuizPhase.Feedback && phrases.currentQuestion) {
      const correct = phrases.currentQuestion.options[phrases.currentQuestion.correctIndex] ?? "";
      setAnnouncement(phrases.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else if (appMode === "présent" && présent.state.phase === QuizPhase.Feedback && présent.currentQuestion) {
      const correct = présent.currentQuestion.options[présent.currentQuestion.correctIndex] ?? "";
      setAnnouncement(présent.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else if (appMode === "écrit" && écrit.state.phase === QuizPhase.Feedback && écrit.currentQuestion) {
      const correct = écrit.currentQuestion.options[écrit.currentQuestion.correctIndex] ?? "";
      setAnnouncement(écrit.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else if (appMode === "oral" && oral.state.phase === QuizPhase.Feedback && oral.currentQuestion) {
      const correct = oral.currentQuestion.options[oral.currentQuestion.correctIndex] ?? "";
      setAnnouncement(oral.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
    } else {
      setAnnouncement("");
    }
  }, [
    appMode,
    participe.state.phase, participe.state.answerState, participe.currentQuestion,
    imparfait.state.phase, imparfait.state.answerState, imparfait.currentQuestion,
    conditionnel.state.phase, conditionnel.state.answerState, conditionnel.currentQuestion,
    futur.state.phase, futur.state.answerState, futur.currentQuestion,
    orthographe.state.phase, orthographe.state.answerState, orthographe.currentQuestion,
    phrases.state.phase, phrases.state.answerState, phrases.currentQuestion,
    présent.state.phase, présent.state.answerState, présent.currentQuestion,
    écrit.state.phase, écrit.state.answerState, écrit.currentQuestion,
    oral.state.phase, oral.state.answerState, oral.currentQuestion,
  ]);

  function handleGoHome() {
    if (appMode === "participe") participe.goHome();
    if (appMode === "imparfait") imparfait.goHome();
    if (appMode === "conditionnel") conditionnel.goHome();
    if (appMode === "futur") futur.goHome();
    if (appMode === "orthographe") orthographe.goHome();
    if (appMode === "phrases") phrases.goHome();
    if (appMode === "présent") présent.goHome();
    if (appMode === "écrit") écrit.goHome();
    if (appMode === "oral") oral.goHome();
    if (appMode === "patterns") flashcards.goHome();
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

  function handleStartConditionnel() {
    conditionnel.startQuiz();
    setAppMode("conditionnel");
  }

  function handleStartFutur() {
    futur.startQuiz();
    setAppMode("futur");
  }

  function handleStartOrthographe() {
    orthographe.startQuiz();
    setAppMode("orthographe");
  }

  function handleStartPhrases() {
    phrases.startQuiz();
    setAppMode("phrases");
  }

  function handleStartPresent() {
    présent.startQuiz();
    setAppMode("présent");
  }

  function handleStartEcrit() {
    écrit.startQuiz();
    setAppMode("écrit");
  }

  function handleStartOral() {
    oral.startQuiz();
    setAppMode("oral");
  }

  function handleStartPatterns() {
    flashcards.startSession();
    setAppMode("patterns");
  }

  const activePhase =
    appMode === "participe" ? participe.state.phase
    : appMode === "imparfait" ? imparfait.state.phase
    : appMode === "conditionnel" ? conditionnel.state.phase
    : appMode === "futur" ? futur.state.phase
    : appMode === "orthographe" ? orthographe.state.phase
    : appMode === "phrases" ? phrases.state.phase
    : appMode === "présent" ? présent.state.phase
    : appMode === "écrit" ? écrit.state.phase
    : appMode === "oral" ? oral.state.phase
    : QuizPhase.Idle;

  const activeProgress =
    appMode === "participe" ? participe.progress
    : appMode === "imparfait" ? imparfait.progress
    : appMode === "conditionnel" ? conditionnel.progress
    : appMode === "futur" ? futur.progress
    : appMode === "orthographe" ? orthographe.progress
    : appMode === "phrases" ? phrases.progress
    : appMode === "présent" ? présent.progress
    : appMode === "écrit" ? écrit.progress
    : appMode === "oral" ? oral.progress
    : { index: 0, total: 0 };

  const activeScore =
    appMode === "participe" ? participe.state.score
    : appMode === "imparfait" ? imparfait.state.score
    : appMode === "conditionnel" ? conditionnel.state.score
    : appMode === "futur" ? futur.state.score
    : appMode === "orthographe" ? orthographe.state.score
    : appMode === "phrases" ? phrases.state.score
    : appMode === "présent" ? présent.state.score
    : appMode === "écrit" ? écrit.state.score
    : oral.state.score;

  const showScoreBoard = appMode !== "home" && (activePhase === QuizPhase.Answering || activePhase === QuizPhase.Feedback);

  return (
    <div className="flex min-h-full flex-col bg-(--color-bg)">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {/* Header — hidden on home screen */}
      {appMode !== "home" && (
        <header className="border-b border-(--color-ink)/8 bg-(--color-surface) px-4 pb-3 pt-4">
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={handleGoHome}
              aria-label="Retour à l'accueil"
              className="absolute left-0 flex items-center gap-1 text-sm font-medium text-(--color-muted) transition-colors duration-150 hover:text-(--color-ink)"
            >
              ← Accueil
            </button>
            <span className="text-sm font-semibold text-(--color-ink)">
              {MODE_LABEL[appMode]}
            </span>
          </div>
          {showScoreBoard && (
            <ScoreBoard
              score={activeScore}
              index={activeProgress.index}
              total={activeProgress.total}
            />
          )}
        </header>
      )}

      <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        {/* ── HOME ── */}
        {appMode === "home" && (
          <div className="mx-auto w-full max-w-2xl flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-(--color-ink) sm:text-4xl">
                🇨🇦&nbsp;Le TEFinateur&nbsp;3000
              </h1>
              <p className="mt-2 text-sm text-(--color-muted)">
                Préparez votre TEF. Ou commencez à faire vos valises. Bonne chance.
              </p>
            </div>
          <div className="grid grid-cols-4 gap-3">
            {(
              [
                { label: "Conditionnel",    sub: "Conjuguer par sujet",  onClick: handleStartConditionnel },
                { label: "Connecteurs",     sub: "Expressions du TEF",   onClick: handleStartPhrases },
                { label: "Écrit formel",    sub: "Lettres & expressions", onClick: handleStartEcrit },
                { label: "Expression orale", sub: "Poser des questions",  onClick: handleStartOral },
                { label: "Futur simple",    sub: "Conjuguer par sujet",  onClick: handleStartFutur },
                { label: "Imparfait",       sub: "Conjuguer par sujet",  onClick: handleStartImparfait },
                { label: "Grammaire",        sub: "Corriger les erreurs",  onClick: handleStartOrthographe },
                { label: "Participe passé", sub: "Identifier la forme",  onClick: handleStartParticipe },
                { label: "Patterns",         sub: "Mémoriser les phrases", onClick: handleStartPatterns },
                { label: "Présent",         sub: "Conjuguer par sujet",  onClick: handleStartPresent },
              ] as const
            ).map(({ label, sub, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="flex flex-col items-center gap-3 rounded-(--radius-card) bg-(--color-surface) px-4 py-5 shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-brand)/10 text-xl">
                  🇫🇷
                </span>
                <span className="text-center">
                  <span className="block font-semibold text-(--color-ink)">{label}</span>
                  <span className="block text-xs text-(--color-muted)">{sub}</span>
                </span>
              </button>
            ))}
          </div>
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
                onHome={handleGoHome}
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
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── FUTUR QUIZ ── */}
        {appMode === "futur" && (
          <>
            {(futur.state.phase === QuizPhase.Answering || futur.state.phase === QuizPhase.Feedback) &&
              futur.currentQuestion && (
                <FuturQuizCard
                  question={futur.currentQuestion}
                  answerState={futur.state.answerState}
                  selectedIndex={futur.state.selectedIndex}
                  onSelect={futur.selectAnswer}
                  onNext={futur.nextQuestion}
                  questionNumber={futur.progress.index + 1}
                  total={futur.progress.total}
                />
              )}
            {futur.state.phase === QuizPhase.Complete && (
              <ResultScreen
                history={futur.state.history}
                score={futur.state.score}
                total={futur.progress.total}
                onRestart={futur.restartQuiz}
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── CONDITIONNEL QUIZ ── */}
        {appMode === "conditionnel" && (
          <>
            {(conditionnel.state.phase === QuizPhase.Answering || conditionnel.state.phase === QuizPhase.Feedback) &&
              conditionnel.currentQuestion && (
                <ConditionnelQuizCard
                  question={conditionnel.currentQuestion}
                  answerState={conditionnel.state.answerState}
                  selectedIndex={conditionnel.state.selectedIndex}
                  onSelect={conditionnel.selectAnswer}
                  onNext={conditionnel.nextQuestion}
                  questionNumber={conditionnel.progress.index + 1}
                  total={conditionnel.progress.total}
                />
              )}
            {conditionnel.state.phase === QuizPhase.Complete && (
              <ResultScreen
                history={conditionnel.state.history}
                score={conditionnel.state.score}
                total={conditionnel.progress.total}
                onRestart={conditionnel.restartQuiz}
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── ORTHOGRAPHE QUIZ ── */}
        {appMode === "orthographe" && (
          <>
            {(orthographe.state.phase === QuizPhase.Answering || orthographe.state.phase === QuizPhase.Feedback) &&
              orthographe.currentQuestion && (
                <OrthographeQuizCard
                  question={orthographe.currentQuestion}
                  answerState={orthographe.state.answerState}
                  selectedIndex={orthographe.state.selectedIndex}
                  onSelect={orthographe.selectAnswer}
                  onNext={orthographe.nextQuestion}
                  questionNumber={orthographe.progress.index + 1}
                  total={orthographe.progress.total}
                />
              )}
            {orthographe.state.phase === QuizPhase.Complete && (
              <OrthographeResultScreen
                history={orthographe.state.history}
                score={orthographe.state.score}
                total={orthographe.progress.total}
                onRestart={orthographe.restartQuiz}
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── PRÉSENT QUIZ ── */}
        {appMode === "présent" && (
          <>
            {(présent.state.phase === QuizPhase.Answering || présent.state.phase === QuizPhase.Feedback) &&
              présent.currentQuestion && (
                <PresentQuizCard
                  question={présent.currentQuestion}
                  answerState={présent.state.answerState}
                  selectedIndex={présent.state.selectedIndex}
                  onSelect={présent.selectAnswer}
                  onNext={présent.nextQuestion}
                  questionNumber={présent.progress.index + 1}
                  total={présent.progress.total}
                />
              )}
            {présent.state.phase === QuizPhase.Complete && (
              <ResultScreen
                history={présent.state.history.map((e) => ({
                  verb: e.question.verb,
                  picked: e.picked,
                  correct: e.correct,
                }))}
                score={présent.state.score}
                total={présent.progress.total}
                onRestart={présent.restartQuiz}
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── ÉCRIT QUIZ ── */}
        {appMode === "écrit" && (
          <>
            {(écrit.state.phase === QuizPhase.Answering || écrit.state.phase === QuizPhase.Feedback) &&
              écrit.currentQuestion && (
                <OrthographeQuizCard
                  question={écrit.currentQuestion}
                  answerState={écrit.state.answerState}
                  selectedIndex={écrit.state.selectedIndex}
                  onSelect={écrit.selectAnswer}
                  onNext={écrit.nextQuestion}
                  questionNumber={écrit.progress.index + 1}
                  total={écrit.progress.total}
                  label="Lettre formelle — complétez l'expression"
                />
              )}
            {écrit.state.phase === QuizPhase.Complete && (
              <OrthographeResultScreen
                history={écrit.state.history}
                score={écrit.state.score}
                total={écrit.progress.total}
                onRestart={écrit.restartQuiz}
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── PATTERNS ── */}
        {appMode === "patterns" && (
          <>
            {flashcards.state.phase === "session" && flashcards.currentCard && (
              <FlashcardView
                card={flashcards.currentCard}
                revealed={flashcards.state.revealed}
                index={flashcards.progress.index}
                total={flashcards.progress.total}
                onReveal={flashcards.reveal}
                onRate={flashcards.rate}
              />
            )}
            {flashcards.state.phase === "complete" && (
              <FlashcardResults
                sessionResults={flashcards.state.sessionResults}
                masteredCount={flashcards.masteredCount}
                totalCards={flashcards.totalCards}
                onRestart={flashcards.restart}
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── ORAL QUIZ ── */}
        {appMode === "oral" && (
          <>
            {(oral.state.phase === QuizPhase.Answering || oral.state.phase === QuizPhase.Feedback) &&
              oral.currentQuestion && (
                <OrthographeQuizCard
                  question={oral.currentQuestion}
                  answerState={oral.state.answerState}
                  selectedIndex={oral.state.selectedIndex}
                  onSelect={oral.selectAnswer}
                  onNext={oral.nextQuestion}
                  questionNumber={oral.progress.index + 1}
                  total={oral.progress.total}
                  label="Expression orale — complétez la phrase"
                />
              )}
            {oral.state.phase === QuizPhase.Complete && (
              <OrthographeResultScreen
                history={oral.state.history}
                score={oral.state.score}
                total={oral.progress.total}
                onRestart={oral.restartQuiz}
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── PHRASES QUIZ ── */}
        {appMode === "phrases" && (
          <>
            {(phrases.state.phase === QuizPhase.Answering || phrases.state.phase === QuizPhase.Feedback) &&
              phrases.currentQuestion && (
                <OrthographeQuizCard
                  question={phrases.currentQuestion}
                  answerState={phrases.state.answerState}
                  selectedIndex={phrases.state.selectedIndex}
                  onSelect={phrases.selectAnswer}
                  onNext={phrases.nextQuestion}
                  questionNumber={phrases.progress.index + 1}
                  total={phrases.progress.total}
                  label="Complétez avec la bonne expression"
                />
              )}
            {phrases.state.phase === QuizPhase.Complete && (
              <OrthographeResultScreen
                history={phrases.state.history}
                score={phrases.state.score}
                total={phrases.progress.total}
                onRestart={phrases.restartQuiz}
                onHome={handleGoHome}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
