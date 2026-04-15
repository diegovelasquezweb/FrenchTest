import { describe, it, expect } from "vitest";
import { fisherYates, seededRng } from "../shuffle";

// ── fisherYates ───────────────────────────────────────────────────────────────

describe("fisherYates", () => {
  it("devuelve un array de la misma longitud", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(fisherYates(arr)).toHaveLength(arr.length);
  });

  it("contiene los mismos elementos", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(fisherYates(arr).sort()).toEqual([...arr].sort());
  });

  it("no muta el array original", () => {
    const arr = [1, 2, 3, 4, 5];
    fisherYates(arr);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });

  it("con seed fija produce el mismo resultado siempre", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const rng = seededRng(42);
    const a = fisherYates([...arr], rng);
    const rng2 = seededRng(42);
    const b = fisherYates([...arr], rng2);
    expect(a).toEqual(b);
  });

  it("con seeds distintas produce resultados distintos", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const a = fisherYates([...arr], seededRng(1));
    const b = fisherYates([...arr], seededRng(999));
    expect(a).not.toEqual(b);
  });

  it("array vacío devuelve array vacío", () => {
    expect(fisherYates([])).toEqual([]);
  });

  it("array de un elemento devuelve el mismo", () => {
    expect(fisherYates([42])).toEqual([42]);
  });
});

// ── seededRng ─────────────────────────────────────────────────────────────────

describe("seededRng", () => {
  it("devuelve valores entre 0 y 1", () => {
    const rng = seededRng(123);
    for (let i = 0; i < 20; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("misma seed produce misma secuencia", () => {
    const a = seededRng(7);
    const b = seededRng(7);
    for (let i = 0; i < 10; i++) {
      expect(a()).toBe(b());
    }
  });

  it("seeds distintas producen secuencias distintas", () => {
    const a = seededRng(1);
    const b = seededRng(2);
    const va = Array.from({ length: 5 }, () => a());
    const vb = Array.from({ length: 5 }, () => b());
    expect(va).not.toEqual(vb);
  });

  it("es determinístico — primer valor de seed 42 siempre es el mismo", () => {
    const first = seededRng(42)();
    expect(seededRng(42)()).toBe(first);
  });
});
