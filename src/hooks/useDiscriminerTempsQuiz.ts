import { PHRASES_DISCRIMINER_TEMPS } from "../data/phrasesDiscriminerTemps";
import { createPhraseQuiz, type PhraseQuizReturn } from "./createPhraseQuiz";

export type UseDiscriminerTempsQuizReturn = PhraseQuizReturn;

export const useDiscriminerTempsQuiz = createPhraseQuiz(PHRASES_DISCRIMINER_TEMPS);
