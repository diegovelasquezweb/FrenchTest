export type TenseName = "présent" | "imparfait" | "futur" | "conditionnel";

export type ParticipleEnding =
  | "-é"
  | "-i"
  | "-u"
  | "-is"
  | "-it"
  | "-ert"
  | "-int"
  | "other";

export interface Verb {
  infinitive: string;
  participle: string;
  translation: string;
  translationEs: string;
  ending: ParticipleEnding;
  auxiliary: "avoir" | "être";
  irregular: boolean;
  /** Three confusing conjugations from other tenses */
  confusers: readonly [string, string, string];
  /** Tense name for each confuser — used to build the explanation table */
  confuserTenses: readonly [TenseName, TenseName, TenseName];
}

export interface QuizQuestion {
  verb: Verb;
  options: string[];
  correctIndex: number;
}

export interface ImparfaitQuestion {
  verb: Verb;
  /** Raw conjugated forms without subject pronoun (e.g. "parlions") */
  options: string[];
  correctIndex: number;
  /** The subject being drilled (e.g. "nous") */
  targetSubject: string;
  /** Which subject group each option belongs to */
  optionSubjects: string[];
  /** 3sg imparfait form — used to build the full conjugation table */
  imparfait3sg: string;
}

export interface OrthographeQuestion {
  sentence: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface PresentQuestion {
  verb: Verb;
  options: string[];
  correctIndex: number;
  targetSubject: string;
  optionSubjects: string[];
  present3sg: string;
}

export interface FuturQuestion {
  verb: Verb;
  options: string[];
  correctIndex: number;
  targetSubject: string;
  optionSubjects: string[];
  futur3sg: string;
}

export interface ConditionnelQuestion {
  verb: Verb;
  /** Raw conjugated forms without subject pronoun (e.g. "parlerions") */
  options: string[];
  correctIndex: number;
  /** The subject being drilled (e.g. "nous") */
  targetSubject: string;
  /** Which subject group each option belongs to */
  optionSubjects: string[];
  /** 3sg conditionnel form — used to build the full conjugation table */
  conditionnel3sg: string;
}

export enum AnswerState {
  Idle = "idle",
  Correct = "correct",
  Wrong = "wrong",
}

export enum QuizPhase {
  Idle = "idle",
  Answering = "answering",
  Feedback = "feedback",
  Complete = "complete",
}

export type FlashcardRating = 0 | 1 | 2;

export interface Flashcard {
  id: string;
  front: string;
  translationEn: string;
  translationEs: string;
  usage: string;
  category: "oral" | "oral-persuasion" | "écrit-faits-divers" | "connecteurs" | "argumentation" | "vocabulaire" | "touriste" | "être-avoir";
  subCategory?: string;
}

export interface CardProgress {
  score: 0 | 1 | 2;
  consecutiveCorrect: number;
  lastSeen: number;
}

export interface HistoryEntry {
  verb: Verb;
  picked: string;
  correct: boolean;
}

export interface QuizState {
  phase: QuizPhase;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  selectedIndex: number | null;
  answerState: AnswerState;
  history: HistoryEntry[];
  everWrong: boolean;
}
