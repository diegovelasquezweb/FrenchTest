"use client";

import { useGrammarQuiz } from "@/src/hooks/useGrammarQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { QuizCard } from "@/src/components/quiz/QuizCard";
import { VerbConjugationCard } from "@/src/components/quiz/VerbConjugationCard";
import { ImparfaitTable } from "@/src/components/tables/ImparfaitTable";
import { ImparfaitWrongTable } from "@/src/components/tables/ImparfaitWrongTable";
import { FuturTable } from "@/src/components/tables/FuturTable";
import { FuturWrongTable } from "@/src/components/tables/FuturWrongTable";
import { ConditionnelTable } from "@/src/components/tables/ConditionnelTable";
import { ConditionnelWrongTable } from "@/src/components/tables/ConditionnelWrongTable";
import { PresentTable } from "@/src/components/tables/PresentTable";
import { PresentWrongTable } from "@/src/components/tables/PresentWrongTable";
import { SubjonctifTable } from "@/src/components/tables/SubjonctifTable";
import { SubjonctifWrongTable } from "@/src/components/tables/SubjonctifWrongTable";
import { PlusQueParfaitTable } from "@/src/components/tables/PlusQueParfaitTable";
import { PlusQueParfaitWrongTable } from "@/src/components/tables/PlusQueParfaitWrongTable";
import { ResultScreen } from "@/src/components/quiz/ResultScreen";
import { QuizShell, defaultAnnouncement } from "@/src/components/templates";

export default function GrammairePage() {
  const quiz = useGrammarQuiz();
  const { isWeak, toggleWeak } = useWeakVerbs();

  return (
    <QuizShell
      title="Test grammaire"
      quiz={quiz}
      buildAnnouncement={(wrapper, answerState) =>
        defaultAnnouncement(wrapper.q, answerState)
      }
      renderCard={({ question: wrapper, answerState, selectedIndex, questionNumber, total }) => {
        const verbInfinitive = wrapper.q.verb.infinitive;
        const common = {
          answerState,
          selectedIndex,
          onSelect: quiz.selectAnswer,
          onNext: quiz.nextQuestion,
          questionNumber,
          total,
          isWeak: isWeak(verbInfinitive),
          onToggleWeak: () => toggleWeak(verbInfinitive),
        };
        switch (wrapper.source) {
          case "participe":
            return <QuizCard {...common} question={wrapper.q} />;
          case "imparfait":
            return (
              <VerbConjugationCard
                {...common}
                question={wrapper.q}
                tenseName="Imparfait"
                correctFeedback={<ImparfaitTable verb={wrapper.q.verb} imparfait3sg={wrapper.q.imparfait3sg} />}
                wrongFeedback={(wrongForm, wrongSubject) => (
                  <ImparfaitWrongTable
                    verb={wrapper.q.verb}
                    wrongForm={wrongForm}
                    wrongSubject={wrongSubject}
                    targetSubject={wrapper.q.targetSubject}
                    imparfait3sg={wrapper.q.imparfait3sg}
                  />
                )}
              />
            );
          case "futur":
            return (
              <VerbConjugationCard
                {...common}
                question={wrapper.q}
                tenseName="Futur simple"
                correctFeedback={<FuturTable verb={wrapper.q.verb} futur3sg={wrapper.q.futur3sg} />}
                wrongFeedback={(wrongForm, wrongSubject) => (
                  <FuturWrongTable
                    verb={wrapper.q.verb}
                    wrongForm={wrongForm}
                    wrongSubject={wrongSubject}
                    targetSubject={wrapper.q.targetSubject}
                    futur3sg={wrapper.q.futur3sg}
                  />
                )}
              />
            );
          case "conditionnel":
            return (
              <VerbConjugationCard
                {...common}
                question={wrapper.q}
                tenseName="Conditionnel"
                correctFeedback={<ConditionnelTable verb={wrapper.q.verb} conditionnel3sg={wrapper.q.conditionnel3sg} />}
                wrongFeedback={(wrongForm, wrongSubject) => (
                  <ConditionnelWrongTable
                    verb={wrapper.q.verb}
                    wrongForm={wrongForm}
                    wrongSubject={wrongSubject}
                    targetSubject={wrapper.q.targetSubject}
                    conditionnel3sg={wrapper.q.conditionnel3sg}
                  />
                )}
              />
            );
          case "présent":
            return (
              <VerbConjugationCard
                {...common}
                question={wrapper.q}
                tenseName="Présent"
                correctFeedback={<PresentTable verb={wrapper.q.verb} />}
                wrongFeedback={(wrongForm, wrongSubject) => (
                  <PresentWrongTable
                    verb={wrapper.q.verb}
                    wrongForm={wrongForm}
                    wrongSubject={wrongSubject}
                    targetSubject={wrapper.q.targetSubject}
                  />
                )}
              />
            );
          case "subjonctif":
            return (
              <VerbConjugationCard
                {...common}
                question={wrapper.q}
                tenseName="Subjonctif présent"
                correctFeedback={<SubjonctifTable verb={wrapper.q.verb} />}
                wrongFeedback={(wrongForm, wrongSubject) => (
                  <SubjonctifWrongTable
                    verb={wrapper.q.verb}
                    wrongForm={wrongForm}
                    wrongSubject={wrongSubject}
                    targetSubject={wrapper.q.targetSubject}
                  />
                )}
              />
            );
          case "plus-que-parfait":
            return (
              <VerbConjugationCard
                {...common}
                question={wrapper.q}
                tenseName="Plus-que-parfait"
                correctFeedback={<PlusQueParfaitTable verb={wrapper.q.verb} />}
                wrongFeedback={(wrongForm, wrongSubject) => (
                  <PlusQueParfaitWrongTable
                    verb={wrapper.q.verb}
                    wrongForm={wrongForm}
                    wrongSubject={wrongSubject}
                    targetSubject={wrapper.q.targetSubject}
                  />
                )}
              />
            );
          default:
            return null;
        }
      }}
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
