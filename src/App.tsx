import { useEffect, useMemo, useRef, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, ChevronRight, Star } from "lucide-react";
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
  const DEFAULT_FAVORITES = ["Participe passé"];
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("tef-favorites");
      if (stored === null) return DEFAULT_FAVORITES;
      return JSON.parse(stored) as string[];
    }
    catch { return DEFAULT_FAVORITES; }
  });

  useEffect(() => {
    localStorage.setItem("tef-favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(label: string, e: React.MouseEvent) {
    e.stopPropagation();
    setFavorites(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  }

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
  const pArgumenter       = useFlashcards(FLASHCARDS.filter(c => c.category === "argumentation"), "tef-p-argumenter");
  const pConnecteurs      = useFlashcards(FLASHCARDS.filter(c => c.category === "connecteurs"),   "tef-p-connecteurs");
  const pOralInteraction  = useFlashcards(FLASHCARDS.filter(c => c.category === "oral"),          "tef-p-oral-interaction");
  const pOralMonologue    = useFlashcards(FLASHCARDS.filter(c => c.category === "argumentation"), "tef-p-oral-monologue");
  const pEcritIntro       = useFlashcards(FLASHCARDS.filter(c => c.category === "écrit-intro"),   "tef-p-ecrit-intro");
  const pEcritCorps       = useFlashcards(FLASHCARDS.filter(c => c.category === "écrit-corps"),   "tef-p-ecrit-corps");
  const pEcritArgumentatif = useFlashcards(FLASHCARDS.filter(c => c.category === "argumentation"), "tef-p-ecrit-argumentatif");
  const vocabulaire = useFlashcards(VOCABULAIRE_CARDS, "tef-vocabulaire-progress");
  const touriste = useFlashcards(TOURISTE_CARDS, "tef-touriste-progress");

  const [patternsCategory, setPatternsCategory] = useState<PatternsCategory | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>(["favoris"]);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const activeDeck =
    patternsCategory === "argumenter"       ? pArgumenter        :
    patternsCategory === "connecteurs"      ? pConnecteurs        :
    patternsCategory === "oral-interaction" ? pOralInteraction    :
    patternsCategory === "oral-monologue"   ? pOralMonologue      :
    patternsCategory === "ecrit-intro"      ? pEcritIntro         :
    patternsCategory === "ecrit-corps"      ? pEcritCorps         :
    patternsCategory === "ecrit-argumentatif" ? pEcritArgumentatif :
    flashcards;

  const liveRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (appMode === "participe") {
        if (participe.state.phase === QuizPhase.Answering) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) participe.selectAnswer(d - 1); }
        if (participe.state.phase === QuizPhase.Feedback && e.key === "Enter") participe.nextQuestion();
      }
      if (appMode === "imparfait") {
        if (imparfait.state.phase === QuizPhase.Answering) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) imparfait.selectAnswer(d - 1); }
        if (imparfait.state.phase === QuizPhase.Feedback && e.key === "Enter") imparfait.nextQuestion();
      }
      if (appMode === "conditionnel") {
        if (conditionnel.state.phase === QuizPhase.Answering) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) conditionnel.selectAnswer(d - 1); }
        if (conditionnel.state.phase === QuizPhase.Feedback && e.key === "Enter") conditionnel.nextQuestion();
      }
      if (appMode === "futur") {
        if (futur.state.phase === QuizPhase.Answering) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) futur.selectAnswer(d - 1); }
        if (futur.state.phase === QuizPhase.Feedback && e.key === "Enter") futur.nextQuestion();
      }
      if (appMode === "orthographe") {
        if (orthographe.state.phase === QuizPhase.Answering) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) orthographe.selectAnswer(d - 1); }
        if (orthographe.state.phase === QuizPhase.Feedback && e.key === "Enter") orthographe.nextQuestion();
      }
      if (appMode === "phrases") {
        if (phrases.state.phase === QuizPhase.Answering) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) phrases.selectAnswer(d - 1); }
        if (phrases.state.phase === QuizPhase.Feedback && e.key === "Enter") phrases.nextQuestion();
      }
      if (appMode === "présent") {
        if (présent.state.phase === QuizPhase.Answering) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) présent.selectAnswer(d - 1); }
        if (présent.state.phase === QuizPhase.Feedback && e.key === "Enter") présent.nextQuestion();
      }
      if (appMode === "écrit") {
        if (écrit.state.phase === QuizPhase.Answering) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) écrit.selectAnswer(d - 1); }
        if (écrit.state.phase === QuizPhase.Feedback && e.key === "Enter") écrit.nextQuestion();
      }
      if (appMode === "patterns" && activeDeck.state.phase === "session") {
        if (e.key === "1") activeDeck.rate(0);
        if (e.key === "2") activeDeck.rate(1);
        if (e.key === "3") activeDeck.rate(2);
        if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); activeDeck.skip(); }
        if (e.key === "ArrowLeft") activeDeck.back();
      }
      if (appMode === "vocabulaire" && vocabulaire.state.phase === "session") {
        if (e.key === "1") vocabulaire.rate(0);
        if (e.key === "2") vocabulaire.rate(1);
        if (e.key === "3") vocabulaire.rate(2);
        if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); vocabulaire.skip(); }
        if (e.key === "ArrowLeft") vocabulaire.back();
      }
      if (appMode === "touriste" && touriste.state.phase === "session") {
        if (e.key === "1") touriste.rate(0);
        if (e.key === "2") touriste.rate(1);
        if (e.key === "3") touriste.rate(2);
        if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); touriste.skip(); }
        if (e.key === "ArrowLeft") touriste.back();
      }
      if (appMode === "oral") {
        if (oral.state.phase === QuizPhase.Answering) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) oral.selectAnswer(d - 1); }
        if (oral.state.phase === QuizPhase.Feedback && e.key === "Enter") oral.nextQuestion();
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

  function handleStartParticipe()    { participe.startQuiz();    setAppMode("participe"); }
  function handleStartImparfait()    { imparfait.startQuiz();    setAppMode("imparfait"); }
  function handleStartConditionnel() { conditionnel.startQuiz(); setAppMode("conditionnel"); }
  function handleStartFutur()        { futur.startQuiz();        setAppMode("futur"); }
  function handleStartOrthographe()  { orthographe.startQuiz();  setAppMode("orthographe"); }
  function handleStartPhrases()      { phrases.startQuiz();      setAppMode("phrases"); }
  function handleStartPresent()      { présent.startQuiz();      setAppMode("présent"); }
  function handleStartEcrit()        { écrit.startQuiz();        setAppMode("écrit"); }
  function handleStartOral()         { oral.startQuiz();         setAppMode("oral"); }
  function handleStartPatterns()     { handleSelectPatternsCategory("all"); }
  function handleStartVocabulaire()  { vocabulaire.startSession(); setAppMode("vocabulaire"); }
  function handleStartTouriste()     { touriste.startSession();    setAppMode("touriste"); }

  function handleSelectPatternsCategory(cat: PatternsCategory) {
    setPatternsCategory(cat);
    setAppMode("patterns");
    const deck =
      cat === "argumenter"         ? pArgumenter         :
      cat === "connecteurs"        ? pConnecteurs         :
      cat === "oral-interaction"   ? pOralInteraction     :
      cat === "oral-monologue"     ? pOralMonologue       :
      cat === "ecrit-intro"        ? pEcritIntro          :
      cat === "ecrit-corps"        ? pEcritCorps          :
      cat === "ecrit-argumentatif" ? pEcritArgumentatif   :
      flashcards;
    deck.startSession();
  }

  const activePhase =
    appMode === "participe"   ? participe.state.phase
    : appMode === "imparfait"   ? imparfait.state.phase
    : appMode === "conditionnel"? conditionnel.state.phase
    : appMode === "futur"       ? futur.state.phase
    : appMode === "orthographe" ? orthographe.state.phase
    : appMode === "phrases"     ? phrases.state.phase
    : appMode === "présent"     ? présent.state.phase
    : appMode === "écrit"       ? écrit.state.phase
    : appMode === "oral"        ? oral.state.phase
    : QuizPhase.Idle;

  const activeProgress =
    appMode === "participe"   ? participe.progress
    : appMode === "imparfait"   ? imparfait.progress
    : appMode === "conditionnel"? conditionnel.progress
    : appMode === "futur"       ? futur.progress
    : appMode === "orthographe" ? orthographe.progress
    : appMode === "phrases"     ? phrases.progress
    : appMode === "présent"     ? présent.progress
    : appMode === "écrit"       ? écrit.progress
    : appMode === "oral"        ? oral.progress
    : { index: 0, total: 0 };

  const activeScore =
    appMode === "participe"   ? participe.state.score
    : appMode === "imparfait"   ? imparfait.state.score
    : appMode === "conditionnel"? conditionnel.state.score
    : appMode === "futur"       ? futur.state.score
    : appMode === "orthographe" ? orthographe.state.score
    : appMode === "phrases"     ? phrases.state.score
    : appMode === "présent"     ? présent.state.score
    : appMode === "écrit"       ? écrit.state.score
    : oral.state.score;

  const showScoreBoard = appMode !== "home" && (activePhase === QuizPhase.Answering || activePhase === QuizPhase.Feedback);

  // ── Suggestion cards (desktop home) ──────────────────────────────────────
  const ALL_SUGGESTIONS = [
    { label: "Conditionnel",        sub: "Conjuguer par sujet",     icon: "📝", onClick: handleStartConditionnel },
    { label: "Futur simple",        sub: "Conjuguer par sujet",     icon: "📝", onClick: handleStartFutur },
    { label: "Grammaire",           sub: "Corriger les erreurs",    icon: "📝", onClick: handleStartOrthographe },
    { label: "Imparfait",           sub: "Conjuguer par sujet",     icon: "📝", onClick: handleStartImparfait },
    { label: "Participe passé",     sub: "Identifier la forme",     icon: "📝", onClick: handleStartParticipe },
    { label: "Présent",             sub: "Conjuguer par sujet",     icon: "📝", onClick: handleStartPresent },
    { label: "Connecteurs",         sub: "Expressions du TEF",      icon: "📝", onClick: handleStartPhrases },
    { label: "Écrit formel",        sub: "Lettres & expressions",   icon: "📝", onClick: handleStartEcrit },
    { label: "Expression orale",    sub: "Poser des questions",     icon: "📝", onClick: handleStartOral },
    { label: "Patterns — Tout",     sub: "100 phrases clés",        icon: "🃏", onClick: handleStartPatterns },
    { label: "Vocabulaire",         sub: "Antonymes & paires",      icon: "🃏", onClick: handleStartVocabulaire },
    { label: "Touriste",            sub: "Phrases de voyage",       icon: "🃏", onClick: handleStartTouriste },
  ];
  const suggestions = useMemo(() => {
    const shuffled = [...ALL_SUGGESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  // re-shuffle every time the user returns to home
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appMode]);

  // ── Nav data ──────────────────────────────────────────────────────────────
  const SIDEBAR_LOOKUP: Record<string, { mode: Exclude<AppMode, "home">; onClick: () => void; icon: string }> = {
    "Conditionnel":     { mode: "conditionnel", onClick: handleStartConditionnel, icon: "📝" },
    "Connecteurs":      { mode: "phrases",       onClick: handleStartPhrases,      icon: "📝" },
    "Écrit formel":     { mode: "écrit",         onClick: handleStartEcrit,        icon: "📝" },
    "Expression orale": { mode: "oral",          onClick: handleStartOral,         icon: "📝" },
    "Futur simple":     { mode: "futur",         onClick: handleStartFutur,        icon: "📝" },
    "Grammaire":        { mode: "orthographe",   onClick: handleStartOrthographe,  icon: "📝" },
    "Imparfait":        { mode: "imparfait",     onClick: handleStartImparfait,    icon: "📝" },
    "Participe passé":  { mode: "participe",     onClick: handleStartParticipe,    icon: "📝" },
    "Présent":          { mode: "présent",       onClick: handleStartPresent,      icon: "📝" },
    "Vocabulaire":            { mode: "vocabulaire", onClick: handleStartVocabulaire,                                   icon: "🃏" },
    "Touriste":               { mode: "touriste",    onClick: handleStartTouriste,                                      icon: "🃏" },
    "Patterns — Argumenter":            { mode: "patterns", onClick: () => handleSelectPatternsCategory("argumenter"),         icon: "🃏" },
    "Patterns — Connecteurs":           { mode: "patterns", onClick: () => handleSelectPatternsCategory("connecteurs"),        icon: "🃏" },
    "Patterns — Oral — Interaction":    { mode: "patterns", onClick: () => handleSelectPatternsCategory("oral-interaction"),   icon: "🃏" },
    "Patterns — Oral — Monologue":      { mode: "patterns", onClick: () => handleSelectPatternsCategory("oral-monologue"),     icon: "🃏" },
    "Patterns — Écrit — Lettre":        { mode: "patterns", onClick: () => handleSelectPatternsCategory("ecrit-intro"),        icon: "🃏" },
    "Patterns — Écrit — Clôture":       { mode: "patterns", onClick: () => handleSelectPatternsCategory("ecrit-corps"),        icon: "🃏" },
    "Patterns — Écrit — Argumentatif":  { mode: "patterns", onClick: () => handleSelectPatternsCategory("ecrit-argumentatif"), icon: "🃏" },
    "Patterns — Tout":                  { mode: "patterns", onClick: () => handleSelectPatternsCategory("all"),                icon: "🃏" },
  };

  // ── Flashcard header helper ───────────────────────────────────────────────
  function FlashcardHeader() {
    const deck = appMode === "patterns" ? activeDeck : appMode === "vocabulaire" ? vocabulaire : touriste;
    if (appMode === "patterns" && patternsCategory === null) return null;
    return (
      <div className="flex items-center gap-6">
        <p className="text-sm text-(--color-muted)">
          <span className="font-semibold text-(--color-ink)">{deck.masteredCount}</span> / {deck.totalCards} dominées
        </p>
        <button type="button" onClick={deck.reset} className="text-xs text-(--color-muted) underline underline-offset-2 hover:text-red-500 transition-colors duration-150">
          Réinitialiser
        </button>
      </div>
    );
  }

  const isFlashcardMode = appMode === "patterns" || appMode === "vocabulaire" || appMode === "touriste";

  return (
    <div className="flex h-dvh overflow-hidden bg-(--color-bg)">

      {/* ── SIDEBAR (desktop only) ─────────────────────────────────────────── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-(--color-ink)/8 bg-(--color-surface)">
        <div className="px-5 py-5 border-b border-(--color-ink)/8">
          <button type="button" onClick={handleGoHome} className="text-xl font-extrabold tracking-tight text-(--color-ink) hover:text-(--color-brand) transition-colors duration-150 text-left">🇨🇦 TEF Pratiquer</button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1" aria-label="Navigation">
          {([
            {
              id: "favoris",
              label: "Favoris",
              items: [] as { label: string; mode: Exclude<AppMode, "home">; onClick: () => void }[],
              special: "favoris" as const,
            },
            {
              id: "conjugaison",
              label: "Conjugaison & Grammaire",
              items: [
                { label: "Conditionnel",     mode: "conditionnel" as const, onClick: handleStartConditionnel },
                { label: "Futur simple",     mode: "futur"        as const, onClick: handleStartFutur },
                { label: "Grammaire",        mode: "orthographe"  as const, onClick: handleStartOrthographe },
                { label: "Imparfait",        mode: "imparfait"    as const, onClick: handleStartImparfait },
                { label: "Participe passé",  mode: "participe"    as const, onClick: handleStartParticipe },
                { label: "Présent",          mode: "présent"      as const, onClick: handleStartPresent },
              ],
            },
            {
              id: "tef-prep",
              label: "Préparation TEF",
              items: [
                { label: "Connecteurs",      mode: "phrases" as const, onClick: handleStartPhrases },
                { label: "Écrit formel",     mode: "écrit"   as const, onClick: handleStartEcrit },
                { label: "Expression orale", mode: "oral"    as const, onClick: handleStartOral },
              ],
            },
            {
              id: "flashcards",
              label: "Flashcards",
              items: [
                { label: "Vocabulaire", mode: "vocabulaire" as const, onClick: handleStartVocabulaire },
                { label: "Touriste",    mode: "touriste"    as const, onClick: handleStartTouriste },
              ],
              special: "patterns",
            },
          ] as const).map(group => {
            const isOpen = openGroups.includes(group.id);
            const toggleGroup = () => setOpenGroups(prev =>
              prev.includes(group.id) ? prev.filter(g => g !== group.id) : [...prev, group.id]
            );
            const isPatternsOpen = openItems.includes("patterns");
            const togglePatterns = (e: React.MouseEvent) => {
              e.stopPropagation();
              setOpenItems(prev =>
                prev.includes("patterns") ? prev.filter(i => i !== "patterns") : [...prev, "patterns"]
              );
            };

            if (group.id === "favoris" && favorites.length === 0) return null;

            return (
              <div key={group.id}>
                {/* Group header */}
                <button
                  type="button"
                  onClick={toggleGroup}
                  className="w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors duration-150 hover:bg-(--color-ink)/5 group"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-(--color-muted) group-hover:text-(--color-ink) transition-colors">{group.label}</span>
                  {isOpen ? <ChevronDown size={16} className="text-(--color-muted) transition-transform duration-200" /> : <ChevronRight size={16} className="text-(--color-muted) transition-transform duration-200" />}
                </button>

                {/* Items */}
                {isOpen && (
                  <div className="mt-0.5 mb-2 flex flex-col gap-0.5">
                    {/* Favoris items */}
                    {"special" in group && group.special === "favoris" && favorites.map(label => {
                      const item = SIDEBAR_LOOKUP[label];
                      if (!item) return null;
                      const isActive = appMode === item.mode;
                      return (
                        <div key={label} className="group/item relative">
                          <button
                            type="button"
                            onClick={item.onClick}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 pr-8 rounded text-left text-sm font-medium transition-colors duration-150 ${
                              isActive ? "bg-(--color-brand)/10 text-(--color-brand)" : "text-(--color-muted) hover:bg-(--color-ink)/6 hover:text-(--color-ink)"
                            }`}
                          >
                            <span className="text-sm shrink-0 grayscale opacity-50">{item.icon}</span>
                            {label}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(label, e)}
                            aria-label={`Retirer ${label} des favoris`}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-400"
                          >
                            <Star size={13} fill="currentColor" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Patterns special item (Flashcards group only) */}
                    {"special" in group && group.special === "patterns" && (
                      <div>
                        <div className="group/pat relative">
                          <button
                            type="button"
                            onClick={togglePatterns}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-sm font-medium transition-colors duration-150 ${
                              appMode === "patterns" ? "bg-(--color-brand)/10 text-(--color-brand)" : "text-(--color-muted) hover:bg-(--color-ink)/6 hover:text-(--color-ink)"
                            }`}
                          >
                            <span className="text-sm shrink-0 grayscale opacity-50">🃏</span>
                            <span className="flex-1">Patterns</span>
                            {isPatternsOpen ? <ChevronDown size={14} className="text-(--color-muted)" /> : <ChevronRight size={14} className="text-(--color-muted)" />}
                          </button>
                        </div>
                        {isPatternsOpen && (
                          <div className="ml-5 mt-0.5 flex flex-col gap-0.5">
                            {([
                              { label: "Argumenter",               cat: "argumenter"         },
                              { label: "Connecteurs",              cat: "connecteurs"        },
                              { label: "Oral — Interaction",       cat: "oral-interaction"   },
                              { label: "Oral — Monologue",         cat: "oral-monologue"     },
                              { label: "Écrit — Lettre",           cat: "ecrit-intro"        },
                              { label: "Écrit — Clôture",          cat: "ecrit-corps"        },
                              { label: "Écrit — Argumentatif",     cat: "ecrit-argumentatif" },
                              { label: "Tout",                     cat: "all"                },
                            ] as const).map(({ label, cat }) => {
                              const favKey = `Patterns — ${label}`;
                              const isFav = favorites.includes(favKey);
                              return (
                                <div key={cat} className="group/psub relative">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectPatternsCategory(cat)}
                                    className={`w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150 pr-7 ${
                                      appMode === "patterns" && patternsCategory === cat
                                        ? "bg-(--color-brand)/10 text-(--color-brand)"
                                        : "text-(--color-muted) hover:text-(--color-ink) hover:bg-(--color-ink)/5"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => toggleFavorite(favKey, e)}
                                    aria-label={isFav ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`}
                                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 transition-all duration-150 ${isFav ? "text-amber-400" : "opacity-0 group-hover/psub:opacity-60 text-(--color-muted)"}`}
                                  >
                                    <Star size={13} fill={isFav ? "currentColor" : "none"} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Regular items */}
                    {group.items.map(({ label, mode, onClick }) => {
                      const isActive = appMode === mode;
                      const isFav = favorites.includes(label);
                      return (
                        <div key={label} className="group/item relative">
                          <button
                            type="button"
                            onClick={onClick}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-sm font-medium transition-colors duration-150 ${
                              isActive ? "bg-(--color-brand)/10 text-(--color-brand)" : "text-(--color-muted) hover:bg-(--color-ink)/6 hover:text-(--color-ink)"
                            }`}
                          >
                            <span className="text-sm shrink-0 grayscale opacity-50">
                              {group.id === "flashcards" ? "🃏" : "📝"}
                            </span>
                            {label}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(label, e)}
                            aria-label={isFav ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-150 ${isFav ? "text-amber-400" : "opacity-0 group-hover/item:opacity-60 text-(--color-muted)"}`}
                          >
                            <Star size={13} fill={isFav ? "currentColor" : "none"} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-(--color-ink)/8 flex items-center justify-between">
          <span className="text-xs text-(--color-muted)">TEF Canada.</span>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </aside>

      {/* ── RIGHT COLUMN ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-(--color-ink)/8 bg-(--color-surface) px-4 py-3">
          {appMode !== "home" ? (
            <button type="button" onClick={handleGoHome} className="text-sm font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors duration-150">
              ← Accueil
            </button>
          ) : (
            <button type="button" onClick={handleGoHome} className="text-sm font-bold text-(--color-ink) hover:text-(--color-brand) transition-colors duration-150">🇨🇦 TEF Pratiquer</button>
          )}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        {/* Desktop header — quiz/flashcard only */}
        {appMode !== "home" && (
          <header className="hidden md:flex items-center justify-between gap-4 border-b border-(--color-ink)/8 bg-(--color-surface) px-6 py-3">
            <span className="text-sm font-semibold text-(--color-ink) shrink-0">{MODE_LABEL[appMode]}</span>
            {showScoreBoard && <ScoreBoard score={activeScore} index={activeProgress.index} total={activeProgress.total} />}
            {isFlashcardMode && <FlashcardHeader />}
          </header>
        )}

        {/* Mobile quiz header */}
        {appMode !== "home" && (showScoreBoard || isFlashcardMode) && (
          <header className="md:hidden border-b border-(--color-ink)/8 bg-(--color-surface) px-4 py-3 flex flex-col gap-2">
            {showScoreBoard && <ScoreBoard score={activeScore} index={activeProgress.index} total={activeProgress.total} />}
            {isFlashcardMode && <FlashcardHeader />}
          </header>
        )}

        <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</div>

        {/* ── SCROLLABLE CONTENT ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto flex flex-col">

          {/* HOME */}
          {appMode === "home" && (
            <div className="flex flex-col flex-1">
              {/* Desktop: suggestion cards */}
              <div className="hidden md:flex h-full flex-col items-center justify-center gap-8 px-10 py-12">
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="text-5xl">🎯</span>
                  <p className="text-base font-semibold text-(--color-ink)">Prêt à pratiquer ?</p>
                  <p className="text-sm text-(--color-muted)">Quelques suggestions pour commencer.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
                  {suggestions.map(({ label, sub, icon, onClick }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      className="flex flex-col items-start gap-2 rounded bg-(--color-surface) p-4 shadow-sm text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
                    >
                      <span className="text-xl grayscale opacity-60">{icon}</span>
                      <span className="text-sm font-semibold text-(--color-ink) leading-tight">{label}</span>
                      <span className="text-xs text-(--color-muted)">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: accordion */}
              <div className="md:hidden flex-1 flex flex-col items-center justify-center gap-6 px-6 py-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="text-5xl">🎯</span>
                  <p className="text-base font-semibold text-(--color-ink)">Prêt à pratiquer ?</p>
                  <p className="text-sm text-(--color-muted)">Choisissez un exercice ci-dessous.</p>
                </div>

                {/* Favoris mobile */}
                {favorites.length > 0 && (
                  <div className="w-full">
                    <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-(--color-muted)">Favoris</p>
                    <div className="rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
                      {favorites.map(label => {
                        const item = SIDEBAR_LOOKUP[label];
                        if (!item) return null;
                        return (
                          <div key={label} className="relative border-t border-(--color-ink)/8 first:border-t-0">
                            <button
                              type="button"
                              onClick={item.onClick}
                              className="flex w-full items-center px-4 py-3 pr-12 text-left text-sm font-medium text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
                            >
                              {label}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(label, e)}
                              aria-label={`Retirer ${label} des favoris`}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-amber-400"
                            >
                              <Star size={14} fill="currentColor" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Accordion.Root type="multiple" className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
                  {([
                    {
                      id: "conjugaison",
                      label: "Conjugaison & Grammaire",
                      items: [
                        { label: "Conditionnel",    onClick: handleStartConditionnel },
                        { label: "Futur simple",    onClick: handleStartFutur },
                        { label: "Grammaire",       onClick: handleStartOrthographe },
                        { label: "Imparfait",       onClick: handleStartImparfait },
                        { label: "Participe passé", onClick: handleStartParticipe },
                        { label: "Présent",         onClick: handleStartPresent },
                      ],
                    },
                    {
                      id: "tef",
                      label: "Préparation TEF",
                      items: [
                        { label: "Connecteurs",      onClick: handleStartPhrases },
                        { label: "Écrit formel",     onClick: handleStartEcrit },
                        { label: "Expression orale", onClick: handleStartOral },
                      ],
                    },
                    {
                      id: "flashcards",
                      label: "Flashcards",
                      items: [
                        { label: "Touriste",    onClick: handleStartTouriste },
                        { label: "Vocabulaire", onClick: handleStartVocabulaire },
                      ],
                    },
                  ]).map((section, si) => (
                    <Accordion.Item key={section.id} value={section.id} className={si > 0 ? "border-t border-(--color-ink)/8" : ""}>
                      <Accordion.Header>
                        <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-(--color-muted) transition-colors hover:text-(--color-ink) data-[state=open]:text-(--color-ink)">
                          {section.label}
                          <ChevronDown size={15} className="text-(--color-muted) transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="overflow-hidden data-[state=open]:animate-none">
                        <div className="flex flex-col pb-2">
                          {section.items.map(({ label, onClick }) => {
                            const isFav = favorites.includes(label);
                            return (
                              <div key={label} className="relative">
                                <button type="button" onClick={onClick} className="w-full px-4 py-3 pr-12 text-left text-sm font-medium text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15">
                                  {label}
                                </button>
                                <button type="button" onClick={(e) => toggleFavorite(label, e)} aria-label={isFav ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-opacity ${isFav ? "text-amber-400" : "text-(--color-muted)"}`}>
                                  <Star size={14} fill={isFav ? "currentColor" : "none"} />
                                </button>
                              </div>
                            );
                          })}

                          {/* Patterns nested submenu — only in Flashcards */}
                          {section.id === "flashcards" && (
                            <Accordion.Root type="single" collapsible className="border-t border-(--color-ink)/8 mt-1">
                              <Accordion.Item value="patterns-mobile">
                                <Accordion.Header>
                                  <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-(--color-ink) hover:bg-(--color-brand)/8 hover:text-(--color-brand)">
                                    Patterns
                                    <ChevronDown size={13} className="text-(--color-muted) transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                  </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content className="overflow-hidden data-[state=open]:animate-none">
                                  <div className="flex flex-col pb-1 pl-4">
                                    {([
                                      { label: "Argumenter",           cat: "argumenter"         as const },
                                      { label: "Connecteurs",          cat: "connecteurs"        as const },
                                      { label: "Oral — Interaction",   cat: "oral-interaction"   as const },
                                      { label: "Oral — Monologue",     cat: "oral-monologue"     as const },
                                      { label: "Écrit — Lettre",       cat: "ecrit-intro"        as const },
                                      { label: "Écrit — Clôture",      cat: "ecrit-corps"        as const },
                                      { label: "Écrit — Argumentatif", cat: "ecrit-argumentatif" as const },
                                      { label: "Tout",                 cat: "all"                as const },
                                    ]).map(({ label, cat }) => {
                                      const favKey = `Patterns — ${label}`;
                                      const isFav = favorites.includes(favKey);
                                      return (
                                        <div key={cat} className="relative">
                                          <button type="button" onClick={() => handleSelectPatternsCategory(cat)} className="w-full px-3 py-2.5 pr-10 text-left text-sm text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand)">
                                            {label}
                                          </button>
                                          <button type="button" onClick={(e) => toggleFavorite(favKey, e)} aria-label={isFav ? `Retirer des favoris` : `Ajouter aux favoris`} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-opacity ${isFav ? "text-amber-400" : "text-(--color-muted)"}`}>
                                            <Star size={13} fill={isFav ? "currentColor" : "none"} />
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </Accordion.Content>
                              </Accordion.Item>
                            </Accordion.Root>
                          )}
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </div>
            </div>
          )}

          {/* QUIZ / FLASHCARD SCREENS */}
          {appMode !== "home" && (
            <div className="flex min-h-full items-center justify-center px-3 py-4 md:px-4 md:py-8">

              {/* PARTICIPE */}
              {appMode === "participe" && (
                <>
                  {(participe.state.phase === QuizPhase.Answering || participe.state.phase === QuizPhase.Feedback) && participe.currentQuestion && (
                    <QuizCard question={participe.currentQuestion} answerState={participe.state.answerState} selectedIndex={participe.state.selectedIndex} onSelect={participe.selectAnswer} onNext={participe.nextQuestion} questionNumber={participe.progress.index + 1} total={participe.progress.total} />
                  )}
                  {participe.state.phase === QuizPhase.Complete && (
                    <ResultScreen history={participe.state.history} score={participe.state.score} total={participe.progress.total} onRestart={participe.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* IMPARFAIT */}
              {appMode === "imparfait" && (
                <>
                  {(imparfait.state.phase === QuizPhase.Answering || imparfait.state.phase === QuizPhase.Feedback) && imparfait.currentQuestion && (
                    <ImparfaitQuizCard question={imparfait.currentQuestion} answerState={imparfait.state.answerState} selectedIndex={imparfait.state.selectedIndex} onSelect={imparfait.selectAnswer} onNext={imparfait.nextQuestion} questionNumber={imparfait.progress.index + 1} total={imparfait.progress.total} />
                  )}
                  {imparfait.state.phase === QuizPhase.Complete && (
                    <ResultScreen history={imparfait.state.history} score={imparfait.state.score} total={imparfait.progress.total} onRestart={imparfait.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* FUTUR */}
              {appMode === "futur" && (
                <>
                  {(futur.state.phase === QuizPhase.Answering || futur.state.phase === QuizPhase.Feedback) && futur.currentQuestion && (
                    <FuturQuizCard question={futur.currentQuestion} answerState={futur.state.answerState} selectedIndex={futur.state.selectedIndex} onSelect={futur.selectAnswer} onNext={futur.nextQuestion} questionNumber={futur.progress.index + 1} total={futur.progress.total} />
                  )}
                  {futur.state.phase === QuizPhase.Complete && (
                    <ResultScreen history={futur.state.history} score={futur.state.score} total={futur.progress.total} onRestart={futur.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* CONDITIONNEL */}
              {appMode === "conditionnel" && (
                <>
                  {(conditionnel.state.phase === QuizPhase.Answering || conditionnel.state.phase === QuizPhase.Feedback) && conditionnel.currentQuestion && (
                    <ConditionnelQuizCard question={conditionnel.currentQuestion} answerState={conditionnel.state.answerState} selectedIndex={conditionnel.state.selectedIndex} onSelect={conditionnel.selectAnswer} onNext={conditionnel.nextQuestion} questionNumber={conditionnel.progress.index + 1} total={conditionnel.progress.total} />
                  )}
                  {conditionnel.state.phase === QuizPhase.Complete && (
                    <ResultScreen history={conditionnel.state.history} score={conditionnel.state.score} total={conditionnel.progress.total} onRestart={conditionnel.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* ORTHOGRAPHE */}
              {appMode === "orthographe" && (
                <>
                  {(orthographe.state.phase === QuizPhase.Answering || orthographe.state.phase === QuizPhase.Feedback) && orthographe.currentQuestion && (
                    <OrthographeQuizCard question={orthographe.currentQuestion} answerState={orthographe.state.answerState} selectedIndex={orthographe.state.selectedIndex} onSelect={orthographe.selectAnswer} onNext={orthographe.nextQuestion} questionNumber={orthographe.progress.index + 1} total={orthographe.progress.total} />
                  )}
                  {orthographe.state.phase === QuizPhase.Complete && (
                    <OrthographeResultScreen history={orthographe.state.history} score={orthographe.state.score} total={orthographe.progress.total} onRestart={orthographe.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* PRÉSENT */}
              {appMode === "présent" && (
                <>
                  {(présent.state.phase === QuizPhase.Answering || présent.state.phase === QuizPhase.Feedback) && présent.currentQuestion && (
                    <PresentQuizCard question={présent.currentQuestion} answerState={présent.state.answerState} selectedIndex={présent.state.selectedIndex} onSelect={présent.selectAnswer} onNext={présent.nextQuestion} questionNumber={présent.progress.index + 1} total={présent.progress.total} />
                  )}
                  {présent.state.phase === QuizPhase.Complete && (
                    <ResultScreen history={présent.state.history.map(e => ({ verb: e.question.verb, picked: e.picked, correct: e.correct }))} score={présent.state.score} total={présent.progress.total} onRestart={présent.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* ÉCRIT */}
              {appMode === "écrit" && (
                <>
                  {(écrit.state.phase === QuizPhase.Answering || écrit.state.phase === QuizPhase.Feedback) && écrit.currentQuestion && (
                    <OrthographeQuizCard question={écrit.currentQuestion} answerState={écrit.state.answerState} selectedIndex={écrit.state.selectedIndex} onSelect={écrit.selectAnswer} onNext={écrit.nextQuestion} questionNumber={écrit.progress.index + 1} total={écrit.progress.total} label="Lettre formelle — complétez l'expression" />
                  )}
                  {écrit.state.phase === QuizPhase.Complete && (
                    <OrthographeResultScreen history={écrit.state.history} score={écrit.state.score} total={écrit.progress.total} onRestart={écrit.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* ORAL */}
              {appMode === "oral" && (
                <>
                  {(oral.state.phase === QuizPhase.Answering || oral.state.phase === QuizPhase.Feedback) && oral.currentQuestion && (
                    <OrthographeQuizCard question={oral.currentQuestion} answerState={oral.state.answerState} selectedIndex={oral.state.selectedIndex} onSelect={oral.selectAnswer} onNext={oral.nextQuestion} questionNumber={oral.progress.index + 1} total={oral.progress.total} label="Expression orale — complétez la phrase" />
                  )}
                  {oral.state.phase === QuizPhase.Complete && (
                    <OrthographeResultScreen history={oral.state.history} score={oral.state.score} total={oral.progress.total} onRestart={oral.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* PHRASES */}
              {appMode === "phrases" && (
                <>
                  {(phrases.state.phase === QuizPhase.Answering || phrases.state.phase === QuizPhase.Feedback) && phrases.currentQuestion && (
                    <OrthographeQuizCard question={phrases.currentQuestion} answerState={phrases.state.answerState} selectedIndex={phrases.state.selectedIndex} onSelect={phrases.selectAnswer} onNext={phrases.nextQuestion} questionNumber={phrases.progress.index + 1} total={phrases.progress.total} label="Complétez avec la bonne expression" />
                  )}
                  {phrases.state.phase === QuizPhase.Complete && (
                    <OrthographeResultScreen history={phrases.state.history} score={phrases.state.score} total={phrases.progress.total} onRestart={phrases.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* PATTERNS */}
              {appMode === "patterns" && (
                <>
                  {patternsCategory !== null && activeDeck.state.phase === "session" && activeDeck.currentCard && (
                    <FlashcardView card={activeDeck.currentCard} index={activeDeck.progress.index} total={activeDeck.progress.total} canGoBack={activeDeck.progress.index > 0} onRate={activeDeck.rate} onBack={activeDeck.back} onSkip={activeDeck.skip} />
                  )}
                  {patternsCategory !== null && activeDeck.state.phase === "complete" && (
                    <FlashcardResults sessionResults={activeDeck.state.sessionResults} masteredCount={activeDeck.masteredCount} totalCards={activeDeck.totalCards} onRestart={activeDeck.restart} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* VOCABULAIRE */}
              {appMode === "vocabulaire" && (
                <>
                  {vocabulaire.state.phase === "session" && vocabulaire.currentCard && (
                    <FlashcardView card={vocabulaire.currentCard} index={vocabulaire.progress.index} total={vocabulaire.progress.total} canGoBack={vocabulaire.progress.index > 0} onRate={vocabulaire.rate} onBack={vocabulaire.back} onSkip={vocabulaire.skip} />
                  )}
                  {vocabulaire.state.phase === "complete" && (
                    <FlashcardResults sessionResults={vocabulaire.state.sessionResults} masteredCount={vocabulaire.masteredCount} totalCards={vocabulaire.totalCards} onRestart={vocabulaire.restart} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* TOURISTE */}
              {appMode === "touriste" && (
                <>
                  {touriste.state.phase === "session" && touriste.currentCard && (
                    <FlashcardView card={touriste.currentCard} index={touriste.progress.index} total={touriste.progress.total} canGoBack={touriste.progress.index > 0} onRate={touriste.rate} onBack={touriste.back} onSkip={touriste.skip} />
                  )}
                  {touriste.state.phase === "complete" && (
                    <FlashcardResults sessionResults={touriste.state.sessionResults} masteredCount={touriste.masteredCount} totalCards={touriste.totalCards} onRestart={touriste.restart} onHome={handleGoHome} />
                  )}
                </>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
