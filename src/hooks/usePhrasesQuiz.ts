import { PHRASES_DISCOURS } from "../data/phrasesDiscours";
import { createPhraseQuiz, type PhraseQuizReturn } from "./createPhraseQuiz";

export type UsePhrasesQuizReturn = PhraseQuizReturn;

export const usePhrasesQuiz = createPhraseQuiz(PHRASES_DISCOURS);
