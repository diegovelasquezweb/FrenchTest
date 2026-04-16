"use client";

import { usePlusQueParfaitQuiz } from "@/src/hooks/usePlusQueParfaitQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { VerbConjugationCard } from "@/src/components/quiz/VerbConjugationCard";
import { PlusQueParfaitTable } from "@/src/components/tables/PlusQueParfaitTable";
import { PlusQueParfaitWrongTable } from "@/src/components/tables/PlusQueParfaitWrongTable";
import { ResultScreen } from "@/src/components/quiz/ResultScreen";
import { QuizTemplate } from "@/src/components/templates";

export default function PlusQueParfaitPage() {
  const quiz = usePlusQueParfaitQuiz();
  const { isWeak, toggleWeak } = useWeakVerbs();

  return (
    <QuizTemplate
      title="Plus-que-parfait"
      quiz={quiz}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <VerbConjugationCard
          question={question}
          tenseName="Plus-que-parfait"
          correctFeedback={<PlusQueParfaitTable verb={question.verb} />}
          wrongFeedback={(wrongForm, wrongSubject) => (
            <PlusQueParfaitWrongTable
              verb={question.verb}
              wrongForm={wrongForm}
              wrongSubject={wrongSubject}
              targetSubject={question.targetSubject}
            />
          )}
          answerState={answerState}
          selectedIndex={selectedIndex}
          onSelect={quiz.selectAnswer}
          onNext={quiz.nextQuestion}
          questionNumber={questionNumber}
          total={total}
          isWeak={isWeak(question.verb.infinitive)}
          onToggleWeak={() => toggleWeak(question.verb.infinitive)}
        />
      )}
      renderResult={({ score, total, onRestart, onHome }) => (
        <ResultScreen
          history={quiz.state.history.map((e) => ({ verb: e.question.verb, picked: e.picked, correct: e.correct }))}
          score={score}
          total={total}
          onRestart={onRestart}
          onHome={onHome}
        />
      )}
    />
  );
}
