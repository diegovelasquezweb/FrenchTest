"use client";

import { useGrammarQuiz } from "@/src/hooks/useGrammarQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { QuizCard } from "@/src/components/QuizCard";
import { ImparfaitQuizCard } from "@/src/components/ImparfaitQuizCard";
import { FuturQuizCard } from "@/src/components/FuturQuizCard";
import { ConditionnelQuizCard } from "@/src/components/ConditionnelQuizCard";
import { PresentQuizCard } from "@/src/components/PresentQuizCard";
import { SubjonctifQuizCard } from "@/src/components/SubjonctifQuizCard";
import { PlusQueParfaitQuizCard } from "@/src/components/PlusQueParfaitQuizCard";
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
          case "participe":         return <QuizCard               {...common} question={wrapper.q} />;
          case "imparfait":         return <ImparfaitQuizCard      {...common} question={wrapper.q} />;
          case "futur":             return <FuturQuizCard          {...common} question={wrapper.q} />;
          case "conditionnel":      return <ConditionnelQuizCard   {...common} question={wrapper.q} />;
          case "présent":           return <PresentQuizCard        {...common} question={wrapper.q} />;
          case "subjonctif":        return <SubjonctifQuizCard     {...common} question={wrapper.q} />;
          case "plus-que-parfait":  return <PlusQueParfaitQuizCard {...common} question={wrapper.q} />;
          default:                  return null;
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
