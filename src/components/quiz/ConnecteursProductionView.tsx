"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Lightbulb, RotateCcw, Home, Eye, EyeOff } from "lucide-react";
import { useConnecteursProduction, type ProductionLevel } from "@/src/hooks/useConnecteursProduction";
import { RELATION_META } from "@/src/data/connecteursProduction";
import { useSetQuizHeader } from "@/src/lib/header-context";
import { QuizPhase } from "@/src/types";

const LEVEL_DESCRIPTIONS: Record<ProductionLevel, { label: string; description: string }> = {
  1: {
    label: "Niveau 1 — Catégorie",
    description: "On vous donne la relation logique. Choisissez librement n'importe quel connecteur de cette catégorie.",
  },
  2: {
    label: "Niveau 2 — Registre",
    description: "Catégorie + registre imposé (formel ou courant). Adaptez votre connecteur au contexte.",
  },
  3: {
    label: "Niveau 3 — Mixte",
    description: "Aucun indice supplémentaire. Vous devez identifier la relation et choisir le bon connecteur formel.",
  },
};

export function ConnecteursProductionView() {
  const router = useRouter();
  const quiz = useConnecteursProduction();
  const [showExample, setShowExample] = useState(false);

  const headerPhase: QuizPhase =
    quiz.state.phase === "complete"
      ? QuizPhase.Complete
      : quiz.state.phase === "idle"
        ? QuizPhase.Idle
        : quiz.state.phase === "feedback"
          ? QuizPhase.Feedback
          : QuizPhase.Answering;

  useSetQuizHeader("Connecteurs — Production", {
    state: { phase: headerPhase, score: quiz.score },
    progress: { index: quiz.state.index, total: quiz.state.questions.length },
  });

  useEffect(() => {
    setShowExample(false);
  }, [quiz.state.index, quiz.state.phase]);

  if (quiz.state.phase === "idle") {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6">
        <header className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
          <h1 className="text-lg font-bold text-ink">Connecteurs — Production libre</h1>
          <p className="mt-1 text-sm text-muted" lang="fr">
            Reliez deux phrases avec un connecteur logique. Vous écrivez vous-même la phrase complète, sans choix multiples.
          </p>
        </header>

        <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
          <h2 className="text-sm font-bold text-ink">Choisissez un niveau</h2>
          <div className="mt-3 space-y-2">
            {(Object.entries(LEVEL_DESCRIPTIONS) as [string, (typeof LEVEL_DESCRIPTIONS)[1]][]).map(
              ([key, meta]) => {
                const lvl = Number(key) as ProductionLevel;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => quiz.startQuiz(lvl, false)}
                    className="rounded-card w-full cursor-pointer border border-ink/10 bg-bg p-3 text-left transition-colors hover:border-brand hover:bg-brand/5"
                  >
                    <p className="text-sm font-bold text-ink">{meta.label}</p>
                    <p className="mt-0.5 text-xs text-muted" lang="fr">
                      {meta.description}
                    </p>
                  </button>
                );
              },
            )}
          </div>

          {quiz.weakCount > 0 && (
            <button
              type="button"
              onClick={() => quiz.startQuiz(1, true)}
              className="rounded-button mt-4 flex w-full cursor-pointer items-center justify-center gap-2 border border-brand bg-brand px-3 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Réviser mes erreurs ({quiz.weakCount})
            </button>
          )}
        </section>
      </div>
    );
  }

  if (quiz.state.phase === "complete") {
    const total = quiz.state.history.length;
    return (
      <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6">
        <section className="rounded-card border border-ink/10 bg-surface p-5 text-center shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Session terminée</p>
          <p className="mt-2 text-3xl font-bold text-ink">
            {quiz.score} / {total}
          </p>
          <p className="mt-1 text-sm text-muted" lang="fr">
            {quiz.score === total
              ? "Excellent ! Toutes vos productions sont valides."
              : "Continuez : les erreurs sont sauvegardées pour révision."}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={quiz.restart}
              className="rounded-button flex cursor-pointer items-center gap-2 border border-ink/15 bg-bg px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
            >
              <RotateCcw size={14} /> Recommencer
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-button flex cursor-pointer items-center gap-2 border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Home size={14} /> Accueil
            </button>
          </div>
        </section>

        {quiz.state.history.length > 0 && (
          <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
            <h3 className="text-sm font-bold text-ink">Récapitulatif</h3>
            <ul className="mt-2 space-y-2">
              {quiz.state.history.map((entry, idx) => (
                <li
                  key={`${entry.itemId}-${idx}`}
                  className="rounded border border-ink/8 bg-bg px-3 py-2"
                >
                  <div className="flex items-start gap-2">
                    {entry.isValid ? (
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand" />
                    ) : (
                      <XCircle size={14} className="mt-0.5 shrink-0 text-rose-500" />
                    )}
                    <p className="text-sm text-ink" lang="fr">
                      {entry.input || <span className="text-muted">(vide)</span>}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  const item = quiz.currentQuestion;
  if (!item) return null;
  const meta = RELATION_META[item.relation];
  const showRelation = quiz.state.level !== 3;
  const showRegistre = quiz.state.level === 2 && item.registreCible;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        Question {quiz.state.index + 1} / {quiz.state.questions.length} · {LEVEL_DESCRIPTIONS[quiz.state.level].label}
      </p>

      <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <div className="space-y-2">
          <div className="rounded border border-ink/8 bg-bg px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Phrase 1</p>
            <p className="mt-0.5 text-sm text-ink" lang="fr">
              {item.phrase1}
            </p>
          </div>
          <div className="rounded border border-ink/8 bg-bg px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Phrase 2</p>
            <p className="mt-0.5 text-sm text-ink" lang="fr">
              {item.phrase2}
            </p>
          </div>
        </div>

        {(showRelation || showRegistre || item.requiertSubjonctif) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {showRelation && (
              <span className="rounded-button inline-flex items-center gap-1 border border-brand/30 bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                {meta.emoji} {meta.label}
              </span>
            )}
            {showRegistre && (
              <span className="rounded-button inline-flex items-center gap-1 border border-ink/15 bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink">
                Registre : {item.registreCible}
              </span>
            )}
            {item.requiertSubjonctif && (
              <span className="rounded-button inline-flex items-center gap-1 border border-amber-400/40 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/20">
                Subjonctif requis
              </span>
            )}
          </div>
        )}
      </section>

      <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <label htmlFor="connecteur-input" className="text-sm font-semibold text-ink">
          Écrivez la phrase unifiée
        </label>
        <textarea
          id="connecteur-input"
          lang="fr"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          rows={3}
          value={quiz.state.input}
          onChange={(e) => quiz.setInput(e.target.value)}
          disabled={quiz.state.phase === "feedback"}
          placeholder="Ex. : Je voulais sortir, cependant il pleuvait beaucoup."
          className="rounded-card mt-2 w-full resize-none border border-ink/15 bg-bg p-3 text-sm text-ink outline-none transition-colors focus:border-brand disabled:opacity-60"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              if (quiz.state.phase === "writing" && quiz.state.input.trim()) quiz.submit();
              else if (quiz.state.phase === "feedback") quiz.next();
            }
          }}
        />

        {quiz.state.phase === "writing" && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowExample((v) => !v)}
              className="rounded-button flex cursor-pointer items-center gap-1.5 border border-ink/15 bg-bg px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {showExample ? <EyeOff size={12} /> : <Eye size={12} />}
              {showExample ? "Masquer l'exemple" : "Voir un exemple"}
            </button>
            <button
              type="button"
              onClick={quiz.submit}
              disabled={!quiz.state.input.trim()}
              className="rounded-button flex cursor-pointer items-center gap-2 border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Vérifier
            </button>
          </div>
        )}

        {showExample && (
          <div className="rounded-card mt-3 border border-amber-400/30 bg-amber-50 px-3 py-2 dark:bg-amber-900/10">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Exemple de solution
            </p>
            <p className="mt-0.5 text-sm text-ink" lang="fr">
              {item.exempleSolution}
            </p>
          </div>
        )}

        {quiz.state.phase === "feedback" && quiz.state.feedback && (
          <FeedbackPanel
            isValid={quiz.state.feedback.isValid}
            feedback={quiz.state.feedback.feedback}
            example={item.exempleSolution}
            validConnecteurs={item.connecteursValides}
            onNext={quiz.next}
          />
        )}
      </section>
    </div>
  );
}

