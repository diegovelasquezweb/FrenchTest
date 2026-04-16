"use client";

import { useSubjonctifQuiz } from "@/src/hooks/useSubjonctifQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { VerbConjugationCard } from "@/src/components/VerbConjugationCard";
import { SubjonctifTable } from "@/src/components/SubjonctifTable";
import { SubjonctifWrongTable } from "@/src/components/SubjonctifWrongTable";
import { ResultScreen } from "@/src/components/ResultScreen";
import { QuizShell } from "@/src/components/shells";

export default function SubjonctifPage() {
  const quiz = useSubjonctifQuiz();
  const { isWeak, toggleWeak } = useWeakVerbs();

  return (
    <QuizShell
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
