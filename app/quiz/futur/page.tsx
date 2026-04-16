"use client";

import { useFuturQuiz } from "@/src/hooks/useFuturQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { VerbConjugationCard } from "@/src/components/VerbConjugationCard";
import { FuturTable } from "@/src/components/FuturTable";
import { FuturWrongTable } from "@/src/components/FuturWrongTable";
import { ResultScreen } from "@/src/components/ResultScreen";
import { QuizShell } from "@/src/components/shells";

export default function FuturPage() {
  const quiz = useFuturQuiz();
  const { isWeak, toggleWeak } = useWeakVerbs();

  return (
    <QuizShell
      title="Futur simple"
      quiz={quiz}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <VerbConjugationCard
          question={question}
          tenseName="Futur simple"
          correctFeedback={<FuturTable verb={question.verb} futur3sg={question.futur3sg} />}
          wrongFeedback={(wrongForm, wrongSubject) => (
            <FuturWrongTable
              verb={question.verb}
              wrongForm={wrongForm}
              wrongSubject={wrongSubject}
              targetSubject={question.targetSubject}
              futur3sg={question.futur3sg}
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
          history={quiz.state.history.map((e) => ({ verb: e.verb, picked: e.picked, correct: e.correct }))}
          score={score}
          total={total}
          onRestart={onRestart}
          onHome={onHome}
        />
      )}
    />
  );
}
