export interface WiktionaryResult {
  word: string;
  pronunciations: string[];
  definitions: Definition[];
  examples: string[];
}

export interface Definition {
  partOfSpeech: string;
  definition: string;
}

/**
 * Fetches word definitions from Wiktionary API
 */
export async function fetchWiktionary(word: string, language: "fr" | "es" | "en"): Promise<WiktionaryResult | null> {
  if (!word.trim()) return null;

  const langMap = {
    fr: "fr.wiktionary.org",
    es: "es.wiktionary.org",
    en: "en.wiktionary.org",
  };

  try {
    const encoded = encodeURIComponent(word.toLowerCase());
    const domain = langMap[language];
    const url = `https://${domain}/w/api.php?action=query&titles=${encoded}&prop=extracts&explaintext=true&format=json&origin=*`;

    const response = await fetch(url);
    if (!response.ok) return null;

    interface WikiPage { missing?: string; extract?: string }
    interface WikiResponse { query?: { pages?: Record<string, WikiPage> } }
    const data = await response.json() as WikiResponse;
    const pages = data.query?.pages ?? {};
    const page = Object.values(pages)[0] as WikiPage | undefined;

    if (!page || page.missing !== undefined) return null;

    const extract = page?.extract;
    if (!extract) return null;

    const definitions: Definition[] = [];
    const examples: string[] = [];
    const pronunciations: string[] = [];

    const lines = extract.split('\n');
    let currentPoS = '';

    for (const line of lines) {
      const trimmed = line.trim();

      // Look for part of speech headers (usually in bold or followed by definitions)
      if (trimmed.match(/^(Nom|Verbe|Adjectif|Adverbe|Préposition|Conjonction|Interjection|Déterminant)/i)) {
        currentPoS = trimmed.split(/[(\[]/, 1)[0].trim();
      }

      // Collect definitions (lines that look like definitions)
      if (trimmed.match(/^\d+\./) && currentPoS) {
        const def = trimmed.replace(/^\d+\.\s*/, '').trim();
        if (def && def.length > 5) {
          definitions.push({ partOfSpeech: currentPoS, definition: def });
        }
      }

      // Collect example phrases (often quoted or marked with specific patterns)
      if (trimmed.includes('"') || trimmed.match(/^[«"].*[»"]/)) {
        const ex = trimmed.replace(/[«»"]/g, '').trim();
        if (ex.length > 5 && examples.length < 3) {
          examples.push(ex);
        }
      }
    }

    return {
      word,
      pronunciations,
      definitions: definitions.length > 0 ? definitions : [{ partOfSpeech: 'mot', definition: extract.split('\n')[0] || 'Définition non disponible' }],
      examples,
    };
  } catch (error) {
    console.error('Wiktionary fetch error:', error);
    return null;
  }
}
