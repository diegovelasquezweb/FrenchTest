"use client";

import { useOralQuiz } from "@/src/hooks/useOralQuiz";
import { OrthographeQuizCard } from "@/src/components/quiz/OrthographeQuizCard";
import { OrthographeResultScreen } from "@/src/components/quiz/OrthographeResultScreen";
import { QuizShell } from "@/src/components/templates";

export default function OralPage() {
  const quiz = useOralQuiz();

  return (
    <QuizShell
      title="Test oral"
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
          label="Expression orale — complétez la phrase"
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
