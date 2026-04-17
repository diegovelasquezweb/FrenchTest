/**
 * Translate text using MyMemory API (completely free, no key required)
 */
export async function translate(
  text: string,
  sourceLang: "ES" | "EN" | "FR"
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

    return translated;
  } catch (error) {
    console.error("MyMemory fetch error:", error);
    return null;
  }
}
