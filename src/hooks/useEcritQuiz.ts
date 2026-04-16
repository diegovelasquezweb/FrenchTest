import { PHRASES_ECRIT } from "../data/phrasesEcrit";
import { createPhraseQuiz, type PhraseQuizReturn } from "./createPhraseQuiz";

export type UseEcritQuizReturn = PhraseQuizReturn;

export const useEcritQuiz = createPhraseQuiz(PHRASES_ECRIT);
