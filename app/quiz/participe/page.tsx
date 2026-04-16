"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { AuthGate } from "@/src/layout/AuthGate";
import { QuizPhase } from "@/src/types";
import { useQuiz } from "@/src/hooks/useQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { QuizCard } from "@/src/components/QuizCard";
import { ResultScreen } from "@/src/components/ResultScreen";
import { VERBS } from "@/src/data/verbs";
import { getItem, setItem } from "@/src/lib/store";
import { useSetQuizHeader } from "@/src/lib/header-context";

const PARTICIPE_HARD_VERBS = VERBS.filter(v => !(v.ending === "-é" && v.auxiliary === "avoir"));

export default function ParticipePage() {
  const router = useRouter();
  const quiz = useQuiz(VERBS, 10);
  useSetQuizHeader("Participe passé", quiz);
  const { isWeak, toggleWeak } = useWeakVerbs();
  const [hardMode, setHardMode] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getItem("tef-participe-hard-mode");
    const enabled = stored === "1";
    setHardMode(enabled);
    quiz.startQuiz(enabled ? PARTICIPE_HARD_VERBS : VERBS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setItem("tef-participe-hard-mode", hardMode ? "1" : "0");
  }, [hardMode]);

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

  function toggleHardMode() {
    const next = !hardMode;
    setHardMode(next);
    quiz.startQuiz(next ? PARTICIPE_HARD_VERBS : VERBS);
  }

  return (
    <AuthGate>
      <div className="mx-auto mt-6 mb-0 w-full max-w-xl px-4">
        <div className="flex items-center justify-end gap-1.5 text-[11px] text-(--color-muted)/85">
          <span>Mode difficile</span>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                aria-label="Aide mode difficile"
                className="inline-flex h-[18px] w-[18px] items-center justify-center rounded text-(--color-muted)/85 transition-colors hover:bg-(--color-ink)/8 hover:text-(--color-ink)"
              >
                <HelpCircle size={12} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side="bottom"
                align="end"
                sideOffset={8}
                className="z-50 w-64 rounded-(--radius-card) border border-(--color-ink)/8 bg-(--color-surface) px-3 py-2 text-xs text-(--color-muted) shadow-lg"
              >
                Retire les verbes réguliers en -er (→ -é) avec « avoir ».
                <Popover.Arrow className="fill-(--color-surface)" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <button
            type="button"
            role="switch"
            aria-checked={hardMode}
            aria-label={hardMode ? "Désactiver le mode difficile" : "Activer le mode difficile"}
            onClick={toggleHardMode}
            className={[
              "flex h-6 w-10 items-center rounded-full border p-0.5 transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-ring)",
              hardMode
                ? "border-(--color-brand)/45 bg-(--color-brand)/18"
                : "border-(--color-ink)/20 bg-(--color-ink)/10",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={[
                "flex h-4 w-4 items-center justify-center rounded-full transition-transform duration-200",
                hardMode
                  ? "translate-x-[calc(40px-16px-4px)] bg-(--color-brand)"
                  : "translate-x-0 bg-(--color-ink)/70",
              ].join(" ")}
            />
          </button>
        </div>
      </div>
      {(quiz.state.phase === QuizPhase.Answering || quiz.state.phase === QuizPhase.Feedback) && quiz.currentQuestion && (
        <QuizCard
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
