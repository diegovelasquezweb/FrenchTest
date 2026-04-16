"use client";

import { useOrthographeQuiz } from "@/src/hooks/useOrthographeQuiz";
import { OrthographeQuizCard } from "@/src/components/OrthographeQuizCard";
import { OrthographeResultScreen } from "@/src/components/OrthographeResultScreen";
import { QuizShell } from "@/src/components/shells";

export default function OrthographePage() {
  const quiz = useOrthographeQuiz();

  return (
    <QuizShell
      title="Orthographe"
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
