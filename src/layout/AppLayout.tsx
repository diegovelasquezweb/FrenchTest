"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuth } from "@/src/lib/auth-context";
import { AiChatDrawer } from "@/src/features/ai/AiChatDrawer";
import { useHeaderData } from "@/src/lib/header-context";
import { ScoreBoard } from "@/src/components/quiz/ScoreBoard";
import { FlashcardHeader } from "@/src/components/flashcard/FlashcardHeader";
import { QuizPhase } from "@/src/types";

const PUBLIC_PATHS = ["/login", "/auth/callback"];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { status } = useAuth();
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const headerData = useHeaderData();
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isAuthenticated = status === "authed" || status === "guest";

  if (isPublic || !isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-(--color-bg)">
      <Sidebar onOpenAiChat={() => setAiChatOpen(true)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        {headerData.type !== "none" && (
          <>
            <header className="hidden md:flex items-center justify-between gap-4 border-b border-(--color-ink)/8 bg-(--color-surface) px-6 py-3">
              <span className="text-sm font-semibold text-(--color-ink) shrink-0">{headerData.title}</span>
              {headerData.type === "quiz" &&
                (headerData.phase === QuizPhase.Answering || headerData.phase === QuizPhase.Feedback) && (
                  <ScoreBoard score={headerData.score} index={headerData.questionNumber - 1} total={headerData.total} />
                )}
              {headerData.type === "flashcard" && headerData.phase === "session" && (
                headerData.variant === "marathon" ? (
                  <FlashcardHeader
                    variant="marathon"
                    masteredCount={headerData.masteredCount}
                    totalCards={headerData.totalCards}
                    onReset={headerData.onReset}
                    onFilter={headerData.onFilter!}
                    onSettings={headerData.onSettings!}
                  />
                ) : (
                  <FlashcardHeader
                    masteredCount={headerData.masteredCount}
                    totalCards={headerData.totalCards}
                    onReset={headerData.onReset}
                  />
                )
              )}
            </header>
            {headerData.type === "quiz" &&
              (headerData.phase === QuizPhase.Answering || headerData.phase === QuizPhase.Feedback) && (
                <header className="md:hidden border-b border-(--color-ink)/8 bg-(--color-surface) px-4 py-3 flex flex-col gap-2">
                  <ScoreBoard score={headerData.score} index={headerData.questionNumber - 1} total={headerData.total} />
                </header>
              )}
            {headerData.type === "flashcard" && headerData.phase === "session" && (
              <header className="md:hidden border-b border-(--color-ink)/8 bg-(--color-surface) px-4 py-3 flex flex-col gap-2">
                {headerData.variant === "marathon" ? (
                  <FlashcardHeader
                    variant="marathon"
                    masteredCount={headerData.masteredCount}
                    totalCards={headerData.totalCards}
                    onReset={headerData.onReset}
                    onFilter={headerData.onFilter!}
                    onSettings={headerData.onSettings!}
                  />
                ) : (
                  <FlashcardHeader
                    masteredCount={headerData.masteredCount}
                    totalCards={headerData.totalCards}
                    onReset={headerData.onReset}
                  />
                )}
              </header>
            )}
          </>
        )}
        <main className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <AiChatDrawer open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
