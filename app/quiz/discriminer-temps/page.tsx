"use client";

import { useDiscriminerTempsQuiz } from "@/src/hooks/useDiscriminerTempsQuiz";
import { OrthographeQuizCard } from "@/src/components/quiz/OrthographeQuizCard";
import { OrthographeResultScreen } from "@/src/components/quiz/OrthographeResultScreen";
import { QuizTemplate } from "@/src/components/templates";

export default function DiscriminerTempsPage() {
  const quiz = useDiscriminerTempsQuiz();

  return (
    <QuizTemplate
      title="Discriminer les temps"
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
          label="Choisissez la bonne forme (imparfait / futur / subjonctif)"
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
