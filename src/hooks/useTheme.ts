"use client";

import { useEffect, useState } from "react";
import { getItem, setItem } from "../lib/store";

type Theme = "light" | "dark";

const THEME_KEY = "tef-theme";

export function useTheme() {
  // Initialize with safe SSR default. The inline <script> in app/layout.tsx
  // already set data-theme on <html> before paint, so there is no flash.
  const [theme, setTheme] = useState<Theme>("light");

  // Read the real persisted theme on the client after mount.
  useEffect(() => {
    const stored = getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setItem(THEME_KEY, theme);
  }, [theme]);

  function toggle() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return { theme, toggle };
}
