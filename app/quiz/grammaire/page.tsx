"use client";

import { useGrammarQuiz } from "@/src/hooks/useGrammarQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { QuizCard } from "@/src/components/QuizCard";
import { VerbConjugationCard } from "@/src/components/VerbConjugationCard";
import { ImparfaitTable } from "@/src/components/ImparfaitTable";
import { ImparfaitWrongTable } from "@/src/components/ImparfaitWrongTable";
import { FuturTable } from "@/src/components/FuturTable";
import { FuturWrongTable } from "@/src/components/FuturWrongTable";
import { ConditionnelTable } from "@/src/components/ConditionnelTable";
import { ConditionnelWrongTable } from "@/src/components/ConditionnelWrongTable";
import { PresentTable } from "@/src/components/PresentTable";
import { PresentWrongTable } from "@/src/components/PresentWrongTable";
import { SubjonctifTable } from "@/src/components/SubjonctifTable";
import { SubjonctifWrongTable } from "@/src/components/SubjonctifWrongTable";
import { PlusQueParfaitTable } from "@/src/components/PlusQueParfaitTable";
import { PlusQueParfaitWrongTable } from "@/src/components/PlusQueParfaitWrongTable";
import { ResultScreen } from "@/src/components/ResultScreen";
import { QuizShell, defaultAnnouncement } from "@/src/components/shells";

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
