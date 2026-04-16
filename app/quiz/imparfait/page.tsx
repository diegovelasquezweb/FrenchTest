"use client";

import { useImparfaitQuiz } from "@/src/hooks/useImparfaitQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { VerbConjugationCard } from "@/src/components/quiz/VerbConjugationCard";
import { ImparfaitTable } from "@/src/components/tables/ImparfaitTable";
import { ImparfaitWrongTable } from "@/src/components/tables/ImparfaitWrongTable";
import { ResultScreen } from "@/src/components/quiz/ResultScreen";
import { QuizShell } from "@/src/components/templates";

export default function ImparfaitPage() {
  const quiz = useImparfaitQuiz();
  const { isWeak, toggleWeak } = useWeakVerbs();

  return (
    <QuizShell
      title="Imparfait"
      quiz={quiz}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <VerbConjugationCard
          question={question}
          tenseName="Imparfait"
          correctFeedback={<ImparfaitTable verb={question.verb} imparfait3sg={question.imparfait3sg} />}
          wrongFeedback={(wrongForm, wrongSubject) => (
            <ImparfaitWrongTable
              verb={question.verb}
              wrongForm={wrongForm}
              wrongSubject={wrongSubject}
              targetSubject={question.targetSubject}
              imparfait3sg={question.imparfait3sg}
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
