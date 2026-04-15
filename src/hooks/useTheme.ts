import { useEffect, useState } from "react";
import { getItem, setItem } from "../lib/store";

type Theme = "light" | "dark";

const THEME_KEY = "tef-theme";

function getInitialTheme(): Theme {
  const stored = getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setItem(THEME_KEY, theme);
  }, [theme]);

  function toggle() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return { theme, toggle };
}
