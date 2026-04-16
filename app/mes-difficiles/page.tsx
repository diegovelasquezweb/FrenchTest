"use client";

import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { AuthGate } from "@/src/layout/AuthGate";
import { useDifficultesQuiz } from "@/src/hooks/useDifficultesQuiz";
import { useWeakVerbs } from "@/src/hooks/useWeakVerbs";
import { QuizCard } from "@/src/components/QuizCard";
import { ImparfaitQuizCard } from "@/src/components/ImparfaitQuizCard";
import { FuturQuizCard } from "@/src/components/FuturQuizCard";
import { ConditionnelQuizCard } from "@/src/components/ConditionnelQuizCard";
import { PresentQuizCard } from "@/src/components/PresentQuizCard";
import { ResultScreen } from "@/src/components/ResultScreen";
import { QuizPhase } from "@/src/types";
import { useSetQuizHeader } from "@/src/lib/header-context";

export default function MesDifficilesPage() {
  const router = useRouter();
  const { isWeak, toggleWeak, weakVerbList } = useWeakVerbs();
  const difficiles = useDifficultesQuiz();
  useSetQuizHeader("Mes difficiles", difficiles);

  return (
    <AuthGate>
      {difficiles.state.phase === QuizPhase.Idle && (
        <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl rounded-(--radius-card) bg-(--color-surface) shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-ink)/8">
            <div className="flex items-center gap-2">
              <Bookmark size={16} className="text-(--color-ink)" />
              <span className="text-sm font-semibold text-(--color-ink)">Mes difficiles</span>
            </div>
            {weakVerbList.length > 0 && (
              <span className="text-xs font-bold text-(--color-muted)">{weakVerbList.length}</span>
            )}
          </div>

          {weakVerbList.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-sm font-medium text-(--color-ink)">Aucun verbe marqué</p>
              <p className="text-xs text-(--color-muted) max-w-xs">
                Pendant tes exercices, clique sur{" "}
                <span className="font-medium text-(--color-ink)">Marquer</span>{" "}
                pour ajouter un verbe ici.
              </p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-2 rounded-(--radius-button) bg-(--color-brand) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150"
              >
                Commencer un exercice
              </button>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-(--color-ink)/6 max-h-[60vh] overflow-y-auto">
                {weakVerbList.map((verb) => (
                  <li key={verb.infinitive} className="flex items-center justify-between px-6 py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-(--color-ink)" lang="fr">
                        {verb.infinitive}
                      </span>
                      <span className="ml-2 text-xs text-(--color-muted)" lang="en">
                        {verb.translation}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWeak(verb.infinitive)}
                      aria-label={`Retirer ${verb.infinitive}`}
                      className="shrink-0 text-(--color-muted) hover:text-red-400 transition-colors duration-150"
                    >
                      <Bookmark
                        size={14}
                        fill="currentColor"
                        className="text-(--color-muted) hover:text-red-400 transition-colors duration-150"
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-4 border-t border-(--color-ink)/8 flex items-center justify-between gap-3">
                <p className="text-xs text-(--color-muted)">
                  {weakVerbList.length < 2
                    ? "Ajoute au moins 2 verbes pour commencer"
                    : `${weakVerbList.length} verbe${weakVerbList.length > 1 ? "s" : ""} · quiz mixte`}
                </p>
                <button
                  type="button"
                  disabled={weakVerbList.length < 2}
                  onClick={() => difficiles.startQuiz(weakVerbList)}
                  className="rounded-(--radius-button) bg-(--color-brand) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Commencer
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      )}

      {(difficiles.state.phase === QuizPhase.Answering ||
        difficiles.state.phase === QuizPhase.Feedback) &&
        difficiles.currentQuestion &&
        (() => {
          const wrapper = difficiles.currentQuestion;
          const verbInfinitive = wrapper.q.verb.infinitive;
          const common = {
            answerState: difficiles.state.answerState,
            selectedIndex: difficiles.state.selectedIndex,
            onSelect: difficiles.selectAnswer,
            onNext: difficiles.nextQuestion,
            questionNumber: difficiles.progress.index + 1,
            total: difficiles.progress.total,
            isWeak: isWeak(verbInfinitive),
            onToggleWeak: () => toggleWeak(verbInfinitive),
          };
          const card = (() => {
            switch (wrapper.source) {
              case "participe":    return <QuizCard {...common} question={wrapper.q} />;
              case "imparfait":    return <ImparfaitQuizCard {...common} question={wrapper.q} />;
              case "futur":        return <FuturQuizCard {...common} question={wrapper.q} />;
              case "conditionnel": return <ConditionnelQuizCard {...common} question={wrapper.q} />;
              case "présent":      return <PresentQuizCard {...common} question={wrapper.q} />;
              default:             return null;
            }
          })();
          return card ?? null;
        })()}

      {difficiles.state.phase === QuizPhase.Complete && (
        <ResultScreen
          history={difficiles.state.history}
          score={difficiles.state.score}
          total={difficiles.progress.total}
          onRestart={() => difficiles.restartQuiz(weakVerbList)}
          onHome={() => router.push("/")}
        />
      )}
    </AuthGate>
  );
}
