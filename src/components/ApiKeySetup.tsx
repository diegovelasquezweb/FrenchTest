import { useState } from "react";
import { saveAiKey } from "../lib/aiChat";

interface ApiKeySetupProps {
  onSaved(): void;
  onCancel(): void;
}

export function ApiKeySetup({ onSaved, onCancel }: ApiKeySetupProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await saveAiKey(key.trim());
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde de la clé");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-ink)/20 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-(--radius-card) bg-(--color-surface) p-6 shadow-xl">
        <h2 className="text-base font-bold text-(--color-ink) mb-1">Configurer Claude</h2>
        <p className="text-sm text-(--color-muted) mb-5">
          Entre ta clé API Anthropic. Elle est sauvegardée de façon sécurisée sur le serveur, liée à ton compte.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            placeholder="sk-ant-api03-..."
            value={key}
            onChange={e => setKey(e.target.value)}
            className="w-full rounded-(--radius-button) border border-(--color-ink)/12 bg-(--color-bg) px-3 py-2.5 text-sm font-mono text-(--color-ink) placeholder:text-(--color-muted)/50 focus:outline-2 focus:outline-(--color-ring) focus:outline-offset-2"
          />

          {error && (
            <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
          )}

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-(--radius-button) border border-(--color-ink)/12 px-4 py-2 text-sm font-medium text-(--color-muted) transition-colors hover:bg-(--color-ink)/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!key.trim() || saving}
              className="flex-1 rounded-(--radius-button) bg-(--color-brand) px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-(--color-muted)/60">
          Obtiens ta clé sur{" "}
          <span className="font-medium text-(--color-muted)">console.anthropic.com</span>
        </p>
      </div>
    </div>
  );
}
