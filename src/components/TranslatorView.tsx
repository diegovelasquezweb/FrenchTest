import { useState, useCallback, useEffect, useRef } from "react";
import { Loader, AlertCircle } from "lucide-react";
import { translate } from "../lib/translate";

interface TranslationResult {
  word: string;
  translated: string;
}

export function TranslatorView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState<"fr" | "es" | "en">("es");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async (word: string) => {
    if (!word.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const langMap = { es: "ES" as const, en: "EN" as const, fr: "FR" as const };
      const translated = await translate(word, langMap[sourceLanguage]);

      // Reject translations that are identical to source, all-caps (API error), or too short
      const isValid =
        translated &&
        translated !== word &&
        translated.toLowerCase() !== word.toLowerCase() &&
        !(translated === translated.toUpperCase() && translated.length < 6);

      if (isValid) {
        setResult({ word, translated });
      } else {
        setError(`Impossible de traduire "${word}"`);
        setResult(null);
      }
    } catch (err) {
      setError("Erreur de connexion. Réessaye.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sourceLanguage]);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchTerm, sourceLanguage, handleSearch]);

  const languageNames = { fr: "Français", es: "Espagnol", en: "Anglais" };
  const languageLabels = { fr: "FR", es: "ES", en: "EN" };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-(--color-ink)">Traducteur</h1>
            <p className="text-sm text-(--color-muted) mt-1">Cherche des mots et traductions</p>
          </div>
          <div className="flex gap-2">
            {(["es", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSourceLanguage(lang)}
                className={`px-3 py-2 rounded-(--radius-button) text-sm font-medium transition-colors ${
                  sourceLanguage === lang
                    ? "bg-(--color-brand) text-white"
                    : "bg-(--color-ink)/5 text-(--color-ink) hover:bg-(--color-ink)/10"
                }`}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Écris un mot..."
          className="w-full rounded-(--radius-button) border-2 border-(--color-btn-border) bg-(--color-btn-bg) px-4 py-3 text-(--color-ink) placeholder-text-(--color-muted) focus:outline-2 focus:outline-offset-2 focus:outline-(--color-ring)"
          autoFocus
        />
        {loading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-(--color-muted)">
            <Loader size={14} className="animate-spin" />
            Cherchant...
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 rounded-(--radius-card) bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 mb-6">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="rounded-(--radius-card) bg-(--color-surface) shadow-sm overflow-hidden">
          <div className="px-6 py-4">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted) mb-2">
                {languageNames[sourceLanguage]}
              </p>
              <p className="text-2xl font-bold text-(--color-ink)">{result.word}</p>
            </div>

            <div className="border-t border-(--color-ink)/8 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted) mb-2">Français</p>
              <p className="text-2xl font-bold text-(--color-brand)">{result.translated}</p>
            </div>
          </div>
        </div>
      )}

      {/* Idle State */}
      {!result && !loading && !error && searchTerm.length === 0 && (
        <div className="text-center py-12">
          <p className="text-(--color-muted) text-sm">Écris un mot pour voir sa traduction</p>
        </div>
      )}
    </div>
  );
}
