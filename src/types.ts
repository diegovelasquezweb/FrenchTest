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
  currentWrongIndex: number | null;
  everWrong: boolean;
}
