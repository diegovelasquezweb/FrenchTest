import { describe, it, expect } from "vitest";
import { applyRating, buildDeck, totalMastered } from "../flashcardProgress";
import type { CardProgress } from "../../types";
import type { Flashcard } from "../../types";

// ── helpers ──────────────────────────────────────────────────────────────────

function card(id: string): Flashcard {
  return {
    id,
    front: id,
    usage: "",
    translationEn: "",
    translationEs: "",
    category: "oral",
  };
}

function progress(score: 0 | 1 | 2, consecutiveCorrect = 0): CardProgress {
  return { score, consecutiveCorrect, lastSeen: 0 };
}

// ── applyRating ───────────────────────────────────────────────────────────────

describe("applyRating", () => {
  it("rating 2 → score=2, consecutiveCorrect increments", () => {
    const result = applyRating({ a: progress(0, 0) }, "a", 2);
    expect(result.a.score).toBe(2);
    expect(result.a.consecutiveCorrect).toBe(1);
  });

  it("rating 2 acumula consecutiveCorrect", () => {
    const p = { a: progress(2, 3) };
    const result = applyRating(p, "a", 2);
    expect(result.a.consecutiveCorrect).toBe(4);
  });

  it("rating 1 → score=1, consecutiveCorrect reset a 0", () => {
    const result = applyRating({ a: progress(2, 5) }, "a", 1);
    expect(result.a.score).toBe(1);
    expect(result.a.consecutiveCorrect).toBe(0);
  });

  it("rating 0 → score=0, consecutiveCorrect reset a 0", () => {
    const result = applyRating({ a: progress(2, 5) }, "a", 0);
    expect(result.a.score).toBe(0);
    expect(result.a.consecutiveCorrect).toBe(0);
  });

  it("card nueva (sin progreso previo) se inicializa correctamente", () => {
    const result = applyRating({}, "nueva", 2);
    expect(result.nueva.score).toBe(2);
    expect(result.nueva.consecutiveCorrect).toBe(1);
  });

  it("no muta el objeto original", () => {
    const original = { a: progress(1, 0) };
    applyRating(original, "a", 2);
    expect(original.a.score).toBe(1);
  });

  it("actualiza lastSeen a un timestamp reciente", () => {
    const before = Date.now();
    const result = applyRating({}, "a", 1);
    expect(result.a.lastSeen).toBeGreaterThanOrEqual(before);
  });
});

// ── buildDeck ─────────────────────────────────────────────────────────────────

describe("buildDeck", () => {
  const cards = ["a", "b", "c", "d"].map(card);

  it("excluye cards con score=2", () => {
    const prog = {
      a: progress(2),
      b: progress(2),
      c: progress(0),
      d: progress(1),
    };
    const deck = buildDeck(cards, prog);
    const ids = deck.map(c => c.id);
    expect(ids).not.toContain("a");
    expect(ids).not.toContain("b");
    expect(ids).toContain("c");
    expect(ids).toContain("d");
  });

  it("cards con score=1 van antes que score=0", () => {
    const prog = {
      a: progress(0),
      b: progress(1),
      c: progress(0),
      d: progress(1),
    };
    const deck = buildDeck(cards, prog);
    const priorityIds = new Set(["b", "d"]);
    const normalIds   = new Set(["a", "c"]);
    const firstTwo  = new Set(deck.slice(0, 2).map(c => c.id));
    const lastTwo   = new Set(deck.slice(2).map(c => c.id));
    expect(firstTwo).toEqual(priorityIds);
    expect(lastTwo).toEqual(normalIds);
  });

  it("si todas están dominadas (score=2) devuelve el mazo completo mezclado", () => {
    const prog = Object.fromEntries(cards.map(c => [c.id, progress(2)]));
    const deck = buildDeck(cards, prog);
    expect(deck).toHaveLength(cards.length);
    expect(deck.map(c => c.id).sort()).toEqual(cards.map(c => c.id).sort());
  });

  it("card sin progreso previo se trata como score=0", () => {
    const deck = buildDeck(cards, {});
    expect(deck).toHaveLength(cards.length);
  });

  it("no muta el array original", () => {
    const original = [...cards];
    buildDeck(cards, {});
    expect(cards).toEqual(original);
  });
});

// ── totalMastered ─────────────────────────────────────────────────────────────

describe("totalMastered", () => {
  it("cuenta solo cards con score=2", () => {
    const prog = {
      a: progress(2),
      b: progress(1),
      c: progress(2),
      d: progress(0),
    };
    expect(totalMastered(prog)).toBe(2);
  });

  it("devuelve 0 si no hay ninguna dominada", () => {
    expect(totalMastered({ a: progress(0), b: progress(1) })).toBe(0);
  });

  it("devuelve 0 con objeto vacío", () => {
    expect(totalMastered({})).toBe(0);
  });
});
