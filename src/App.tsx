import { useEffect, useMemo, useRef, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Bookmark, ChevronDown, ChevronRight, Heart, Target,
  Gamepad2, FlaskConical, BookCheck, Columns3,
  UtensilsCrossed, Bus, BedDouble, ShoppingBag, Map, Siren,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { VERBS } from "./data/verbs";
import { useQuiz } from "./hooks/useQuiz";
import { useImparfaitQuiz } from "./hooks/useImparfaitQuiz";
import { useConditionnelQuiz } from "./hooks/useConditionnelQuiz";
import { useFuturQuiz } from "./hooks/useFuturQuiz";
import { useOrthographeQuiz } from "./hooks/useOrthographeQuiz";
import { useGrammarQuiz } from "./hooks/useGrammarQuiz";
import { useDifficultesQuiz } from "./hooks/useDifficultesQuiz";
import { useWeakVerbs } from "./hooks/useWeakVerbs";
import { useFavoriteCards } from "./hooks/useFavoriteCards";
import { usePhrasesQuiz } from "./hooks/usePhrasesQuiz";
import { useEtreQuiz } from "./hooks/useEtreQuiz";
import { usePresentQuiz } from "./hooks/usePresentQuiz";
import { useEcritQuiz } from "./hooks/useEcritQuiz";
import { useOralQuiz } from "./hooks/useOralQuiz";
import { useFlashcards } from "./hooks/useFlashcards";
import { useTheme } from "./hooks/useTheme";
import { getItem, setItem, pushStore } from "./lib/store";
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
import { EssentialVerbsGuide } from "./components/EssentialVerbsGuide";
import { MrsVandertrampGuide } from "./components/MrsVandertrampGuide";
import type { PatternsCategory } from "./components/PatternsCategoryPicker";
import type { VoyageCategory } from "./components/VoyageCategoryPicker";
import { ThemeToggle } from "./components/ThemeToggle";

const QUESTION_COUNT = 10;

/** Collapse verbose test labels to just "Test" when they're already inside their section group. */
function displayLabel(label: string): string {
  return label.startsWith("Test ") ? "Test" : label;
}

type AppMode = "home" | "participe" | "imparfait" | "conditionnel" | "futur" | "orthographe" | "phrases" | "présent" | "écrit" | "oral" | "patterns" | "vocabulaire" | "touriste" | "grammar-test" | "difficiles" | "verbes" | "mes-patterns" | "être-cards" | "être-quiz" | "être-guide";

const MODE_LABEL: Record<Exclude<AppMode, "home">, string> = {
  participe: "Participe passé",
  imparfait: "Imparfait",
  conditionnel: "Conditionnel",
  futur: "Futur simple",
  orthographe: "Orthographe",
  phrases: "Test connecteurs",
  présent: "Présent",
  écrit: "Test écrit",
  oral: "Test oral",
  patterns: "Patterns",
  vocabulaire: "Paires",
  touriste: "Voyage",
  "grammar-test": "Test grammaire",
  difficiles: "Mes difficiles",
  verbes: "Verbes essentiels",
  "mes-patterns": "Mes patterns",
  "être-cards": "Être / avoir",
  "être-quiz": "Test être / avoir",
  "être-guide": "Liste des verbes",
};

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [appMode, setAppMode] = useState<AppMode>("home");
  const DEFAULT_FAVORITES = ["Participe passé"];
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = getItem("tef-favorites");
      if (stored === null) return DEFAULT_FAVORITES;
      return JSON.parse(stored) as string[];
    }
    catch { return DEFAULT_FAVORITES; }
  });

  useEffect(() => {
    setItem("tef-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Push on tab close / reload
  useEffect(() => {
    const handler = () => { void pushStore(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  function toggleFavorite(label: string, e: React.MouseEvent) {
    e.stopPropagation();
    setFavorites(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  }

  const participe = useQuiz(VERBS, QUESTION_COUNT);
  const imparfait = useImparfaitQuiz();
  const conditionnel = useConditionnelQuiz();
  const futur = useFuturQuiz();
  const orthographe = useOrthographeQuiz();
  const grammarTest = useGrammarQuiz();
  const { isWeak, toggleWeak, weakVerbList } = useWeakVerbs();
  const { isFavoriteCard, toggleFavoriteCard, favoriteCardList } = useFavoriteCards();
  const difficiles = useDifficultesQuiz();
  const mesPatterns = useFlashcards(favoriteCardList, "tef-mes-patterns-progress");
  const phrases = usePhrasesQuiz();
  const présent = usePresentQuiz();
  const écrit = useEcritQuiz();
  const oral = useOralQuiz();
  const flashcards = useFlashcards(FLASHCARDS.filter(c => c.category !== "être-avoir"), "tef-flashcard-progress");
  const etreQuiz   = useEtreQuiz();
  const pEtreAvoir = useFlashcards(FLASHCARDS.filter(c => c.category === "être-avoir"), "tef-p-etre-avoir");

  const pConnecteurs       = useFlashcards(FLASHCARDS.filter(c => c.category === "connecteurs"),         "tef-p-connecteurs");
  const pOralInteraction   = useFlashcards(FLASHCARDS.filter(c => c.category === "oral"),                "tef-p-oral-interaction");
  const pOralMonologue     = useFlashcards(FLASHCARDS.filter(c => c.category === "oral-persuasion"),     "tef-p-oral-monologue");
  const pEcritFaitsDivers  = useFlashcards(FLASHCARDS.filter(c => c.category === "écrit-faits-divers"),  "tef-p-ecrit-faits-divers");
  const pEcritArgumentatif = useFlashcards(FLASHCARDS.filter(c => c.category === "argumentation"),       "tef-p-ecrit-argumentatif");
  const vocabulaire = useFlashcards(VOCABULAIRE_CARDS, "tef-vocabulaire-progress");

  const vRestaurant   = useFlashcards(TOURISTE_CARDS.filter(c => c.subCategory === "restaurant"),   "tef-voyage-restaurant");
  const vTransport    = useFlashcards(TOURISTE_CARDS.filter(c => c.subCategory === "transport"),    "tef-voyage-transport");
  const vHebergement  = useFlashcards(TOURISTE_CARDS.filter(c => c.subCategory === "hebergement"), "tef-voyage-hebergement");
  const vShopping     = useFlashcards(TOURISTE_CARDS.filter(c => c.subCategory === "shopping"),    "tef-voyage-shopping");
  const vOrientation  = useFlashcards(TOURISTE_CARDS.filter(c => c.subCategory === "orientation"), "tef-voyage-orientation");
  const vUrgences     = useFlashcards(TOURISTE_CARDS.filter(c => c.subCategory === "urgences"),    "tef-voyage-urgences");

  const [patternsCategory, setPatternsCategory] = useState<PatternsCategory | null>(null);
  const [voyageCategory, setVoyageCategory] = useState<VoyageCategory | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>(["favoris"]);

  // On desktop, never show the home landing — land users directly in Marathon.
  // Mobile keeps the accordion landing.
  useEffect(() => {
    if (appMode !== "home") return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    setPatternsCategory("all");
    setAppMode("patterns");
    flashcards.startSession();
  }, [appMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeDeck =
    patternsCategory === "connecteurs"        ? pConnecteurs        :
    patternsCategory === "oral-interaction"   ? pOralInteraction    :
    patternsCategory === "oral-monologue"     ? pOralMonologue      :
    patternsCategory === "ecrit-faits-divers" ? pEcritFaitsDivers   :
    patternsCategory === "ecrit-argumentatif" ? pEcritArgumentatif  :
    flashcards;

  const activeTouristeDeck =
    voyageCategory === "restaurant"  ? vRestaurant  :
    voyageCategory === "transport"   ? vTransport   :
    voyageCategory === "hebergement" ? vHebergement :
    voyageCategory === "shopping"    ? vShopping    :
    voyageCategory === "orientation" ? vOrientation :
    vUrgences;

  const liveRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (appMode === "participe") {
        if (participe.state.phase === QuizPhase.Answering || participe.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) participe.selectAnswer(d - 1); }
        if (participe.state.phase === QuizPhase.Feedback && e.key === "Enter") participe.nextQuestion();
      }
      if (appMode === "imparfait") {
        if (imparfait.state.phase === QuizPhase.Answering || imparfait.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) imparfait.selectAnswer(d - 1); }
        if (imparfait.state.phase === QuizPhase.Feedback && e.key === "Enter") imparfait.nextQuestion();
      }
      if (appMode === "conditionnel") {
        if (conditionnel.state.phase === QuizPhase.Answering || conditionnel.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) conditionnel.selectAnswer(d - 1); }
        if (conditionnel.state.phase === QuizPhase.Feedback && e.key === "Enter") conditionnel.nextQuestion();
      }
      if (appMode === "futur") {
        if (futur.state.phase === QuizPhase.Answering || futur.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) futur.selectAnswer(d - 1); }
        if (futur.state.phase === QuizPhase.Feedback && e.key === "Enter") futur.nextQuestion();
      }
      if (appMode === "orthographe") {
        if (orthographe.state.phase === QuizPhase.Answering || orthographe.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) orthographe.selectAnswer(d - 1); }
        if (orthographe.state.phase === QuizPhase.Feedback && e.key === "Enter") orthographe.nextQuestion();
      }
      if (appMode === "grammar-test") {
        if (grammarTest.state.phase === QuizPhase.Answering || grammarTest.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) grammarTest.selectAnswer(d - 1); }
        if (grammarTest.state.phase === QuizPhase.Feedback && e.key === "Enter") grammarTest.nextQuestion();
      }
      if (appMode === "difficiles") {
        if (difficiles.state.phase === QuizPhase.Answering || difficiles.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) difficiles.selectAnswer(d - 1); }
        if (difficiles.state.phase === QuizPhase.Feedback && e.key === "Enter") difficiles.nextQuestion();
      }
      if (appMode === "phrases") {
        if (phrases.state.phase === QuizPhase.Answering || phrases.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) phrases.selectAnswer(d - 1); }
        if (phrases.state.phase === QuizPhase.Feedback && e.key === "Enter") phrases.nextQuestion();
      }
      if (appMode === "être-quiz") {
        if (etreQuiz.state.phase === QuizPhase.Answering || etreQuiz.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) etreQuiz.selectAnswer(d - 1); }
        if (etreQuiz.state.phase === QuizPhase.Feedback && e.key === "Enter") etreQuiz.nextQuestion();
      }
      if (appMode === "présent") {
        if (présent.state.phase === QuizPhase.Answering || présent.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) présent.selectAnswer(d - 1); }
        if (présent.state.phase === QuizPhase.Feedback && e.key === "Enter") présent.nextQuestion();
      }
      if (appMode === "écrit") {
        if (écrit.state.phase === QuizPhase.Answering || écrit.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) écrit.selectAnswer(d - 1); }
        if (écrit.state.phase === QuizPhase.Feedback && e.key === "Enter") écrit.nextQuestion();
      }
      if (appMode === "oral") {
        if (oral.state.phase === QuizPhase.Answering || oral.state.phase === QuizPhase.Feedback) { const d = parseInt(e.key, 10); if (d >= 1 && d <= 4) oral.selectAnswer(d - 1); }
        if (oral.state.phase === QuizPhase.Feedback && e.key === "Enter") oral.nextQuestion();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [appMode, participe, imparfait, conditionnel, futur, orthographe, phrases, etreQuiz, présent, écrit, oral]);

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
    } else if (appMode === "être-quiz" && etreQuiz.state.phase === QuizPhase.Feedback && etreQuiz.currentQuestion) {
      const correct = etreQuiz.currentQuestion.options[etreQuiz.currentQuestion.correctIndex] ?? "";
      setAnnouncement(etreQuiz.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
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
    etreQuiz.state.phase, etreQuiz.state.answerState, etreQuiz.currentQuestion,
  ]);

  function handleGoHome() {
    if (appMode === "participe") participe.goHome();
    if (appMode === "imparfait") imparfait.goHome();
    if (appMode === "conditionnel") conditionnel.goHome();
    if (appMode === "futur") futur.goHome();
    if (appMode === "orthographe") orthographe.goHome();
    if (appMode === "grammar-test") grammarTest.goHome();
    if (appMode === "difficiles") difficiles.goHome();
    if (appMode === "phrases") phrases.goHome();
    if (appMode === "présent") présent.goHome();
    if (appMode === "écrit") écrit.goHome();
    if (appMode === "oral") oral.goHome();
    if (appMode === "patterns") { activeDeck.goHome(); setPatternsCategory(null); }
    if (appMode === "vocabulaire") vocabulaire.goHome();
    if (appMode === "touriste") { activeTouristeDeck.goHome(); setVoyageCategory(null); }
    if (appMode === "mes-patterns") mesPatterns.goHome();
    if (appMode === "être-cards") pEtreAvoir.goHome();
    if (appMode === "être-quiz") etreQuiz.goHome();
    setAppMode("home");
  }

  function handleStartParticipe()    { participe.startQuiz();    setAppMode("participe"); }
  function handleStartImparfait()    { imparfait.startQuiz();    setAppMode("imparfait"); }
  function handleStartConditionnel() { conditionnel.startQuiz(); setAppMode("conditionnel"); }
  function handleStartFutur()        { futur.startQuiz();        setAppMode("futur"); }
  function handleStartOrthographe()  { orthographe.startQuiz();  setAppMode("orthographe"); }
  function handleStartGrammarTest()  { grammarTest.startQuiz();  setAppMode("grammar-test"); }
  function handleStartDifficiles()   { difficiles.goHome(); setAppMode("difficiles"); }
  function handleStartMesPatterns()  { mesPatterns.goHome(); setAppMode("mes-patterns"); }
  function handleStartPhrases()      { phrases.startQuiz();      setAppMode("phrases"); }
  function handleStartPresent()      { présent.startQuiz();      setAppMode("présent"); }
  function handleStartEcrit()        { écrit.startQuiz();        setAppMode("écrit"); }
  function handleStartOral()         { oral.startQuiz();         setAppMode("oral"); }
  function handleStartVerbes()       { setAppMode("verbes"); }
  function handleStartEtreCards()    { pEtreAvoir.startSession(); setAppMode("être-cards"); }
  function handleStartEtreQuiz()     { etreQuiz.startQuiz();      setAppMode("être-quiz"); }
  function handleStartEtreGuide()    { setAppMode("être-guide"); }
  function handleStartMarathon()     { setPatternsCategory("all"); setAppMode("patterns"); flashcards.startSession(); }
  function handleStartVocabulaire()  { vocabulaire.startSession(); setAppMode("vocabulaire"); }

  function handleSelectVoyageCategory(cat: VoyageCategory) {
    setVoyageCategory(cat);
    setAppMode("touriste");
    const deck =
      cat === "restaurant"  ? vRestaurant  :
      cat === "transport"   ? vTransport   :
      cat === "hebergement" ? vHebergement :
      cat === "shopping"    ? vShopping    :
      cat === "orientation" ? vOrientation :
      vUrgences;
    deck.startSession();
  }

  function handleSelectPatternsCategory(cat: PatternsCategory) {
    setPatternsCategory(cat);
    setAppMode("patterns");
    const deck =
      cat === "connecteurs"        ? pConnecteurs         :
      cat === "oral-interaction"   ? pOralInteraction     :
      cat === "oral-monologue"     ? pOralMonologue       :
      cat === "ecrit-faits-divers" ? pEcritFaitsDivers    :
      cat === "ecrit-argumentatif" ? pEcritArgumentatif   :
      flashcards;
    deck.startSession();
  }

  const activePhase =
    appMode === "participe"     ? participe.state.phase
    : appMode === "imparfait"     ? imparfait.state.phase
    : appMode === "conditionnel"  ? conditionnel.state.phase
    : appMode === "futur"         ? futur.state.phase
    : appMode === "orthographe"   ? orthographe.state.phase
    : appMode === "grammar-test"  ? grammarTest.state.phase
    : appMode === "difficiles"    ? difficiles.state.phase
    : appMode === "phrases"       ? phrases.state.phase
    : appMode === "présent"       ? présent.state.phase
    : appMode === "écrit"         ? écrit.state.phase
    : appMode === "oral"          ? oral.state.phase
    : appMode === "être-quiz"     ? etreQuiz.state.phase
    : QuizPhase.Idle;

  const activeProgress =
    appMode === "participe"     ? participe.progress
    : appMode === "imparfait"     ? imparfait.progress
    : appMode === "conditionnel"  ? conditionnel.progress
    : appMode === "futur"         ? futur.progress
    : appMode === "orthographe"   ? orthographe.progress
    : appMode === "grammar-test"  ? grammarTest.progress
    : appMode === "difficiles"    ? difficiles.progress
    : appMode === "phrases"       ? phrases.progress
    : appMode === "présent"       ? présent.progress
    : appMode === "écrit"         ? écrit.progress
    : appMode === "oral"          ? oral.progress
    : appMode === "être-quiz"     ? etreQuiz.progress
    : { index: 0, total: 0 };

  const activeScore =
    appMode === "participe"     ? participe.state.score
    : appMode === "imparfait"     ? imparfait.state.score
    : appMode === "conditionnel"  ? conditionnel.state.score
    : appMode === "futur"         ? futur.state.score
    : appMode === "orthographe"   ? orthographe.state.score
    : appMode === "grammar-test"  ? grammarTest.state.score
    : appMode === "difficiles"    ? difficiles.state.score
    : appMode === "phrases"       ? phrases.state.score
    : appMode === "présent"       ? présent.state.score
    : appMode === "écrit"         ? écrit.state.score
    : appMode === "oral"      ? oral.state.score
    : etreQuiz.state.score;

  const showScoreBoard = appMode !== "home" && (activePhase === QuizPhase.Answering || activePhase === QuizPhase.Feedback);

  // ── Suggestion cards (desktop home) ──────────────────────────────────────
  const ALL_SUGGESTIONS = [
    { label: "Conditionnel",       sub: "Conjuguer par sujet",   icon: BookCheck, onClick: handleStartConditionnel },
    { label: "Futur simple",       sub: "Conjuguer par sujet",   icon: BookCheck, onClick: handleStartFutur },
    { label: "Orthographe",        sub: "Corriger les erreurs",  icon: BookCheck, onClick: handleStartOrthographe },
    { label: "Imparfait",          sub: "Conjuguer par sujet",   icon: BookCheck, onClick: handleStartImparfait },
    { label: "Participe passé",    sub: "Identifier la forme",   icon: BookCheck, onClick: handleStartParticipe },
    { label: "Présent",            sub: "Conjuguer par sujet",   icon: BookCheck, onClick: handleStartPresent },
    { label: "Connecteurs Quiz",   sub: "Expressions du TEF",    icon: FlaskConical, onClick: handleStartPhrases },
    { label: "Test écrit",         sub: "Lettres & expressions", icon: FlaskConical, onClick: handleStartEcrit },
    { label: "Test oral",          sub: "Poser des questions",   icon: FlaskConical, onClick: handleStartOral },
    { label: "Marathon",           sub: "100 phrases clés",      icon: Gamepad2, onClick: handleStartMarathon },
    { label: "Paires",             sub: "Antonymes & synonymes", icon: Gamepad2, onClick: handleStartVocabulaire },
    { label: "Voyage",             sub: "Phrases de voyage",     icon: Map, onClick: () => handleSelectVoyageCategory("restaurant") },
  ];
  const suggestions = useMemo(() => {
    const shuffled = [...ALL_SUGGESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  // re-shuffle every time the user returns to home
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appMode]);

  // ── Nav data ──────────────────────────────────────────────────────────────
  const SIDEBAR_LOOKUP: Record<string, { mode: Exclude<AppMode, "home">; onClick: () => void; icon: LucideIcon }> = {
    "Conditionnel":      { mode: "conditionnel", onClick: handleStartConditionnel, icon: BookCheck },
    "Futur simple":      { mode: "futur",        onClick: handleStartFutur,        icon: BookCheck },
    "Imparfait":         { mode: "imparfait",    onClick: handleStartImparfait,    icon: BookCheck },
    "Participe passé":   { mode: "participe",    onClick: handleStartParticipe,    icon: BookCheck },
    "Présent":           { mode: "présent",      onClick: handleStartPresent,      icon: BookCheck },
    "Test grammaire":    { mode: "grammar-test", onClick: handleStartGrammarTest,  icon: FlaskConical },
    "Mes difficiles":    { mode: "difficiles",   onClick: handleStartDifficiles,   icon: Bookmark },
    "Test connecteurs":  { mode: "phrases",      onClick: handleStartPhrases,      icon: FlaskConical },
    "Test écrit":        { mode: "écrit",        onClick: handleStartEcrit,        icon: FlaskConical },
    "Test oral":         { mode: "oral",         onClick: handleStartOral,         icon: FlaskConical },
    "Verbes essentiels": { mode: "verbes",       onClick: handleStartVerbes,       icon: Columns3 },
    "Marathon":          { mode: "patterns",     onClick: handleStartMarathon,     icon: Gamepad2 },
    "Paires":            { mode: "vocabulaire",  onClick: handleStartVocabulaire,  icon: Gamepad2 },
    "Renseignements":    { mode: "patterns",     onClick: () => handleSelectPatternsCategory("oral-interaction"),   icon: BookCheck },
    "Persuasion":         { mode: "patterns",     onClick: () => handleSelectPatternsCategory("oral-monologue"),     icon: BookCheck },
    "Faits divers":      { mode: "patterns",     onClick: () => handleSelectPatternsCategory("ecrit-faits-divers"), icon: BookCheck },
    "Argumentatif":      { mode: "patterns",     onClick: () => handleSelectPatternsCategory("ecrit-argumentatif"), icon: BookCheck },
    "Connecteurs":       { mode: "patterns",     onClick: () => handleSelectPatternsCategory("connecteurs"),        icon: BookCheck },
    "Être / avoir":        { mode: "être-cards",   onClick: handleStartEtreCards,  icon: BookCheck },
    "Test être / avoir":   { mode: "être-quiz",    onClick: handleStartEtreQuiz,   icon: FlaskConical },
    "Liste des verbes": { mode: "être-guide", onClick: handleStartEtreGuide,  icon: Columns3 },
    "Restaurant":        { mode: "touriste",     onClick: () => handleSelectVoyageCategory("restaurant"),           icon: UtensilsCrossed },
    "Transport":         { mode: "touriste",     onClick: () => handleSelectVoyageCategory("transport"),            icon: Bus },
    "Hébergement":       { mode: "touriste",     onClick: () => handleSelectVoyageCategory("hebergement"),          icon: BedDouble },
    "Shopping":          { mode: "touriste",     onClick: () => handleSelectVoyageCategory("shopping"),             icon: ShoppingBag },
    "Orientation":       { mode: "touriste",     onClick: () => handleSelectVoyageCategory("orientation"),          icon: Map },
    "Urgences":          { mode: "touriste",     onClick: () => handleSelectVoyageCategory("urgences"),             icon: Siren },
  };

  // ── Flashcard header helper ───────────────────────────────────────────────
  function FlashcardHeader() {
    const deck =
      appMode === "patterns"      ? activeDeck      :
      appMode === "vocabulaire"   ? vocabulaire      :
      appMode === "mes-patterns"  ? mesPatterns      :
      appMode === "être-cards"    ? pEtreAvoir       :
      activeTouristeDeck;
    if (appMode === "patterns" && patternsCategory === null) return null;
    if (appMode === "touriste" && voyageCategory === null) return null;
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

  const isFlashcardMode = appMode === "patterns" || appMode === "vocabulaire" || appMode === "touriste" || appMode === "mes-patterns" || appMode === "être-cards";

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
              id: "marathon",
              label: "Marathon",
              items: [] as { label: string; mode: Exclude<AppMode, "home">; onClick: () => void }[],
              special: "single" as const,
              action: { mode: "patterns" as const, onClick: handleStartMarathon, icon: Gamepad2 as LucideIcon },
            },
            {
              id: "paires",
              label: "Paires",
              items: [] as { label: string; mode: Exclude<AppMode, "home">; onClick: () => void }[],
              special: "single" as const,
              action: { mode: "vocabulaire" as const, onClick: handleStartVocabulaire, icon: Gamepad2 as LucideIcon },
            },
            {
              id: "favoris",
              label: "Leçons favorites",
              items: [] as { label: string; mode: Exclude<AppMode, "home">; onClick: () => void }[],
              special: "favoris" as const,
            },
            {
              id: "difficiles",
              label: "Mes difficiles",
              items: [] as { label: string; mode: Exclude<AppMode, "home">; onClick: () => void }[],
              special: "single" as const,
              action: { mode: "difficiles" as const, onClick: handleStartDifficiles, icon: Target as LucideIcon },
            },
            {
              id: "mes-patterns",
              label: "Mes patterns",
              items: [] as { label: string; mode: Exclude<AppMode, "home">; onClick: () => void }[],
              special: "single" as const,
              action: { mode: "mes-patterns" as const, onClick: handleStartMesPatterns, icon: Bookmark as LucideIcon },
            },
            {
              id: "oral",
              label: "Oral",
              items: [
                { label: "Renseignements", mode: "patterns" as const, onClick: () => handleSelectPatternsCategory("oral-interaction") },
                { label: "Persuasion",   mode: "patterns" as const, onClick: () => handleSelectPatternsCategory("oral-monologue") },
                { label: "Test oral",   mode: "oral"     as const, onClick: handleStartOral },
              ],
            },
            {
              id: "ecrit",
              label: "Écrit",
              items: [
                { label: "Faits divers",  mode: "patterns" as const, onClick: () => handleSelectPatternsCategory("ecrit-faits-divers") },
                { label: "Argumentatif",  mode: "patterns" as const, onClick: () => handleSelectPatternsCategory("ecrit-argumentatif") },
                { label: "Test écrit",    mode: "écrit"    as const, onClick: handleStartEcrit },
              ],
            },
            {
              id: "grammaire",
              label: "Grammaire",
              items: [
                { label: "Participe passé",  mode: "participe"    as const, onClick: handleStartParticipe },
                { label: "Imparfait",        mode: "imparfait"    as const, onClick: handleStartImparfait },
                { label: "Présent",          mode: "présent"      as const, onClick: handleStartPresent },
                { label: "Futur simple",     mode: "futur"        as const, onClick: handleStartFutur },
                { label: "Conditionnel",     mode: "conditionnel" as const, onClick: handleStartConditionnel },
                { label: "Test grammaire",   mode: "grammar-test" as const, onClick: handleStartGrammarTest },
              ],
            },
            {
              id: "connecteurs",
              label: "Connecteurs",
              items: [
                { label: "Connecteurs",      mode: "patterns" as const, onClick: () => handleSelectPatternsCategory("connecteurs") },
                { label: "Test connecteurs", mode: "phrases" as const, onClick: handleStartPhrases },
              ],
            },
            {
              id: "être-avoir",
              label: "MRS VANDERTRAMP",
              items: [
                { label: "Être / avoir",        mode: "être-cards" as const, onClick: handleStartEtreCards },
                { label: "Test être / avoir",   mode: "être-quiz"  as const, onClick: handleStartEtreQuiz },
                { label: "Liste des verbes", mode: "être-guide" as const, onClick: handleStartEtreGuide },
              ],
            },
            {
              id: "voyage",
              label: "Voyage",
              items: [
                { label: "Restaurant",   mode: "touriste" as const, onClick: () => handleSelectVoyageCategory("restaurant") },
                { label: "Transport",    mode: "touriste" as const, onClick: () => handleSelectVoyageCategory("transport") },
                { label: "Hébergement",  mode: "touriste" as const, onClick: () => handleSelectVoyageCategory("hebergement") },
                { label: "Shopping",     mode: "touriste" as const, onClick: () => handleSelectVoyageCategory("shopping") },
                { label: "Orientation",  mode: "touriste" as const, onClick: () => handleSelectVoyageCategory("orientation") },
                { label: "Urgences",     mode: "touriste" as const, onClick: () => handleSelectVoyageCategory("urgences") },
              ],
            },
            {
              id: "verbes",
              label: "Verbes essentiels",
              items: [] as { label: string; mode: Exclude<AppMode, "home">; onClick: () => void }[],
              special: "single" as const,
              action: { mode: "verbes" as const, onClick: handleStartVerbes, icon: Columns3 as LucideIcon },
            },
          ] as const)
            .filter((group) => {
              if (group.id === "favoris" && favorites.length === 0) return false;
              if (group.id === "difficiles" && weakVerbList.length === 0) return false;
              if (group.id === "mes-patterns" && favoriteCardList.length === 0) return false;
              return true;
            })
            .map((group, idx) => {
            const isOpen = openGroups.includes(group.id);
            const toggleGroup = () => setOpenGroups(prev =>
              prev.includes(group.id) ? prev.filter(g => g !== group.id) : [...prev, group.id]
            );
            const noSeparatorBefore = group.id === "paires" || group.id === "favoris" || group.id === "difficiles" || group.id === "mes-patterns";
            const separatorClass = idx === 0
              ? ""
              : noSeparatorBefore
                ? ""
                : "pt-2 border-t border-(--color-ink)/16";

            // Single-action groups (Marathon, Paires) render as a direct button, not a collapsible group
            if ("special" in group && group.special === "single") {
              const isActive = appMode === group.action.mode && (group.id === "marathon" ? patternsCategory === "all" : true);
              // Marathon & Paires are already pinned at top of sidebar — no need to favorite them.
              // const isFav = favorites.includes(group.label);
              return (
                <div key={group.id} className={`${separatorClass} group/item relative`}>
                  <button
                    type="button"
                    onClick={group.action.onClick}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-sm font-semibold transition-colors duration-150 ${
                      isActive ? "bg-(--color-brand)/10 text-(--color-brand)" : "text-(--color-ink) hover:bg-(--color-ink)/6"
                    }`}
                  >
                    <group.action.icon size={16} className="shrink-0" />
                    {group.label}
                    {group.id === "difficiles" && weakVerbList.length > 0 && (
                      <span className="ml-auto text-[10px] font-bold text-(--color-muted)">
                        {weakVerbList.length}
                      </span>
                    )}
                    {group.id === "mes-patterns" && favoriteCardList.length > 0 && (
                      <span className="ml-auto text-[10px] font-bold text-(--color-muted)">
                        {favoriteCardList.length}
                      </span>
                    )}
                  </button>
                  {/* Favorite star disabled — uncomment to re-enable
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(group.label, e)}
                    aria-label={isFav ? `Retirer ${group.label} des favoris` : `Ajouter ${group.label} aux favoris`}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-150 ${isFav ? "text-(--color-muted)" : "opacity-0 group-hover/item:opacity-60 text-(--color-muted)"}`}
                  >
                    <Star size={13} fill={isFav ? "currentColor" : "none"} />
                  </button>
                  */}
                </div>
              );
            }

            return (
              <div key={group.id} className={separatorClass}>
                {/* Group header */}
                <button
                  type="button"
                  onClick={toggleGroup}
                  className="w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors duration-150 hover:bg-(--color-ink)/5 group"
                >
                  <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-(--color-ink) transition-colors">
                    {group.id === "favoris" && <Heart size={12} className="shrink-0" />}
                    {group.label}
                  </span>
                  {isOpen ? <ChevronDown size={16} className="text-(--color-ink) transition-transform duration-200" /> : <ChevronRight size={16} className="text-(--color-ink) transition-transform duration-200" />}
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
                              isActive ? "bg-(--color-brand)/10 text-(--color-brand)" : "text-(--color-ink) hover:bg-(--color-ink)/6"
                            }`}
                          >
                            <item.icon size={15} className="shrink-0" />
                            {label}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(label, e)}
                            aria-label={`Retirer ${label} des favoris`}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-(--color-muted)"
                          >
                            <Heart size={13} fill="currentColor" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Regular items */}
                    {group.items.map(({ label, mode, onClick }) => {
                      const isActive = appMode === mode && (
                        mode !== "patterns" || patternsCategory === (
                          label === "Renseignements" ? "oral-interaction" :
                          label === "Persuasion"   ? "oral-monologue"   :
                          label === "Faits divers" ? "ecrit-faits-divers" :
                          label === "Argumentatif" ? "ecrit-argumentatif" :
                          label === "Connecteurs" ? "connecteurs" : null
                        )
                      ) && (
                        mode !== "touriste" || voyageCategory === (
                          label === "Restaurant"  ? "restaurant"  :
                          label === "Transport"   ? "transport"   :
                          label === "Hébergement" ? "hebergement" :
                          label === "Shopping"    ? "shopping"    :
                          label === "Orientation" ? "orientation" :
                          "urgences"
                        )
                      );
                      const isFav = favorites.includes(label);
                      const Icon = SIDEBAR_LOOKUP[label]?.icon ?? BookCheck;
                      return (
                        <div key={label} className="group/item relative">
                          <button
                            type="button"
                            onClick={onClick}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-sm font-medium transition-colors duration-150 ${
                              isActive ? "bg-(--color-brand)/10 text-(--color-brand)" : "text-(--color-ink) hover:bg-(--color-ink)/6"
                            }`}
                          >
                            <Icon size={14} className="shrink-0" />
                            {displayLabel(label)}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(label, e)}
                            aria-label={isFav ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-150 ${isFav ? "text-(--color-muted)" : "opacity-0 group-hover/item:opacity-60 text-(--color-muted)"}`}
                          >
                            <Heart size={13} fill={isFav ? "currentColor" : "none"} />
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
                  <Target size={44} className="text-(--color-brand)" aria-hidden="true" />
                  <p className="text-base font-semibold text-(--color-ink)">Prêt à pratiquer ?</p>
                  <p className="text-sm text-(--color-muted)">Quelques suggestions pour commencer.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
                  {suggestions.map(({ label, sub, icon: Icon, onClick }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      className="flex flex-col items-start gap-2 rounded bg-(--color-surface) p-4 shadow-sm text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)"
                    >
                      <Icon size={20} className="text-(--color-muted)" aria-hidden="true" />
                      <span className="text-sm font-semibold text-(--color-ink) leading-tight">{label}</span>
                      <span className="text-xs text-(--color-muted)">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: accordion */}
              <div className="md:hidden flex-1 flex flex-col items-center justify-center gap-6 px-6 py-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <p className="text-base font-semibold text-(--color-ink)">Prêt à pratiquer ?</p>
                  <p className="text-sm text-(--color-muted)">Choisissez un exercice ci-dessous.</p>
                </div>

                {/* Marathon & Paires — direct buttons, no accordion. Already pinned, not favoritable. */}
                <div className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
                  {[
                    { label: "Marathon", Icon: Gamepad2, onClick: handleStartMarathon },
                    { label: "Paires",   Icon: Gamepad2, onClick: handleStartVocabulaire },
                  ].map(({ label, Icon, onClick }, i) => {
                    // const isFav = favorites.includes(label); // favorite disabled for Marathon/Paires
                    return (
                      <div key={label} className={`relative ${i > 0 ? "border-t border-(--color-ink)/8" : ""}`}>
                        <button type="button" onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15">
                          <Icon size={16} className="shrink-0" />
                          {label}
                        </button>
                        {/* Favorite star disabled — uncomment to re-enable
                        <button type="button" onClick={(e) => toggleFavorite(label, e)} aria-label={isFav ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-opacity ${isFav ? "text-(--color-muted)" : "text-(--color-muted)"}`}>
                          <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                        </button>
                        */}
                      </div>
                    );
                  })}
                </div>

                {/* Mes difficiles mobile */}
                {weakVerbList.length > 0 && (
                <div className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
                  <button
                    type="button"
                    onClick={handleStartDifficiles}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
                  >
                    <Target size={16} className="shrink-0" />
                    Mes difficiles
                    <span className="ml-auto text-[10px] font-bold text-(--color-muted)">{weakVerbList.length}</span>
                  </button>
                </div>
                )}

                {/* Mes patterns mobile */}
                {favoriteCardList.length > 0 && (
                <div className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
                  <button
                    type="button"
                    onClick={handleStartMesPatterns}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
                  >
                    <Bookmark size={16} className="shrink-0" />
                    Mes patterns
                    <span className="ml-auto text-[10px] font-bold text-(--color-muted)">{favoriteCardList.length}</span>
                  </button>
                </div>
                )}

                {/* Favoris mobile */}
                {favorites.length > 0 && (
                  <div className="w-full">
                    <p className="mb-2 px-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-(--color-muted)">
                      <Heart size={12} className="shrink-0" />
                      Leçons favorites
                    </p>
                    <div className="rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
                      {favorites.map(label => {
                        const item = SIDEBAR_LOOKUP[label];
                        if (!item) return null;
                        return (
                          <div key={label} className="relative border-t border-(--color-ink)/8 first:border-t-0">
                            <button
                              type="button"
                              onClick={item.onClick}
                              className="flex w-full items-center gap-2.5 px-4 py-3 pr-12 text-left text-sm font-medium text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
                            >
                              <item.icon size={15} className="shrink-0" />
                              {label}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(label, e)}
                              aria-label={`Retirer ${label} des favoris`}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-(--color-muted)"
                            >
                              <Heart size={14} fill="currentColor" />
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
                      id: "oral",
                      label: "Oral",
                      items: [
                        { label: "Renseignements", onClick: () => handleSelectPatternsCategory("oral-interaction") },
                        { label: "Persuasion",   onClick: () => handleSelectPatternsCategory("oral-monologue") },
                        { label: "Test oral",   onClick: handleStartOral },
                      ],
                    },
                    {
                      id: "ecrit",
                      label: "Écrit",
                      items: [
                        { label: "Faits divers", onClick: () => handleSelectPatternsCategory("ecrit-faits-divers") },
                        { label: "Argumentatif", onClick: () => handleSelectPatternsCategory("ecrit-argumentatif") },
                        { label: "Test écrit",   onClick: handleStartEcrit },
                      ],
                    },
                    {
                      id: "grammaire",
                      label: "Grammaire",
                      items: [
                        { label: "Participe passé", onClick: handleStartParticipe },
                        { label: "Imparfait",       onClick: handleStartImparfait },
                        { label: "Présent",         onClick: handleStartPresent },
                        { label: "Futur simple",    onClick: handleStartFutur },
                        { label: "Conditionnel",    onClick: handleStartConditionnel },
                        { label: "Test grammaire",  onClick: handleStartGrammarTest },
                      ],
                    },
                    {
                      id: "connecteurs",
                      label: "Connecteurs",
                      items: [
                        { label: "Connecteurs",      onClick: () => handleSelectPatternsCategory("connecteurs") },
                        { label: "Test connecteurs", onClick: handleStartPhrases },
                      ],
                    },
                    {
                      id: "être-avoir",
                      label: "MRS VANDERTRAMP",
                      items: [
                        { label: "Être / avoir",          onClick: handleStartEtreCards },
                        { label: "Test être / avoir",     onClick: handleStartEtreQuiz },
                        { label: "Liste des verbes", onClick: handleStartEtreGuide },
                      ],
                    },
                    {
                      id: "voyage",
                      label: "Voyage",
                      items: [
                        { label: "Restaurant",   onClick: () => handleSelectVoyageCategory("restaurant") },
                        { label: "Transport",    onClick: () => handleSelectVoyageCategory("transport") },
                        { label: "Hébergement",  onClick: () => handleSelectVoyageCategory("hebergement") },
                        { label: "Shopping",     onClick: () => handleSelectVoyageCategory("shopping") },
                        { label: "Orientation",  onClick: () => handleSelectVoyageCategory("orientation") },
                        { label: "Urgences",     onClick: () => handleSelectVoyageCategory("urgences") },
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
                                  {displayLabel(label)}
                                </button>
                                <button type="button" onClick={(e) => toggleFavorite(label, e)} aria-label={isFav ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-opacity ${isFav ? "text-(--color-muted)" : "text-(--color-muted)"}`}>
                                  <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>

                <div className="w-full rounded overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
                  <button
                    type="button"
                    onClick={handleStartVerbes}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand)/8 hover:text-(--color-brand) active:bg-(--color-brand)/15"
                  >
                    <Columns3 size={16} className="shrink-0" />
                    Verbes essentiels
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QUIZ / FLASHCARD SCREENS */}
          {appMode !== "home" && (
            <div className="flex min-h-full w-full flex-col items-center px-3 md:px-4">
            <div className="my-auto w-full py-6 md:py-10">

              {/* PARTICIPE */}
              {appMode === "participe" && (
                <>
                  {(participe.state.phase === QuizPhase.Answering || participe.state.phase === QuizPhase.Feedback) && participe.currentQuestion && (
                    <QuizCard question={participe.currentQuestion} answerState={participe.state.answerState} selectedIndex={participe.state.selectedIndex} onSelect={participe.selectAnswer} onNext={participe.nextQuestion} questionNumber={participe.progress.index + 1} total={participe.progress.total} isWeak={isWeak(participe.currentQuestion.verb.infinitive)} onToggleWeak={() => toggleWeak(participe.currentQuestion!.verb.infinitive)} />
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
                    <ImparfaitQuizCard question={imparfait.currentQuestion} answerState={imparfait.state.answerState} selectedIndex={imparfait.state.selectedIndex} onSelect={imparfait.selectAnswer} onNext={imparfait.nextQuestion} questionNumber={imparfait.progress.index + 1} total={imparfait.progress.total} isWeak={isWeak(imparfait.currentQuestion.verb.infinitive)} onToggleWeak={() => toggleWeak(imparfait.currentQuestion!.verb.infinitive)} />
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
                    <FuturQuizCard question={futur.currentQuestion} answerState={futur.state.answerState} selectedIndex={futur.state.selectedIndex} onSelect={futur.selectAnswer} onNext={futur.nextQuestion} questionNumber={futur.progress.index + 1} total={futur.progress.total} isWeak={isWeak(futur.currentQuestion.verb.infinitive)} onToggleWeak={() => toggleWeak(futur.currentQuestion!.verb.infinitive)} />
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
                    <ConditionnelQuizCard question={conditionnel.currentQuestion} answerState={conditionnel.state.answerState} selectedIndex={conditionnel.state.selectedIndex} onSelect={conditionnel.selectAnswer} onNext={conditionnel.nextQuestion} questionNumber={conditionnel.progress.index + 1} total={conditionnel.progress.total} isWeak={isWeak(conditionnel.currentQuestion.verb.infinitive)} onToggleWeak={() => toggleWeak(conditionnel.currentQuestion!.verb.infinitive)} />
                  )}
                  {conditionnel.state.phase === QuizPhase.Complete && (
                    <ResultScreen history={conditionnel.state.history} score={conditionnel.state.score} total={conditionnel.progress.total} onRestart={conditionnel.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* GRAMMAR TEST — mixed 5-tense quiz */}
              {appMode === "grammar-test" && (
                <>
                  {(grammarTest.state.phase === QuizPhase.Answering || grammarTest.state.phase === QuizPhase.Feedback) && grammarTest.currentQuestion && (() => {
                    const wrapper = grammarTest.currentQuestion;
                    const verbInfinitive = wrapper.q.verb.infinitive;
                    const common = {
                      answerState: grammarTest.state.answerState,
                      selectedIndex: grammarTest.state.selectedIndex,
                      onSelect: grammarTest.selectAnswer,
                      onNext: grammarTest.nextQuestion,
                      questionNumber: grammarTest.progress.index + 1,
                      total: grammarTest.progress.total,
                      isWeak: isWeak(verbInfinitive),
                      onToggleWeak: () => toggleWeak(verbInfinitive),
                    };
                    switch (wrapper.source) {
                      case "participe":    return <QuizCard            {...common} question={wrapper.q} />;
                      case "imparfait":    return <ImparfaitQuizCard   {...common} question={wrapper.q} />;
                      case "futur":        return <FuturQuizCard       {...common} question={wrapper.q} />;
                      case "conditionnel": return <ConditionnelQuizCard {...common} question={wrapper.q} />;
                      case "présent":      return <PresentQuizCard     {...common} question={wrapper.q} />;
                    }
                  })()}
                  {grammarTest.state.phase === QuizPhase.Complete && (
                    <ResultScreen history={grammarTest.state.history} score={grammarTest.state.score} total={grammarTest.progress.total} onRestart={grammarTest.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* DIFFICILES — mixed quiz from bookmarked weak verbs */}
              {appMode === "difficiles" && (
                <>
                  {difficiles.state.phase === QuizPhase.Idle && (
                    <div className="mx-auto w-full max-w-xl rounded-(--radius-card) bg-(--color-surface) shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-ink)/8">
                        <div className="flex items-center gap-2">
                          <Target size={16} className="text-(--color-ink)" />
                          <span className="text-sm font-semibold text-(--color-ink)">Mes difficiles</span>
                        </div>
                        {weakVerbList.length > 0 && (
                          <span className="text-xs font-bold text-(--color-muted)">
                            {weakVerbList.length}
                          </span>
                        )}
                      </div>

                      {weakVerbList.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                          <p className="text-sm font-medium text-(--color-ink)">Aucun verbe marqué</p>
                          <p className="text-xs text-(--color-muted) max-w-xs">
                            Pendant tes exercices, clique sur <span className="font-medium text-(--color-ink)">Marquer</span> pour ajouter un verbe ici.
                          </p>
                          <button type="button" onClick={handleGoHome} className="mt-2 rounded-(--radius-button) bg-(--color-brand) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150">
                            Commencer un exercice
                          </button>
                        </div>
                      ) : (
                        <>
                          <ul className="divide-y divide-(--color-ink)/6 max-h-[60vh] overflow-y-auto">
                            {weakVerbList.map(verb => (
                              <li key={verb.infinitive} className="flex items-center justify-between px-6 py-3 gap-3">
                                <div className="flex-1 min-w-0">
                                  <span className="font-semibold text-(--color-ink)" lang="fr">{verb.infinitive}</span>
                                  <span className="ml-2 text-xs text-(--color-muted)" lang="en">{verb.translation}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleWeak(verb.infinitive)}
                                  aria-label={`Retirer ${verb.infinitive}`}
                                  className="shrink-0 text-(--color-muted) hover:text-red-400 transition-colors duration-150"
                                >
                                  <Bookmark size={14} fill="currentColor" className="text-(--color-muted) hover:text-red-400 transition-colors duration-150" />
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="px-6 py-4 border-t border-(--color-ink)/8 flex items-center justify-between gap-3">
                            <p className="text-xs text-(--color-muted)">
                              {weakVerbList.length < 2 ? "Ajoute au moins 2 verbes pour commencer" : `${weakVerbList.length} verbe${weakVerbList.length > 1 ? "s" : ""} · quiz mixte`}
                            </p>
                            <button
                              type="button"
                              disabled={weakVerbList.length < 2}
                              onClick={() => difficiles.startQuiz(weakVerbList)}
                              className="rounded-(--radius-button) bg-(--color-brand) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Commencer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {(difficiles.state.phase === QuizPhase.Answering || difficiles.state.phase === QuizPhase.Feedback) && difficiles.currentQuestion && (() => {
                    const wrapper = difficiles.currentQuestion;
                    const verbInfinitive = wrapper.q.verb.infinitive;
                    const common = {
                      answerState: difficiles.state.answerState,
                      selectedIndex: difficiles.state.selectedIndex,
                      onSelect: difficiles.selectAnswer,
                      onNext: difficiles.nextQuestion,
                      questionNumber: difficiles.progress.index + 1,
                      total: difficiles.progress.total,
                      isWeak: isWeak(verbInfinitive),
                      onToggleWeak: () => toggleWeak(verbInfinitive),
                    };
                    switch (wrapper.source) {
                      case "participe":    return <QuizCard            {...common} question={wrapper.q} />;
                      case "imparfait":    return <ImparfaitQuizCard   {...common} question={wrapper.q} />;
                      case "futur":        return <FuturQuizCard       {...common} question={wrapper.q} />;
                      case "conditionnel": return <ConditionnelQuizCard {...common} question={wrapper.q} />;
                      case "présent":      return <PresentQuizCard     {...common} question={wrapper.q} />;
                    }
                  })()}
                  {difficiles.state.phase === QuizPhase.Complete && (
                    <ResultScreen history={difficiles.state.history} score={difficiles.state.score} total={difficiles.progress.total} onRestart={() => difficiles.restartQuiz(weakVerbList)} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* ORTHOGRAPHE — homophones (kept available but not in sidebar) */}
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
                    <PresentQuizCard question={présent.currentQuestion} answerState={présent.state.answerState} selectedIndex={présent.state.selectedIndex} onSelect={présent.selectAnswer} onNext={présent.nextQuestion} questionNumber={présent.progress.index + 1} total={présent.progress.total} isWeak={isWeak(présent.currentQuestion.verb.infinitive)} onToggleWeak={() => toggleWeak(présent.currentQuestion!.verb.infinitive)} />
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

              {/* ÊTRE / AVOIR — CARDS */}
              {appMode === "être-cards" && (
                <>
                  {pEtreAvoir.state.phase === "session" && pEtreAvoir.currentCard && (
                    <FlashcardView card={pEtreAvoir.currentCard} index={pEtreAvoir.progress.index} total={pEtreAvoir.progress.total} onRate={pEtreAvoir.rate} onSkip={pEtreAvoir.skip} onBack={pEtreAvoir.back} />
                  )}
                  {pEtreAvoir.state.phase === "complete" && (
                    <FlashcardResults sessionResults={pEtreAvoir.state.sessionResults} masteredCount={pEtreAvoir.masteredCount} totalCards={pEtreAvoir.totalCards} cards={pEtreAvoir.state.deck} onRestart={pEtreAvoir.restart} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* ÊTRE / AVOIR — QUIZ */}
              {appMode === "être-quiz" && (
                <>
                  {(etreQuiz.state.phase === QuizPhase.Answering || etreQuiz.state.phase === QuizPhase.Feedback) && etreQuiz.currentQuestion && (
                    <OrthographeQuizCard question={etreQuiz.currentQuestion} answerState={etreQuiz.state.answerState} selectedIndex={etreQuiz.state.selectedIndex} onSelect={etreQuiz.selectAnswer} onNext={etreQuiz.nextQuestion} questionNumber={etreQuiz.progress.index + 1} total={etreQuiz.progress.total} label="Choisissez l'auxiliaire correct" />
                  )}
                  {etreQuiz.state.phase === QuizPhase.Complete && (
                    <OrthographeResultScreen history={etreQuiz.state.history} score={etreQuiz.state.score} total={etreQuiz.progress.total} onRestart={etreQuiz.restartQuiz} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* LISTE MRS VANDERTRAMP */}
              {appMode === "être-guide" && <MrsVandertrampGuide />}

              {/* VERBES ESSENTIELS */}
              {appMode === "verbes" && <EssentialVerbsGuide />}

              {/* PATTERNS */}
              {appMode === "patterns" && (
                <>
                  {patternsCategory !== null && activeDeck.state.phase === "session" && activeDeck.currentCard && (
                    <FlashcardView card={activeDeck.currentCard} index={activeDeck.progress.index} total={activeDeck.progress.total} onRate={activeDeck.rate} onSkip={activeDeck.skip} onBack={activeDeck.back} isFavorite={isFavoriteCard(activeDeck.currentCard.id)} onToggleFavorite={() => toggleFavoriteCard(activeDeck.currentCard!.id)} />
                  )}
                  {patternsCategory !== null && activeDeck.state.phase === "complete" && (
                    <FlashcardResults sessionResults={activeDeck.state.sessionResults} masteredCount={activeDeck.masteredCount} totalCards={activeDeck.totalCards} cards={activeDeck.state.deck} onRestart={activeDeck.restart} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* MES PATTERNS */}
              {appMode === "mes-patterns" && (
                <>
                  {mesPatterns.state.phase === "idle" && (
                    <div className="mx-auto w-full max-w-xl rounded-(--radius-card) bg-(--color-surface) shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-ink)/8">
                        <div className="flex items-center gap-2">
                          <Heart size={16} className="text-(--color-ink)" />
                          <span className="text-sm font-semibold text-(--color-ink)">Mes patterns</span>
                        </div>
                        {favoriteCardList.length > 0 && (
                          <span className="text-xs font-bold text-(--color-muted)">{favoriteCardList.length}</span>
                        )}
                      </div>

                      {favoriteCardList.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                          <p className="text-sm font-medium text-(--color-ink)">Aucune phrase sauvegardée</p>
                          <p className="text-xs text-(--color-muted) max-w-xs">
                            Pendant les Patterns, clique sur <span className="font-medium text-(--color-ink)">♡</span> pour ajouter une phrase ici.
                          </p>
                          <button type="button" onClick={handleGoHome} className="mt-2 rounded-(--radius-button) bg-(--color-brand) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150">
                            Commencer un exercice
                          </button>
                        </div>
                      ) : (
                        <>
                          <ul className="divide-y divide-(--color-ink)/6 max-h-[60vh] overflow-y-auto">
                            {favoriteCardList.map(card => (
                              <li key={card.id} className="flex items-center justify-between px-6 py-3 gap-3">
                                <div className="flex-1 min-w-0">
                                  <span className="font-semibold text-(--color-ink) leading-snug line-clamp-2" lang="fr">{card.front}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleFavoriteCard(card.id)}
                                  aria-label={`Retirer "${card.front}"`}
                                  className="shrink-0 text-(--color-muted) hover:text-red-400 transition-colors duration-150"
                                >
                                  <Heart size={14} fill="currentColor" />
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="px-6 py-4 border-t border-(--color-ink)/8 flex items-center justify-between gap-3">
                            <p className="text-xs text-(--color-muted)">
                              {favoriteCardList.length} phrase{favoriteCardList.length > 1 ? "s" : ""} · révision ciblée
                            </p>
                            <button
                              type="button"
                              onClick={mesPatterns.startSession}
                              className="rounded-(--radius-button) bg-(--color-brand) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150"
                            >
                              Commencer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {mesPatterns.state.phase === "session" && mesPatterns.currentCard && (
                    <FlashcardView card={mesPatterns.currentCard} index={mesPatterns.progress.index} total={mesPatterns.progress.total} onRate={mesPatterns.rate} onSkip={mesPatterns.skip} onBack={mesPatterns.back} isFavorite={isFavoriteCard(mesPatterns.currentCard.id)} onToggleFavorite={() => toggleFavoriteCard(mesPatterns.currentCard!.id)} />
                  )}
                  {mesPatterns.state.phase === "complete" && (
                    <FlashcardResults sessionResults={mesPatterns.state.sessionResults} masteredCount={mesPatterns.masteredCount} totalCards={mesPatterns.totalCards} cards={mesPatterns.state.deck} onRestart={mesPatterns.restart} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* VOCABULAIRE */}
              {appMode === "vocabulaire" && (
                <>
                  {vocabulaire.state.phase === "session" && vocabulaire.currentCard && (
                    <FlashcardView card={vocabulaire.currentCard} index={vocabulaire.progress.index} total={vocabulaire.progress.total} onRate={vocabulaire.rate} onSkip={vocabulaire.skip} onBack={vocabulaire.back} />
                  )}
                  {vocabulaire.state.phase === "complete" && (
                    <FlashcardResults sessionResults={vocabulaire.state.sessionResults} masteredCount={vocabulaire.masteredCount} totalCards={vocabulaire.totalCards} cards={vocabulaire.state.deck} onRestart={vocabulaire.restart} onHome={handleGoHome} />
                  )}
                </>
              )}

              {/* TOURISTE */}
              {appMode === "touriste" && (
                <>
                  {activeTouristeDeck.state.phase === "session" && activeTouristeDeck.currentCard && (
                    <FlashcardView card={activeTouristeDeck.currentCard} index={activeTouristeDeck.progress.index} total={activeTouristeDeck.progress.total} onRate={activeTouristeDeck.rate} onSkip={activeTouristeDeck.skip} onBack={activeTouristeDeck.back} />
                  )}
                  {activeTouristeDeck.state.phase === "complete" && (
                    <FlashcardResults sessionResults={activeTouristeDeck.state.sessionResults} masteredCount={activeTouristeDeck.masteredCount} totalCards={activeTouristeDeck.totalCards} cards={activeTouristeDeck.state.deck} onRestart={activeTouristeDeck.restart} onHome={handleGoHome} />
                  )}
                </>
              )}

            </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