function FeedbackPanel({
  isValid,
  feedback,
  example,
  validConnecteurs,
  onNext,
}: {
  isValid: boolean;
  feedback: string[];
  example: string;
  validConnecteurs: string[];
  onNext: () => void;
}) {
  return (
    <div className="mt-4 space-y-3">
      <div
        className={`rounded-card border p-3 ${
          isValid
            ? "border-brand/30 bg-brand/5"
            : "border-rose-300/50 bg-rose-50 dark:bg-rose-900/10"
        }`}
      >
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 size={16} className="text-brand" />
          ) : (
            <XCircle size={16} className="text-rose-500" />
          )}
          <p className={`text-sm font-bold ${isValid ? "text-brand" : "text-rose-600 dark:text-rose-400"}`}>
            {isValid ? "Production valide" : "À corriger"}
          </p>
        </div>
        <ul className="mt-2 space-y-1">
          {feedback.map((line, idx) => (
            <li key={idx} className="text-sm text-ink" lang="fr">
              • {line}
            </li>
          ))}
        </ul>
      </div>

      {!isValid && (
        <div className="rounded-card border border-ink/10 bg-bg p-3">
          <div className="flex items-start gap-2">
            <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Connecteurs acceptés
              </p>
              <p className="text-sm text-ink" lang="fr">
                {validConnecteurs.join(" · ")}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Exemple
              </p>
              <p className="text-sm text-ink" lang="fr">
                {example}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="rounded-button w-full cursor-pointer border border-brand bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Question suivante
      </button>
    </div>
  );
}
