"use client";

import { useState } from "react";
import type { CardOrder } from "./useFlashcards";
import type { MarathonMode, RepetitionStyle } from "../components/flashcard/FlashcardView";

export interface FlashcardSettings {
  autoPlay: boolean;
  setAutoPlay(v: boolean): void;
  autoSeconds: number;
  setAutoSeconds(v: number): void;
  order: CardOrder;
  setOrder(v: CardOrder): void;
  mode: MarathonMode;
  setMode(v: MarathonMode): void;
  repetitionStyle: RepetitionStyle;
  setRepetitionStyle(v: RepetitionStyle): void;
  ttsAutoplay: boolean;
  setTtsAutoplay(v: boolean): void;
  ttsRate: number;
  setTtsRate(v: number): void;
  ttsPitch: number;
  setTtsPitch(v: number): void;
  ttsVolume: number;
  setTtsVolume(v: number): void;
  ttsVoiceURI: string | null;
  setTtsVoiceURI(v: string | null): void;
  ttsAdvanceOnEnd: boolean;
  setTtsAdvanceOnEnd(v: boolean): void;
  ttsAdvanceDelayMs: number;
  setTtsAdvanceDelayMs(v: number): void;
  persist(): void;
}

function readBool(key: string, fallback = false): boolean {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  return v === null ? fallback : v === "1";
}

function readNumber(key: string, fallback: number, min: number, max: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function readOrder(key: string, fallback: CardOrder): CardOrder {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  if (v === "alpha" || v === "fixed" || v === "random") return v;
  return fallback;
}

function readMode(key: string, fallback: MarathonMode): MarathonMode {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  if (v === "lecture" || v === "répétition" || v === "révision") return v;
  return fallback;
}

function readRepStyle(key: string, fallback: RepetitionStyle): RepetitionStyle {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) === "masking" ? "masking" : fallback;
}

export function useFlashcardSettings(storageKey: string): FlashcardSettings {
  const k = (suffix: string) => `${storageKey}-${suffix}`;

  const [autoPlay, setAutoPlay] = useState(() => readBool(k("autoplay"), false));
  const [autoSeconds, setAutoSeconds] = useState(() => readNumber(k("autoseconds"), 5, 1, 30));
  const [order, setOrder] = useState<CardOrder>(() => readOrder(k("order"), "fixed"));
  const [mode, setMode] = useState<MarathonMode>(() => readMode(k("mode"), "lecture"));
  const [repetitionStyle, setRepetitionStyle] = useState<RepetitionStyle>(() =>
    readRepStyle(k("repstyle"), "intensity"),
  );
  const [ttsAutoplay, setTtsAutoplay] = useState(() => readBool(k("ttsautoplay"), false));
  const [ttsRate, setTtsRate] = useState(() => readNumber(k("ttsrate"), 0.95, 0.5, 1.5));
  const [ttsPitch, setTtsPitch] = useState(() => readNumber(k("ttspitch"), 1, 0.5, 1.5));
  const [ttsVolume, setTtsVolume] = useState(() => readNumber(k("ttsvolume"), 1, 0, 1));
  const [ttsVoiceURI, setTtsVoiceURI] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(k("ttsvoiceuri"));
  });
  const [ttsAdvanceOnEnd, setTtsAdvanceOnEnd] = useState(() => readBool(k("ttsadvanceonend"), false));
  const [ttsAdvanceDelayMs, setTtsAdvanceDelayMs] = useState(() =>
    readNumber(k("ttsadvancedelay"), 1500, 0, 4000),
  );

  function persist() {
    if (typeof window === "undefined") return;
    localStorage.setItem(k("autoplay"), autoPlay ? "1" : "0");
    localStorage.setItem(k("autoseconds"), String(autoSeconds));
    localStorage.setItem(k("order"), order);
    localStorage.setItem(k("mode"), mode);
    localStorage.setItem(k("repstyle"), repetitionStyle);
    localStorage.setItem(k("ttsautoplay"), ttsAutoplay ? "1" : "0");
    localStorage.setItem(k("ttsrate"), String(ttsRate));
    localStorage.setItem(k("ttspitch"), String(ttsPitch));
    localStorage.setItem(k("ttsvolume"), String(ttsVolume));
    if (ttsVoiceURI) {
      localStorage.setItem(k("ttsvoiceuri"), ttsVoiceURI);
    } else {
      localStorage.removeItem(k("ttsvoiceuri"));
    }
    localStorage.setItem(k("ttsadvanceonend"), ttsAdvanceOnEnd ? "1" : "0");
    localStorage.setItem(k("ttsadvancedelay"), String(ttsAdvanceDelayMs));
  }

  return {
    autoPlay,
    setAutoPlay,
    autoSeconds,
    setAutoSeconds,
    order,
    setOrder,
    mode,
    setMode,
    repetitionStyle,
    setRepetitionStyle,
    ttsAutoplay,
    setTtsAutoplay,
    ttsRate,
    setTtsRate,
    ttsPitch,
    setTtsPitch,
    ttsVolume,
    setTtsVolume,
    ttsVoiceURI,
    setTtsVoiceURI,
    ttsAdvanceOnEnd,
    setTtsAdvanceOnEnd,
    ttsAdvanceDelayMs,
    setTtsAdvanceDelayMs,
    persist,
  };
}
