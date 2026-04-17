"use client";

import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { AuthGate } from "@/src/layout/AuthGate";
import { useDifficultesQuiz } from "@/src/hooks/useDifficultesQuiz";
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
import { ResultScreen } from "@/src/components/quiz/ResultScreen";
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
        <div className="w-full max-w-xl rounded-card bg-surface shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8">
            <div className="flex items-center gap-2">
              <Bookmark size={16} className="text-ink" />
              <span className="text-sm font-semibold text-ink">Mes difficiles</span>
            </div>
            {weakVerbList.length > 0 && (
              <span className="text-xs font-bold text-muted">{weakVerbList.length}</span>
            )}
          </div>

          {weakVerbList.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-sm font-medium text-ink">Aucun verbe marqué</p>
              <p className="text-xs text-muted max-w-xs">
                Pendant tes exercices, clique sur{" "}
                <span className="font-medium text-ink">Marquer</span>{" "}
                pour ajouter un verbe ici.
              </p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-2 rounded-button bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150"
              >
                Commencer un exercice
              </button>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-ink/6 max-h-[60vh] overflow-y-auto">
                {weakVerbList.map((verb) => (
                  <li key={verb.infinitive} className="flex items-center justify-between px-6 py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-ink" lang="fr">
                        {verb.infinitive}
                      </span>
                      <span className="ml-2 text-xs text-muted" lang="en">
                        {verb.translation}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWeak(verb.infinitive)}
                      aria-label={`Retirer ${verb.infinitive}`}
                      className="shrink-0 text-muted hover:text-red-400 transition-colors duration-150"
                    >
                      <Bookmark
                        size={14}
                        fill="currentColor"
                        className="text-muted hover:text-red-400 transition-colors duration-150"
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-4 border-t border-ink/8 flex items-center justify-between gap-3">
                <p className="text-xs text-muted">
                  {weakVerbList.length < 2
                    ? "Ajoute au moins 2 verbes pour commencer"
                    : `${weakVerbList.length} verbe${weakVerbList.length > 1 ? "s" : ""} · quiz mixte`}
                </p>
                <button
                  type="button"
                  disabled={weakVerbList.length < 2}
                  onClick={() => difficiles.startQuiz(weakVerbList)}
                  className="rounded-button bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
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
              default:
                return null;
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
