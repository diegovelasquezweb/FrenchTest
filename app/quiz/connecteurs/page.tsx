"use client";

import { usePhrasesQuiz } from "@/src/hooks/usePhrasesQuiz";
import { OrthographeQuizCard } from "@/src/components/quiz/OrthographeQuizCard";
import { OrthographeResultScreen } from "@/src/components/quiz/OrthographeResultScreen";
import { QuizShell } from "@/src/components/templates";

export default function ConnecteursPage() {
  const quiz = usePhrasesQuiz();

  return (
    <QuizShell
      title="Test connecteurs"
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
          label="Complétez avec la bonne expression"
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
