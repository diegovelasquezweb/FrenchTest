"use client";

import { useCompleterMotsQuiz } from "@/src/hooks/useCompleterMotsQuiz";
import { OrthographeQuizCard } from "@/src/components/quiz/OrthographeQuizCard";
import { OrthographeResultScreen } from "@/src/components/quiz/OrthographeResultScreen";
import { QuizTemplate } from "@/src/components/templates";

export default function CompleterMotsPage() {
  const quiz = useCompleterMotsQuiz();

  return (
    <QuizTemplate
      title="Compléter les mots"
      quiz={quiz}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <OrthographeQuizCard
          question={question}
          answerState={answerState}
          selectedIndex={selectedIndex}
          onSelect={quiz.selectAnswer}
          onNext={quiz.nextQuestion}
          questionNumber={questionNumber}
          total={total}
          label="Complétez le mot correct (vocabulaire + accents)"
        />
      )}
      renderResult={({ score, total, onRestart, onHome }) => (
        <OrthographeResultScreen
          history={quiz.state.history}
          score={score}
          total={total}
          onRestart={onRestart}
          onHome={onHome}
        />
      )}
    />
  );
}

