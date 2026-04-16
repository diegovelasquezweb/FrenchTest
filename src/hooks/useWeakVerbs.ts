import { useState, useCallback, useEffect, useRef } from "react";
import type { Verb } from "../types";
import { VERBS } from "../data/verbs";
import { getWeakVerbs, saveWeakVerbs } from "../lib/weakVerbs";
import { subscribeToStore } from "../lib/store";

export interface UseWeakVerbsReturn {
  weakVerbs: Set<string>;
  isWeak(infinitive: string): boolean;
  toggleWeak(infinitive: string): void;
  weakVerbList: Verb[];
}

export function useWeakVerbs(): UseWeakVerbsReturn {
  const [weakVerbs, setWeakVerbs] = useState<Set<string>>(getWeakVerbs);
  const initialized = useRef(false);

  useEffect(() => subscribeToStore(() => {
    setWeakVerbs(prev => {
      const next = getWeakVerbs();
      if (prev.size === next.size && [...prev].every(id => next.has(id))) return prev;
      return next;
    });
  }), []);

  // Persist after toggle — outside the state updater to avoid setState-during-render.
  useEffect(() => {
    if (!initialized.current) { initialized.current = true; return; }
    saveWeakVerbs(weakVerbs);
  }, [weakVerbs]);

  const isWeak = useCallback(
    (infinitive: string) => weakVerbs.has(infinitive),
    [weakVerbs]
  );

  const toggleWeak = useCallback((infinitive: string) => {
    setWeakVerbs(prev => {
      const next = new Set(prev);
      if (next.has(infinitive)) next.delete(infinitive);
      else next.add(infinitive);
      return next;
    });
  }, []);

  const weakVerbList = VERBS.filter(v => weakVerbs.has(v.infinitive));

  return { weakVerbs, isWeak, toggleWeak, weakVerbList };
}
