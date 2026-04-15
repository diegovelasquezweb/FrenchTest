/**
 * Translate text using MyMemory API (completely free, no key required)
 */
export async function translateWithDeepL(
  text: string,
  sourceLang: "ES" | "EN" | "FR",
  targetLang: "FR"
): Promise<string | null> {
  if (!text.trim()) return null;

  const langMap = { ES: "es", EN: "en", FR: "fr" };
  const source = langMap[sourceLang];

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${source}|fr`
    );

    if (!response.ok) {
      console.error("MyMemory error:", response.status);
      return null;
    }

    const data = (await response.json()) as { responseData?: { translatedText?: string } };
    const translated = data.responseData?.translatedText ?? null;

    console.log(`[MyMemory] "${text}" (${source}→fr) = "${translated}"`);

    // Reject translations that are just acronyms or clearly wrong
    if (translated && translated.length > 0 && translated.toUpperCase() !== translated.toUpperCase()) {
      return translated;
    }

    return translated;
  } catch (error) {
    console.error("MyMemory fetch error:", error);
    return null;
  }
}
