"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PRODUCTION_ITEMS,
  type ConnecteurProductionItem,
} from "../data/connecteursProduction";
import { validateProduction, type ValidationResult } from "../lib/connecteursValidator";
import { getWeakConnecteurs, saveWeakConnecteurs } from "../lib/weakConnecteurs";
import { subscribeToStore } from "../lib/store";

export type ProductionLevel = 1 | 2 | 3;

export type ProductionPhase = "idle" | "writing" | "feedback" | "complete";

export type HistoryEntry = {
  itemId: string;
  input: string;
  isValid: boolean;
  matched: string | null;
};

interface State {
  phase: ProductionPhase;
  level: ProductionLevel;
  questions: ConnecteurProductionItem[];
  index: number;
  input: string;
  feedback: ValidationResult | null;
  history: HistoryEntry[];
  weakOnly: boolean;
}

const QUESTIONS_PER_SESSION = 10;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickQuestions(weakIds: Set<string>, weakOnly: boolean): ConnecteurProductionItem[] {
  if (weakOnly && weakIds.size > 0) {
    const weak = PRODUCTION_ITEMS.filter((q) => weakIds.has(q.id));
    return shuffle(weak).slice(0, QUESTIONS_PER_SESSION);
  }
  return shuffle(PRODUCTION_ITEMS).slice(0, QUESTIONS_PER_SESSION);
}

export function useConnecteursProduction() {
  const [weakIds, setWeakIds] = useState<Set<string>>(getWeakConnecteurs);
  const initialized = useRef(false);

  useEffect(
    () =>
      subscribeToStore(() => {
        setWeakIds((prev) => {
          const next = getWeakConnecteurs();
          if (prev.size === next.size && [...prev].every((id) => next.has(id))) return prev;
          return next;
        });
      }),
    [],
  );

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    saveWeakConnecteurs(weakIds);
  }, [weakIds]);

  const [state, setState] = useState<State>(() => ({
    phase: "idle",
    level: 1,
    questions: [],
    index: 0,
    input: "",
    feedback: null,
    history: [],
    weakOnly: false,
  }));

  const startQuiz = useCallback(
    (level: ProductionLevel, weakOnly: boolean) => {
      const questions = pickQuestions(getWeakConnecteurs(), weakOnly);
      if (questions.length === 0) return;
      setState({
        phase: "writing",
        level,
        questions,
        index: 0,
        input: "",
        feedback: null,
        history: [],
        weakOnly,
      });
    },
    [],
  );

  const setInput = useCallback((value: string) => {
    setState((s) => (s.phase === "writing" ? { ...s, input: value } : s));
  }, []);

  const submit = useCallback(() => {
    setState((s) => {
      if (s.phase !== "writing") return s;
      const item = s.questions[s.index];
      if (!item) return s;
      const result = validateProduction(s.input, item);
      const entry: HistoryEntry = {
        itemId: item.id,
        input: s.input,
        isValid: result.isValid,
        matched: result.matchedConnecteur,
      };
      if (!result.isValid) {
        setWeakIds((prev) => {
          const next = new Set(prev);
          next.add(item.id);
          return next;
        });
      } else if (result.isValid && weakIds.has(item.id)) {
        setWeakIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
      return {
        ...s,
        phase: "feedback",
        feedback: result,
        history: [...s.history, entry],
      };
    });
  }, [weakIds]);

  const next = useCallback(() => {
    setState((s) => {
      if (s.phase !== "feedback") return s;
      const nextIndex = s.index + 1;
      if (nextIndex >= s.questions.length) {
        return { ...s, phase: "complete" };
      }
      return {
        ...s,
        phase: "writing",
        index: nextIndex,
        input: "",
        feedback: null,
      };
    });
  }, []);

  const restart = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: "idle",
      index: 0,
      input: "",
      feedback: null,
      history: [],
    }));
  }, []);

  const currentQuestion = useMemo(
    () => state.questions[state.index] ?? null,
    [state.questions, state.index],
  );

  const score = useMemo(
    () => state.history.filter((h) => h.isValid).length,
    [state.history],
  );

  return {
    state,
    currentQuestion,
    score,
    weakCount: weakIds.size,
    startQuiz,
    setInput,
    submit,
    next,
    restart,
  };
}
