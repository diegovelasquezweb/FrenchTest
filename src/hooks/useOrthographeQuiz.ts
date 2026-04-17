import { ORTHOGRAPHE_PHRASES } from "../data/orthographePhrases";
import { createPhraseQuiz, type PhraseQuizReturn } from "./createPhraseQuiz";

export type UseOrthographeQuizReturn = PhraseQuizReturn;

export const useOrthographeQuiz = createPhraseQuiz(ORTHOGRAPHE_PHRASES);
