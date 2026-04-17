import { PHRASES_COMPLETER_MOTS } from "../data/phrasesCompleterMots";
import { createPhraseQuiz, type PhraseQuizReturn } from "./createPhraseQuiz";

export type UseCompleterMotsQuizReturn = PhraseQuizReturn;

export const useCompleterMotsQuiz = createPhraseQuiz(PHRASES_COMPLETER_MOTS);

