interface SessionDoneProps {
  onRestart(): void;
  onHome(): void;
}

export function SessionDone({ onRestart, onHome }: SessionDoneProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-sm flex-col gap-4 text-center">
        <p className="text-lg font-semibold text-ink" lang="fr">
          Session terminée
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 min-h-11 rounded-card bg-brand px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Recommencer
          </button>
          <button
            type="button"
            onClick={onHome}
            className="flex-1 min-h-11 rounded-card border border-ink/12 px-6 py-3 font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
