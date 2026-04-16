"use client";

import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { useQuiz } from "@/src/hooks/useQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { QuizCard } from "@/src/components/quiz/QuizCard";
import { ResultScreen } from "@/src/components/quiz/ResultScreen";
import { VERBS } from "@/src/data/verbs";
import { getItem, setItem } from "@/src/lib/store";
import { QuizTemplate } from "@/src/components/templates";

const PARTICIPE_HARD_VERBS = VERBS.filter(
  (v) => !(v.ending === "-é" && v.auxiliary === "avoir"),
);

export default function ParticipePage() {
  const quiz = useQuiz(VERBS, 10);
  const { isWeak, toggleWeak } = useWeakVerbs();
  const [hardMode, setHardMode] = useState(false);

  useEffect(() => {
    const stored = getItem("tef-participe-hard-mode");
    const enabled = stored === "1";
    setHardMode(enabled);
    quiz.startQuiz(enabled ? PARTICIPE_HARD_VERBS : VERBS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setItem("tef-participe-hard-mode", hardMode ? "1" : "0");
  }, [hardMode]);

  function toggleHardMode() {
    const next = !hardMode;
    setHardMode(next);
    quiz.startQuiz(next ? PARTICIPE_HARD_VERBS : VERBS);
  }

  const hardModeToggle = (
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
  );

  return (
    <QuizTemplate
      title="Participe passé"
      quiz={quiz}
      autoStart={false}
      headerSlot={hardModeToggle}
      renderCard={({ question, answerState, selectedIndex, questionNumber, total }) => (
        <QuizCard
          question={question}
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
