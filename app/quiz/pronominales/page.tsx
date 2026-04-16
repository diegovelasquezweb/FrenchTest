"use client";

import { usePronominalQuiz } from "@/src/hooks/usePronominalQuiz";
import { PronominalQuizCard } from "@/src/components/quiz/PronominalQuizCard";
import { ResultScreen } from "@/src/components/quiz/ResultScreen";
import { QuizTemplate } from "@/src/components/templates";

export default function PronominalesPage() {
  const quiz = usePronominalQuiz();

  return (
    <QuizTemplate
      title="Pronominales"
      quiz={quiz}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <PronominalQuizCard
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
        <ResultScreen
          history={[]}
          score={score}
          total={total}
          onRestart={onRestart}
          onHome={onHome}
        />
      )}
    />
  );
}
