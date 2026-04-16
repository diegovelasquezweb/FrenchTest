"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { QuizPhase } from "@/src/types";
import { usePresentQuiz } from "@/src/hooks/usePresentQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { PresentQuizCard } from "@/src/components/PresentQuizCard";
import { ResultScreen } from "@/src/components/ResultScreen";

export default function PresentPage() {
  const router = useRouter();
  const quiz = usePresentQuiz();
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
    const correct = quiz.currentQuestion.options[quiz.currentQuestion.correctIndex] ?? "";
    setAnnouncement(quiz.state.answerState === "correct" ? "Correct !" : `Incorrect. La bonne réponse est ${correct}.`);
  }, [quiz.state.phase, quiz.state.answerState, quiz.currentQuestion]);

  return (
    <AuthGate>
      {(quiz.state.phase === QuizPhase.Answering || quiz.state.phase === QuizPhase.Feedback) && quiz.currentQuestion && (
        <PresentQuizCard
          question={quiz.currentQuestion}
          answerState={quiz.state.answerState}
          selectedIndex={quiz.state.selectedIndex}
          onSelect={quiz.selectAnswer}
          onNext={quiz.nextQuestion}
          questionNumber={quiz.progress.index + 1}
          total={quiz.progress.total}
          isWeak={isWeak(quiz.currentQuestion.verb.infinitive)}
          onToggleWeak={() => toggleWeak(quiz.currentQuestion!.verb.infinitive)}
        />
      )}
      {quiz.state.phase === QuizPhase.Complete && (
        <ResultScreen
          history={quiz.state.history.map(e => ({ verb: e.question.verb, picked: e.picked, correct: e.correct }))}
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
