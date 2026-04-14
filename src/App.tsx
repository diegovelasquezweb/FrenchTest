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
import { FLASHCARDS } from "./data/flashcards";
import { VOCABULAIRE_CARDS } from "./data/vocabulaireCards";
import { TOURISTE_CARDS } from "./data/touristeCards";
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
import { PatternsCategoryPicker } from "./components/PatternsCategoryPicker";
import type { PatternsCategory } from "./components/PatternsCategoryPicker";
import { ThemeToggle } from "./components/ThemeToggle";

const QUESTION_COUNT = 10;

type AppMode = "home" | "participe" | "imparfait" | "conditionnel" | "futur" | "orthographe" | "phrases" | "présent" | "écrit" | "oral" | "patterns" | "vocabulaire" | "touriste";

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
  vocabulaire: "Vocabulaire",
  touriste: "Touriste",
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
  const flashcards = useFlashcards(FLASHCARDS, "tef-flashcard-progress");
  const pArgumenter   = useFlashcards(FLASHCARDS.filter(c => c.category === "argumentation"), "tef-p-argumenter");
  const pConnecteurs  = useFlashcards(FLASHCARDS.filter(c => c.category === "connecteurs"),   "tef-p-connecteurs");
  const pOralAppels   = useFlashcards(FLASHCARDS.filter(c => c.category === "oral"),          "tef-p-oral-appels");
  const pOralDebat    = useFlashcards(FLASHCARDS.filter(c => c.category === "argumentation"), "tef-p-oral-debat");
  const pEcritIntro   = useFlashcards(FLASHCARDS.filter(c => c.category === "écrit-intro"),   "tef-p-ecrit-intro");
  const pEcritCorps   = useFlashcards(FLASHCARDS.filter(c => c.category === "écrit-corps"),   "tef-p-ecrit-corps");
  const vocabulaire = useFlashcards(VOCABULAIRE_CARDS, "tef-vocabulaire-progress");
  const touriste = useFlashcards(TOURISTE_CARDS, "tef-touriste-progress");

  const [patternsCategory, setPatternsCategory] = useState<PatternsCategory | null>(null);

  const activeDeck =
    patternsCategory === "argumenter"  ? pArgumenter  :
    patternsCategory === "connecteurs" ? pConnecteurs  :
    patternsCategory === "oral-appels" ? pOralAppels   :
    patternsCategory === "oral-debat"  ? pOralDebat    :
    patternsCategory === "ecrit-intro" ? pEcritIntro   :
    patternsCategory === "ecrit-corps" ? pEcritCorps   :
    flashcards;

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

      if (appMode === "patterns") {
        if (activeDeck.state.phase === "session") {
          if (e.key === "1") activeDeck.rate(0);
          if (e.key === "2") activeDeck.rate(1);
          if (e.key === "3") activeDeck.rate(2);
          if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); activeDeck.skip(); }
          if (e.key === "ArrowLeft") activeDeck.back();
        }
      }

      if (appMode === "vocabulaire") {
        if (vocabulaire.state.phase === "session") {
          if (e.key === "1") vocabulaire.rate(0);
          if (e.key === "2") vocabulaire.rate(1);
          if (e.key === "3") vocabulaire.rate(2);
          if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); vocabulaire.skip(); }
          if (e.key === "ArrowLeft") vocabulaire.back();
        }
      }

      if (appMode === "touriste") {
        if (touriste.state.phase === "session") {
          if (e.key === "1") touriste.rate(0);
          if (e.key === "2") touriste.rate(1);
          if (e.key === "3") touriste.rate(2);
          if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); touriste.skip(); }
          if (e.key === "ArrowLeft") touriste.back();
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
    if (appMode === "patterns") { activeDeck.goHome(); setPatternsCategory(null); }
    if (appMode === "vocabulaire") vocabulaire.goHome();
    if (appMode === "touriste") touriste.goHome();
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
    setPatternsCategory(null);
    setAppMode("patterns");
  }

  function handleSelectPatternsCategory(cat: PatternsCategory) {
    setPatternsCategory(cat);
    const deck =
      cat === "argumenter"  ? pArgumenter  :
      cat === "connecteurs" ? pConnecteurs  :
      cat === "oral-appels" ? pOralAppels   :
      cat === "oral-debat"  ? pOralDebat    :
      cat === "ecrit-intro" ? pEcritIntro   :
      cat === "ecrit-corps" ? pEcritCorps   :
      flashcards;
    deck.startSession();
  }

  function handleStartVocabulaire() {
    vocabulaire.startSession();
    setAppMode("vocabulaire");
  }

  function handleStartTouriste() {
    touriste.startSession();
    setAppMode("touriste");
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
          {(appMode === "patterns" || appMode === "vocabulaire" || appMode === "touriste") && (() => {
            const deck = appMode === "patterns" ? activeDeck : appMode === "vocabulaire" ? vocabulaire : touriste;
            if (appMode === "patterns" && patternsCategory === null) return null;
            return (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-(--color-muted)">
                  <span className="font-semibold text-(--color-ink)">{deck.masteredCount}</span>
                  <span> / {deck.totalCards} dominées</span>
                </p>
                <button
                  type="button"
                  onClick={deck.reset}
                  className="text-xs text-(--color-muted) underline underline-offset-2 transition-colors duration-150 hover:text-red-500"
                >
                  Réinitialiser
                </button>
              </div>
            );
          })()}
        </header>
      )}

      <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        {/* ── HOME ── */}
        {appMode === "home" && (
          <div className="mx-auto w-full max-w-4xl flex flex-col gap-6 px-1 sm:px-0">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-(--color-ink) sm:text-4xl">
                🇨🇦&nbsp;Le TEFinateur&nbsp;3000
              </h1>
              <p className="mt-2 text-sm text-(--color-muted)">
                Préparez votre TEF. Ou commencez à faire vos valises. Bonne chance.
              </p>
            </div>
          <div className="flex flex-col gap-6">
            {([
              {
                heading: "Quiz",
                items: [
                  { icon: "🔀", color: "bg-violet-100 dark:bg-violet-900/30",   label: "Conditionnel",     sub: "Conjuguer par sujet",    onClick: handleStartConditionnel },
                  { icon: "🔗", color: "bg-blue-100 dark:bg-blue-900/30",       label: "Connecteurs",      sub: "Expressions du TEF",     onClick: handleStartPhrases },
                  { icon: "✉️", color: "bg-emerald-100 dark:bg-emerald-900/30", label: "Écrit formel",     sub: "Lettres & expressions",  onClick: handleStartEcrit },
                  { icon: "🎤", color: "bg-rose-100 dark:bg-rose-900/30",       label: "Expression orale", sub: "Poser des questions",    onClick: handleStartOral },
                  { icon: "🔮", color: "bg-indigo-100 dark:bg-indigo-900/30",   label: "Futur simple",     sub: "Conjuguer par sujet",    onClick: handleStartFutur },
                  { icon: "✏️", color: "bg-amber-100 dark:bg-amber-900/30",     label: "Grammaire",        sub: "Corriger les erreurs",   onClick: handleStartOrthographe },
                  { icon: "🕰️", color: "bg-orange-100 dark:bg-orange-900/30",   label: "Imparfait",        sub: "Conjuguer par sujet",    onClick: handleStartImparfait },
                  { icon: "✅", color: "bg-green-100 dark:bg-green-900/30",     label: "Participe passé",  sub: "Identifier la forme",    onClick: handleStartParticipe },
                  { icon: "⚡", color: "bg-yellow-100 dark:bg-yellow-900/30",   label: "Présent",          sub: "Conjuguer par sujet",    onClick: handleStartPresent },
                ],
              },
              {
                heading: "Flashcards",
                items: [
                  { icon: "🃏", color: "bg-pink-100 dark:bg-pink-900/30",       label: "Patterns",         sub: "Mémoriser les phrases",  onClick: handleStartPatterns },
                  { icon: "🧳", color: "bg-cyan-100 dark:bg-cyan-900/30",       label: "Touriste",         sub: "Phrases de voyage",      onClick: handleStartTouriste },
                  { icon: "📚", color: "bg-lime-100 dark:bg-lime-900/30",       label: "Vocabulaire",      sub: "Antonymes & paires",     onClick: handleStartVocabulaire },
                ],
              },
            ] as const).map(({ heading, items }) => (
              <div key={heading}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-(--color-muted)">{heading}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {items.map(({ icon, color, label, sub, onClick }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      className="group flex flex-col items-start gap-3 rounded-2xl bg-(--color-surface) p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${color}`}>
                        {icon}
                      </span>
                      <span className="text-left">
                        <span className="block text-sm font-semibold text-(--color-ink)">{label}</span>
                        <span className="block text-xs text-(--color-muted) leading-snug mt-0.5">{sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
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
            {patternsCategory === null && (
              <PatternsCategoryPicker
                options={[
                  { id: "argumenter",  icon: "💬", color: "bg-orange-100 dark:bg-orange-900/30",  label: "Argumenter",     sub: "Défendre une idée",       totalCards: pArgumenter.totalCards,  masteredCount: pArgumenter.masteredCount,  onSelect: () => handleSelectPatternsCategory("argumenter")  },
                  { id: "connecteurs", icon: "🔗", color: "bg-violet-100 dark:bg-violet-900/30",  label: "Connecteurs",    sub: "Articuler le discours",   totalCards: pConnecteurs.totalCards, masteredCount: pConnecteurs.masteredCount, onSelect: () => handleSelectPatternsCategory("connecteurs") },
                  { id: "oral-appels", icon: "📞", color: "bg-blue-100 dark:bg-blue-900/30",      label: "Oral — Appels",  sub: "Partie 1 · Téléphone",    totalCards: pOralAppels.totalCards,  masteredCount: pOralAppels.masteredCount,  onSelect: () => handleSelectPatternsCategory("oral-appels")  },
                  { id: "oral-debat",  icon: "🎙️", color: "bg-rose-100 dark:bg-rose-900/30",     label: "Oral — Débat",   sub: "Partie 2 · Développer",   totalCards: pOralDebat.totalCards,   masteredCount: pOralDebat.masteredCount,   onSelect: () => handleSelectPatternsCategory("oral-debat")   },
                  { id: "ecrit-intro", icon: "📝", color: "bg-emerald-100 dark:bg-emerald-900/30", label: "Écrit — Intro",  sub: "Ouverture & corps",       totalCards: pEcritIntro.totalCards,  masteredCount: pEcritIntro.masteredCount,  onSelect: () => handleSelectPatternsCategory("ecrit-intro")  },
                  { id: "ecrit-corps", icon: "📄", color: "bg-teal-100 dark:bg-teal-900/30",      label: "Écrit — Corps",  sub: "Plaintes & demandes",     totalCards: pEcritCorps.totalCards,  masteredCount: pEcritCorps.masteredCount,  onSelect: () => handleSelectPatternsCategory("ecrit-corps")  },
                  { id: "all",         icon: "🃏", color: "bg-pink-100 dark:bg-pink-900/30",      label: "Tout",           sub: "Les 100 phrases ensemble", totalCards: flashcards.totalCards,   masteredCount: flashcards.masteredCount,   onSelect: () => handleSelectPatternsCategory("all")          },
                ]}
              />
            )}
            {patternsCategory !== null && activeDeck.state.phase === "session" && activeDeck.currentCard && (
              <FlashcardView
                card={activeDeck.currentCard}
                index={activeDeck.progress.index}
                total={activeDeck.progress.total}
                canGoBack={activeDeck.progress.index > 0}
                onRate={activeDeck.rate}
                onBack={activeDeck.back}
                onSkip={activeDeck.skip}
              />
            )}
            {patternsCategory !== null && activeDeck.state.phase === "complete" && (
              <FlashcardResults
                sessionResults={activeDeck.state.sessionResults}
                masteredCount={activeDeck.masteredCount}
                totalCards={activeDeck.totalCards}
                onRestart={activeDeck.restart}
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── VOCABULAIRE ── */}
        {appMode === "vocabulaire" && (
          <>
            {vocabulaire.state.phase === "session" && vocabulaire.currentCard && (
              <FlashcardView
                card={vocabulaire.currentCard}
                index={vocabulaire.progress.index}
                total={vocabulaire.progress.total}
                canGoBack={vocabulaire.progress.index > 0}
                onRate={vocabulaire.rate}
                onBack={vocabulaire.back}
                onSkip={vocabulaire.skip}
              />
            )}
            {vocabulaire.state.phase === "complete" && (
              <FlashcardResults
                sessionResults={vocabulaire.state.sessionResults}
                masteredCount={vocabulaire.masteredCount}
                totalCards={vocabulaire.totalCards}
                onRestart={vocabulaire.restart}
                onHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* ── TOURISTE ── */}
        {appMode === "touriste" && (
          <>
            {touriste.state.phase === "session" && touriste.currentCard && (
              <FlashcardView
                card={touriste.currentCard}
                index={touriste.progress.index}
                total={touriste.progress.total}
                canGoBack={touriste.progress.index > 0}
                onRate={touriste.rate}
                onBack={touriste.back}
                onSkip={touriste.skip}
              />
            )}
            {touriste.state.phase === "complete" && (
              <FlashcardResults
                sessionResults={touriste.state.sessionResults}
                masteredCount={touriste.masteredCount}
                totalCards={touriste.totalCards}
                onRestart={touriste.restart}
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
