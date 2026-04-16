"use client";

import { useArticlesQuiz } from "@/src/hooks/useArticlesQuiz";
import { ArticlesQuizCard } from "@/src/components/quiz/ArticlesQuizCard";
import { OrthographeResultScreen } from "@/src/components/quiz/OrthographeResultScreen";
import { QuizShell } from "@/src/components/templates";

export default function ArticlesPage() {
  const quiz = useArticlesQuiz();

  return (
    <QuizShell
      title="Articles & contractions"
      quiz={quiz}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <ArticlesQuizCard
          question={question}
          answerState={answerState}
          selectedIndex={selectedIndex}
          onSelect={quiz.selectAnswer}
          onNext={quiz.nextQuestion}
          questionNumber={questionNumber}
          total={total}
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
