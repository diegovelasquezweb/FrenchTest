import { PHRASES_ETRE } from "../data/phrasesEtre";
import { createPhraseQuiz, type PhraseQuizReturn } from "./createPhraseQuiz";

export type UseEtreQuizReturn = PhraseQuizReturn;

export const useEtreQuiz = createPhraseQuiz(PHRASES_ETRE);
