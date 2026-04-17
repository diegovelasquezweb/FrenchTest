import { useTheme } from "../../hooks/useTheme";
import { ThemeToggle } from "@/src/components/ui/ThemeToggle";

interface LoginScreenProps {
  onGitHub(): void;
  onGoogle(): void;
  onGuest(): void;
}

export function LoginScreen({ onGitHub: _onGitHub, onGoogle, onGuest }: LoginScreenProps) {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle theme={theme} onToggle={toggle} />
      </div>
      <div className="w-full max-w-sm rounded-card bg-surface p-8 shadow-sm text-center">
        <p className="text-2xl font-extrabold tracking-tight text-ink mb-1">🇨🇦 TEF Pratiquer</p>
        <p className="text-sm text-muted mb-8">Connectez-vous pour sauvegarder votre progression</p>

        <div className="flex flex-col gap-3">

          <button
            type="button"
            onClick={onGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-button border border-ink/12 bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-ink/5"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          {/* GitHub — hidden temporarily
          <button
            type="button"
            onClick={onGitHub}
            className="flex w-full items-center justify-center gap-3 rounded-button bg-ink px-5 py-3 text-sm font-semibold text-bg transition-opacity duration-150 hover:opacity-80"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Continuer avec GitHub
          </button>
          */}


          <button
            type="button"
            onClick={onGuest}
            className="flex w-full items-center justify-center rounded-button px-5 py-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink"
          >
            Continuer sans compte
          </button>
        </div>

        <p className="mt-5 text-xs text-muted/60">
          Sans compte, ta progression est sauvegardée uniquement sur cet appareil.
        </p>
      </div>
    </div>
  );
}
