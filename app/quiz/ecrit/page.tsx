"use client";

import { useEcritQuiz } from "@/src/hooks/useEcritQuiz";
import { OrthographeQuizCard } from "@/src/components/OrthographeQuizCard";
import { OrthographeResultScreen } from "@/src/components/OrthographeResultScreen";
import { QuizShell } from "@/src/components/shells";

export default function EcritPage() {
  const quiz = useEcritQuiz();

  return (
    <QuizShell
      title="Test écrit"
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
          label="Lettre formelle — complétez l'expression"
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
