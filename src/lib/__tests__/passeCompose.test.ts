import { describe, it, expect } from "vitest";
import { buildPasseCompose } from "../passeCompose";
import type { Verb } from "../../types";

function verb(auxiliary: "avoir" | "être", participle: string): Verb {
  return {
    infinitive: "test",
    translation: "test",
    translationEs: "test",
    participle,
    auxiliary,
    ending: "-é",
    irregular: false,
    confusers: ["", "", ""],
    confuserTenses: ["présent", "imparfait", "futur"],
  };
}

// ── avoir ─────────────────────────────────────────────────────────────────────

describe("buildPasseCompose — avoir", () => {
  const rows = buildPasseCompose(verb("avoir", "mangé"));

  it("tiene 8 filas", () => {
    expect(rows).toHaveLength(8);
  });

  it("usa auxiliares de avoir", () => {
    expect(rows[0].form).toBe("j'ai mangé");
    expect(rows[1].form).toBe("tu as mangé");
    expect(rows[2].form).toBe("il a mangé");
    expect(rows[4].form).toBe("nous avons mangé");
  });

  it("participe NO varía con avoir", () => {
    for (const row of rows) {
      expect(row.form).toContain("mangé");
      expect(row.form).not.toContain("mangée");
    }
  });
});

// ── être — acuerdo del participio ─────────────────────────────────────────────

describe("buildPasseCompose — être", () => {
  const rows = buildPasseCompose(verb("être", "parti"));

  it("usa auxiliares de être", () => {
    expect(rows[2].form).toContain("il est");
    expect(rows[3].form).toContain("elle est");
    expect(rows[4].form).toContain("nous sommes");
    expect(rows[6].form).toContain("ils sont");
    expect(rows[7].form).toContain("elles sont");
  });

  it("il → sin acuerdo (parti)", () => {
    const il = rows.find(r => r.subject === "il")!;
    expect(il.form).toContain("parti");
    expect(il.form).not.toContain("partie");
  });

  it("elle → femenino (partie)", () => {
    const elle = rows.find(r => r.subject === "elle")!;
    expect(elle.form).toContain("partie");
  });

  it("ils → plural masculino (partis)", () => {
    const ils = rows.find(r => r.subject === "ils")!;
    expect(ils.form).toContain("partis");
  });

  it("elles → plural femenino (parties)", () => {
    const elles = rows.find(r => r.subject === "elles")!;
    expect(elles.form).toContain("parties");
  });

  it("je/tu → formato ambiguo singular (parti / partie)", () => {
    for (const subject of ["je", "tu"]) {
      const row = rows.find(r => r.subject === subject)!;
      expect(row.form).toContain("parti / partie");
    }
  });

  it("nous/vous ambiguo incluye plural (partis / parties)", () => {
    const nous = rows.find(r => r.subject === "nous")!;
    expect(nous.form).toContain("partis / parties");
    const vous = rows.find(r => r.subject === "vous")!;
    expect(vous.form).toContain("partis / parties");
  });
});
