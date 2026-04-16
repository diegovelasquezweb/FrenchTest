"use client";

import { useEtreQuiz } from "@/src/hooks/useEtreQuiz";
import { OrthographeQuizCard } from "@/src/components/quiz/OrthographeQuizCard";
import { OrthographeResultScreen } from "@/src/components/quiz/OrthographeResultScreen";
import { QuizTemplate } from "@/src/components/templates";

export default function EtreAvoirPage() {
  const quiz = useEtreQuiz();

  return (
    <QuizTemplate
      title="Test être / avoir"
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
          label="Choisissez l'auxiliaire correct"
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
