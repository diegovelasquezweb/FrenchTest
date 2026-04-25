"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseTtsOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceURI?: string | null;
}

const FEMALE_FR_VOICE_PRIORITY = [
  "Amélie",
  "Amelie",
  "Aurélie",
  "Aurelie",
  "Audrey",
  "Marie",
  "Virginie",
  "Léa",
  "Lea",
  "Chantal",
  "Céline",
  "Celine",
  "Hortense",
  "Julie",
];

const MALE_FR_NAMES = [
  "thomas",
  "nicolas",
  "henri",
  "paul",
  "daniel",
  "jean",
  "pierre",
  "jacques",
];

function isFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  if (MALE_FR_NAMES.some((m) => name.includes(m))) return false;
  if (name.includes("male") && !name.includes("female")) return false;
  if (name.includes("female") || name.includes("femme") || name.includes("woman")) return true;
  return FEMALE_FR_VOICE_PRIORITY.some((n) => name.includes(n.toLowerCase()));
}

interface PickedVoice {
  voice: SpeechSynthesisVoice | null;
  needsPitchBoost: boolean;
}

function pickFemaleFrenchVoice(voices: SpeechSynthesisVoice[]): PickedVoice {
  const french = voices.filter((v) => v.lang.toLowerCase().startsWith("fr"));
  if (french.length === 0) return { voice: null, needsPitchBoost: false };

  for (const name of FEMALE_FR_VOICE_PRIORITY) {
    const match = french.find((v) => v.name.toLowerCase().includes(name.toLowerCase()));
    if (match) return { voice: match, needsPitchBoost: false };
  }

  const female = french.find(isFemaleVoice);
  if (female) return { voice: female, needsPitchBoost: false };

  const nonMale = french.find(
    (v) => !MALE_FR_NAMES.some((m) => v.name.toLowerCase().includes(m)),
  );
  if (nonMale) return { voice: nonMale, needsPitchBoost: true };

  const frFr = french.find((v) => v.lang.toLowerCase() === "fr-fr");
  return { voice: frFr ?? french[0], needsPitchBoost: true };
}

export function useTts({
  rate = 0.95,
  pitch = 1,
  volume = 1,
  voiceURI = null,
}: UseTtsOptions = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setIsSupported(true);

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      const french = all.filter((v) => v.lang.toLowerCase().startsWith("fr"));
      setVoices(french);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const resolved = useMemo<PickedVoice>(() => {
    if (voices.length === 0) return { voice: null, needsPitchBoost: false };
    if (voiceURI) {
      const match = voices.find((v) => v.voiceURI === voiceURI);
      if (match) return { voice: match, needsPitchBoost: false };
    }
    return pickFemaleFrenchVoice(voices);
  }, [voices, voiceURI]);

  const resolvedRef = useRef(resolved);
  resolvedRef.current = resolved;

  const speak = useCallback(
    (text: string, opts?: { onEnd?: () => void; onError?: () => void }) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const picked = resolvedRef.current;
      if (picked.voice) {
        utterance.voice = picked.voice;
        utterance.lang = picked.voice.lang;
      } else {
        utterance.lang = "fr-FR";
      }
      utterance.rate = rate;
      utterance.pitch = picked.needsPitchBoost ? Math.min(2, pitch + 0.4) : pitch;
      utterance.volume = volume;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        opts?.onEnd?.();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        opts?.onError?.();
      };

      synth.speak(utterance);
    },
    [rate, pitch, volume],
  );

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice: resolved.voice,
  };
}
