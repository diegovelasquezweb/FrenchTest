import { useState, useCallback } from "react";
import { Search, Loader, AlertCircle } from "lucide-react";
import type { WiktionaryResult } from "./wiktionary";
import { fetchWiktionary } from "./wiktionary";

export function DictionaryView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState<"fr" | "es" | "en">("fr");
  const [result, setResult] = useState<WiktionaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Veuillez entrer un mot à chercher");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetchWiktionary(searchTerm, language);
      if (res) {
        setResult(res);
      } else {
        setError(`Pas de définition trouvée pour "${searchTerm}"`);
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, language]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h1 className="text-3xl font-bold text-ink">Dictionnaire</h1>
            <p className="text-sm text-muted mt-1">Cherche une définition</p>
          </div>
          <div className="flex gap-2">
            {(["fr", "es", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-2 rounded-button text-sm font-medium transition-colors ${
                  language === lang
                    ? "bg-brand text-white"
                    : "bg-ink/5 text-ink hover:bg-ink/10"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ex: accroupi, améliorer, courage..."
            className="flex-1 rounded-button border-2 border-btn-border bg-btn-bg px-4 py-3 text-ink placeholder-text-muted focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-button bg-brand px-6 py-3 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50 focus:outline-2 focus:outline-offset-2 focus:outline-ring"
          >
            {loading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
            {!loading && <span className="hidden sm:inline">Chercher</span>}
          </button>
        </div>
      </form>


      {error && (
        <div className="flex gap-3 rounded-card bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 mb-6">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}


      {result && (
        <div className="rounded-card bg-surface shadow-sm overflow-hidden">

          <div className="border-b border-ink/8 px-6 py-4">
            <h2 className="text-2xl font-bold text-ink mb-1">{result.word}</h2>
            {result.pronunciations.length > 0 && (
              <p className="text-xs text-muted">{result.pronunciations.join(", ")}</p>
            )}
          </div>


          <div className="px-6 py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Définitions</h3>
            <div className="space-y-3">
              {result.definitions.map((def, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <span className="inline-flex rounded-full bg-brand/10 px-2 py-1 text-[10px] font-semibold text-brand">
                      {def.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-sm text-ink leading-relaxed flex-1">{def.definition}</p>
                </div>
              ))}
            </div>
          </div>


          {result.examples.length > 0 && (
            <div className="border-t border-ink/8 px-6 py-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Exemples</h3>
              <ul className="space-y-2">
                {result.examples.map((ex, i) => (
                  <li key={i} className="text-sm text-muted italic pl-4 before:content-['•'] before:mr-3">
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}


      {!result && !loading && !error && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-4">
            <Search size={24} className="text-brand" />
          </div>
          <p className="text-muted text-sm">Cherche un mot pour voir sa définition</p>
        </div>
      )}
    </div>
  );
}
