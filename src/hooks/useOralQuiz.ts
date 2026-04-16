import { PHRASES_ORAL } from "../data/phrasesOral";
import { createPhraseQuiz, type PhraseQuizReturn } from "./createPhraseQuiz";

export type UseOralQuizReturn = PhraseQuizReturn;

export const useOralQuiz = createPhraseQuiz(PHRASES_ORAL);
