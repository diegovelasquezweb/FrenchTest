import { ARTICLES_PHRASES } from "../data/articlesPhrases";
import { createPhraseQuiz, type PhraseQuizReturn } from "./createPhraseQuiz";

export type UseArticlesQuizReturn = PhraseQuizReturn;

export const useArticlesQuiz = createPhraseQuiz(ARTICLES_PHRASES);
