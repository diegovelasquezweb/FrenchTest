import { useState, useCallback } from "react";
import type { Verb } from "../types";
import { VERBS } from "../data/verbs";
import { getWeakVerbs, saveWeakVerbs } from "../lib/weakVerbs";

export interface UseWeakVerbsReturn {
  weakVerbs: Set<string>;
  isWeak(infinitive: string): boolean;
  toggleWeak(infinitive: string): void;
  weakVerbList: Verb[];
}

export function useWeakVerbs(): UseWeakVerbsReturn {
  const [weakVerbs, setWeakVerbs] = useState<Set<string>>(getWeakVerbs);

  const isWeak = useCallback(
    (infinitive: string) => weakVerbs.has(infinitive),
    [weakVerbs]
  );

  const toggleWeak = useCallback((infinitive: string) => {
    setWeakVerbs(prev => {
      const next = new Set(prev);
      if (next.has(infinitive)) next.delete(infinitive);
      else next.add(infinitive);
      saveWeakVerbs(next);
      return next;
    });
  }, []);

  const weakVerbList = VERBS.filter(v => weakVerbs.has(v.infinitive));

  return { weakVerbs, isWeak, toggleWeak, weakVerbList };
}
