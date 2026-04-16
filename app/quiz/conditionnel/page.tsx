"use client";

import { useConditionnelQuiz } from "@/src/hooks/useConditionnelQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { VerbConjugationCard } from "@/src/components/quiz/VerbConjugationCard";
import { ConditionnelTable } from "@/src/components/tables/ConditionnelTable";
import { ConditionnelWrongTable } from "@/src/components/tables/ConditionnelWrongTable";
import { ResultScreen } from "@/src/components/quiz/ResultScreen";
import { QuizTemplate } from "@/src/components/templates";

export default function ConditionnelPage() {
  const quiz = useConditionnelQuiz();
  const { isWeak, toggleWeak } = useWeakVerbs();

  return (
    <QuizTemplate
      title="Conditionnel"
      quiz={quiz}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <VerbConjugationCard
          question={question}
          tenseName="Conditionnel"
          correctFeedback={<ConditionnelTable verb={question.verb} conditionnel3sg={question.conditionnel3sg} />}
          wrongFeedback={(wrongForm, wrongSubject) => (
            <ConditionnelWrongTable
              verb={question.verb}
              wrongForm={wrongForm}
              wrongSubject={wrongSubject}
              targetSubject={question.targetSubject}
              conditionnel3sg={question.conditionnel3sg}
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
