"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { QuizPhase } from "@/src/types";
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

export default function GrammairePage() {
  const router = useRouter();
  const quiz = useGrammarQuiz();
  const { isWeak, toggleWeak } = useWeakVerbs();
  const [announcement, setAnnouncement] = useState("");
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => { quiz.startQuiz(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const phase = quiz.state.phase;
      if (phase === QuizPhase.Answering || phase === QuizPhase.Feedback) {
        const d = parseInt(e.key, 10);
        if (d >= 1 && d <= 4) quiz.selectAnswer(d - 1);
      }
      if (phase === QuizPhase.Feedback && e.key === "Enter") quiz.nextQuestion();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quiz]);

  useEffect(() => {
    if (quiz.state.phase !== QuizPhase.Feedback || !quiz.currentQuestion) { setAnnouncement(""); return; }
    const wrapper = quiz.currentQuestion;
    const correct = wrapper.q.options[wrapper.q.correctIndex] ?? "";
    setAnnouncement(quiz.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
  }, [quiz.state.phase, quiz.state.answerState, quiz.currentQuestion]);

  function renderCard() {
    if ((quiz.state.phase !== QuizPhase.Answering && quiz.state.phase !== QuizPhase.Feedback) || !quiz.currentQuestion) return null;
    const wrapper = quiz.currentQuestion;
    const verbInfinitive = wrapper.q.verb.infinitive;
    const common = {
      answerState: quiz.state.answerState,
      selectedIndex: quiz.state.selectedIndex,
      onSelect: quiz.selectAnswer,
      onNext: quiz.nextQuestion,
      questionNumber: quiz.progress.index + 1,
      total: quiz.progress.total,
      isWeak: isWeak(verbInfinitive),
      onToggleWeak: () => toggleWeak(verbInfinitive),
    };
    switch (wrapper.source) {
      case "participe":        return <QuizCard             {...common} question={wrapper.q} />;
      case "imparfait":        return <ImparfaitQuizCard    {...common} question={wrapper.q} />;
      case "futur":            return <FuturQuizCard        {...common} question={wrapper.q} />;
      case "conditionnel":     return <ConditionnelQuizCard {...common} question={wrapper.q} />;
      case "présent":          return <PresentQuizCard      {...common} question={wrapper.q} />;
      case "subjonctif":       return <SubjonctifQuizCard   {...common} question={wrapper.q} />;
      case "plus-que-parfait": return <PlusQueParfaitQuizCard {...common} question={wrapper.q} />;
      default:                 return null;
    }
  }

  return (
    <AuthGate>
      {renderCard()}
      {quiz.state.phase === QuizPhase.Complete && (
        <ResultScreen
          history={quiz.state.history}
          score={quiz.state.score}
          total={quiz.progress.total}
          onRestart={quiz.restartQuiz}
          onHome={() => router.push("/")}
        />
      )}
      <div ref={liveRef} role="status" aria-live="polite" className="sr-only">{announcement}</div>
    </AuthGate>
  );
}
