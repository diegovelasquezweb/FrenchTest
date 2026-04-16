"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/src/layout/AuthGate";
import { useSetQuizHeader } from "@/src/lib/header-context";
import { QuizPhase, AnswerState } from "@/src/types";
import type { QuizLike, RenderCardArgs, RenderResultArgs } from "./types";
import { defaultAnnouncement } from "./types";

interface QuizShellProps<Q> {
  title: string;
  quiz: QuizLike<Q>;
  renderCard: (args: RenderCardArgs<Q>) => React.ReactNode;
  renderResult: (args: RenderResultArgs) => React.ReactNode;
  /** Extra UI rendered above the quiz card (e.g. hard-mode toggle in Participe). */
  headerSlot?: React.ReactNode;
  /**
   * Override the default SR announcement. Required when Q does not have
   * top-level `options` / `correctIndex` (e.g. grammaire's GrammarWrapper).
   */
  buildAnnouncement?: (
    question: Q,
    answerState: AnswerState,
    selectedIndex: number | null,
  ) => string;
  /**
   * Set to false to take over `startQuiz` timing from the page.
   * Useful when the page reads config (e.g. hardMode) before starting.
   * @default true
   */
  autoStart?: boolean;
}

export function QuizShell<Q>({
  title,
  quiz,
  renderCard,
  renderResult,
  headerSlot,
  buildAnnouncement,
  autoStart = true,
}: QuizShellProps<Q>) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState("");

  useSetQuizHeader(title, quiz);

  useEffect(() => {
    if (autoStart) quiz.startQuiz();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (quiz.state.phase !== QuizPhase.Feedback || !quiz.currentQuestion) {
      setAnnouncement("");
      return;
    }
    const q = quiz.currentQuestion;
    let msg: string;
    if (buildAnnouncement) {
      msg = buildAnnouncement(q, quiz.state.answerState, quiz.state.selectedIndex);
    } else {
      const anyQ = q as Record<string, unknown>;
      if (Array.isArray(anyQ["options"]) && typeof anyQ["correctIndex"] === "number") {
        msg = defaultAnnouncement(
          q as unknown as { options: string[]; correctIndex: number },
          quiz.state.answerState,
        );
      } else {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "[QuizShell] buildAnnouncement is required for this question type but was not provided.",
          );
        }
        msg = "";
      }
    }
    setAnnouncement(msg);
  }, [quiz.state.phase, quiz.state.answerState, quiz.currentQuestion, buildAnnouncement]);

  const isActive =
    quiz.state.phase === QuizPhase.Answering ||
    quiz.state.phase === QuizPhase.Feedback;

  return (
    <AuthGate>
      {headerSlot}
      {isActive && quiz.currentQuestion &&
        renderCard({
          question: quiz.currentQuestion,
          answerState: quiz.state.answerState,
          selectedIndex: quiz.state.selectedIndex,
          questionNumber: quiz.progress.index + 1,
          total: quiz.progress.total,
        })
      }
      {quiz.state.phase === QuizPhase.Complete &&
        renderResult({
          score: quiz.state.score,
          total: quiz.progress.total,
          onRestart: quiz.restartQuiz,
          onHome: () => router.push("/"),
        })
      }
      <div role="status" aria-live="polite" className="sr-only">{announcement}</div>
    </AuthGate>
  );
}
