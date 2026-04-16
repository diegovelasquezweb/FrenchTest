"use client";

import { usePresentQuiz } from "@/src/hooks/usePresentQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { VerbConjugationCard } from "@/src/components/VerbConjugationCard";
import { PresentTable } from "@/src/components/PresentTable";
import { PresentWrongTable } from "@/src/components/PresentWrongTable";
import { ResultScreen } from "@/src/components/ResultScreen";
import { QuizShell } from "@/src/components/shells";

export default function PresentPage() {
  const quiz = usePresentQuiz();
  const { isWeak, toggleWeak } = useWeakVerbs();

  return (
    <QuizShell
      title="Présent"
      quiz={quiz}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <VerbConjugationCard
          question={question}
          tenseName="Présent"
          correctFeedback={<PresentTable verb={question.verb} />}
          wrongFeedback={(wrongForm, wrongSubject) => (
            <PresentWrongTable
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
