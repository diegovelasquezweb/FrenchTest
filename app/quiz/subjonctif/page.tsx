"use client";

import { useSubjonctifQuiz } from "@/src/hooks/useSubjonctifQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { VerbConjugationCard } from "@/src/components/quiz/VerbConjugationCard";
import { SubjonctifTable } from "@/src/components/tables/SubjonctifTable";
import { SubjonctifWrongTable } from "@/src/components/tables/SubjonctifWrongTable";
import { ResultScreen } from "@/src/components/quiz/ResultScreen";
import { QuizTemplate } from "@/src/components/templates";

export default function SubjonctifPage() {
  const quiz = useSubjonctifQuiz();
  const { isWeak, toggleWeak } = useWeakVerbs();

  return (
    <QuizTemplate
      title="Subjonctif"
      quiz={quiz}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <VerbConjugationCard
          question={question}
          tenseName="Subjonctif présent"
          correctFeedback={<SubjonctifTable verb={question.verb} />}
          wrongFeedback={(wrongForm, wrongSubject) => (
            <SubjonctifWrongTable
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
