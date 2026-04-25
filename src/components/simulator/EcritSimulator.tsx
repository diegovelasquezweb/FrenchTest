"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  PenSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Home,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  ALL_PROMPTS,
  ARGUMENTATION_PROMPTS,
  FAITS_DIVERS_PROMPTS,
  type SimulatorPrompt,
  type SimulatorSection,
} from "@/src/data/simulatorPrompts";
import { analyzeProduction, type Analysis, type AnalysisFinding } from "@/src/lib/simulatorAnalyzer";
import { saveProduction } from "@/src/lib/savedProductions";

type Phase = "select" | "writing" | "review";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function pickRandom(section: SimulatorSection): SimulatorPrompt {
  const pool = section === "A" ? FAITS_DIVERS_PROMPTS : ARGUMENTATION_PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function EcritSimulator({ initialSection }: { initialSection?: SimulatorSection } = {}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("select");
  const [section, setSection] = useState<SimulatorSection>(initialSection ?? "A");
  const [prompt, setPrompt] = useState<SimulatorPrompt | null>(null);
  const [text, setText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showHints, setShowHints] = useState(true);
  const [saved, setSaved] = useState(false);
  const startTsRef = useRef<number>(0);

  const wordCount = useMemo(() => {
    const t = text.trim();
    if (!t) return 0;
    return t.split(/\s+/).filter((w) => /\w/.test(w)).length;
  }, [text]);

  useEffect(() => {
    if (phase !== "writing" || paused || !prompt) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, paused, prompt]);

  function startSimulation(p: SimulatorPrompt) {
    setPrompt(p);
    setText("");
    setSecondsLeft(p.durationSeconds);
    setPaused(false);
    setAnalysis(null);
    setSaved(false);
    setShowHints(true);
    startTsRef.current = Date.now();
    setPhase("writing");
  }

  function handleSubmit() {
    if (!prompt) return;
    const result = analyzeProduction(text, prompt);
    setAnalysis(result);
    setPhase("review");
  }

  function handleSave() {
    if (!prompt || !analysis || saved) return;
    const elapsed = prompt.durationSeconds - secondsLeft;
    saveProduction({
      id: `${prompt.id}-${Date.now()}`,
      promptId: prompt.id,
      promptTitle: prompt.title,
      section: prompt.section,
      text,
      wordCount: analysis.wordCount,
      globalScore: analysis.globalScore,
      createdAt: Date.now(),
      durationUsedSeconds: elapsed,
    });
    setSaved(true);
  }

  function handleRetry() {
    if (!prompt) return;
    startSimulation(prompt);
  }

  function handleNew() {
    setPhase("select");
    setPrompt(null);
    setText("");
    setAnalysis(null);
  }

  if (phase === "select") {
    return <SelectScreen section={section} setSection={setSection} onStart={startSimulation} />;
  }

  if (phase === "writing" && prompt) {
    const minOk = wordCount >= prompt.minWords;
    const minOkSoft = wordCount >= prompt.minWords * 0.75;
    const counterColor = minOk ? "text-brand" : minOkSoft ? "text-amber-600" : "text-rose-600";
    const timeWarn = secondsLeft <= 60;

    return (
      <div className="mx-auto w-full max-w-3xl space-y-3 px-4 py-4">
        <header className="rounded-card sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border border-ink/10 bg-surface p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <PenSquare size={14} className="text-brand" />
            <p className="text-sm font-bold text-ink">{prompt.title}</p>
            <span className="rounded-button border border-ink/15 bg-bg px-2 py-0.5 text-[11px] font-semibold text-muted">
              Section {prompt.section}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p className={`text-sm font-semibold ${counterColor}`}>
              {wordCount} / {prompt.minWords} mots
            </p>
            <div
              className={`flex items-center gap-1 rounded-button border px-2 py-1 text-sm font-bold ${
                timeWarn
                  ? "border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                  : "border-ink/15 bg-bg text-ink"
              }`}
            >
              <Clock size={12} />
              {formatTime(secondsLeft)}
            </div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="rounded-button cursor-pointer border border-ink/15 bg-bg px-2 py-1 text-xs font-semibold text-ink hover:bg-ink/5"
            >
              {paused ? "Reprendre" : "Pause"}
            </button>
          </div>
        </header>

        <section className="rounded-card border border-ink/10 bg-surface p-3 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Consigne</p>
          <p className="mt-1 text-sm text-ink" lang="fr">
            {prompt.consigne}
          </p>
          {prompt.amorce && (
            <div className="rounded-card mt-2 border border-ink/8 bg-bg p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Amorce</p>
              <p className="mt-1 text-sm italic text-ink" lang="fr">
                {prompt.amorce}
              </p>
            </div>
          )}
          {prompt.contexteHints && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowHints((v) => !v)}
                className="rounded-button flex cursor-pointer items-center gap-1 border border-ink/15 bg-bg px-2 py-1 text-xs font-semibold text-muted hover:text-ink"
              >
                {showHints ? <EyeOff size={12} /> : <Eye size={12} />}
                {showHints ? "Masquer les pistes" : "Voir les pistes"}
              </button>
              {showHints && (
                <ul className="mt-2 space-y-0.5">
                  {prompt.contexteHints.map((h) => (
                    <li key={h} className="text-xs text-muted" lang="fr">
                      • {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          lang="fr"
          rows={14}
          placeholder="Commencez à écrire..."
          disabled={paused}
          className="rounded-card w-full resize-y border border-ink/15 bg-surface p-4 text-sm leading-relaxed text-ink shadow-sm outline-none transition-colors focus:border-brand disabled:opacity-60"
        />

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-button cursor-pointer border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Terminer et analyser
          </button>
        </div>
      </div>
    );
  }

  if (phase === "review" && prompt && analysis) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
        <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-bold text-ink">{prompt.title}</h2>
            <p className="text-xs text-muted">Section {prompt.section}</p>
          </div>
          <p className="mt-3 text-3xl font-bold text-brand">{analysis.globalScore}/100</p>
          <p className="text-xs text-muted" lang="fr">
            Score indicatif basé sur l&apos;analyse automatique. Le TEF utilise une grille humaine plus large.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Stat label="Mots" value={`${analysis.wordCount} / ${prompt.minWords}`} />
            <Stat label="Connecteurs" value={`${analysis.connecteursFound.length}`} />
            <Stat label="Relations distinctes" value={`${analysis.uniqueRelations}`} />
          </div>
        </section>

        <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
          <h3 className="text-sm font-bold text-ink">Analyse détaillée</h3>
          <ul className="mt-2 space-y-1.5">
            {analysis.findings.map((f, idx) => (
              <FindingRow key={idx} finding={f} />
            ))}
          </ul>
        </section>

        {analysis.connecteursFound.length > 0 && (
          <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
            <h3 className="text-sm font-bold text-ink">Connecteurs détectés</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {analysis.connecteursFound.map((c, idx) => (
                <span
                  key={idx}
                  className="rounded-button inline-flex items-center gap-1 border border-brand/30 bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand"
                >
                  {c.connecteur}
                  <span className="text-muted">· {c.relation}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
          <h3 className="text-sm font-bold text-ink">Votre production</h3>
          <p className="mt-2 whitespace-pre-wrap rounded border border-ink/8 bg-bg p-3 text-sm leading-relaxed text-ink" lang="fr">
            {text || <span className="text-muted italic">(vide)</span>}
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className="rounded-button flex cursor-pointer items-center gap-2 border border-ink/15 bg-bg px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 disabled:opacity-50"
          >
            <Save size={14} />
            {saved ? "Sauvegardée" : "Sauvegarder"}
          </button>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-button flex cursor-pointer items-center gap-2 border border-ink/15 bg-bg px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            <RefreshCw size={14} /> Refaire ce sujet
          </button>
          <button
            type="button"
            onClick={handleNew}
            className="rounded-button flex cursor-pointer items-center gap-2 border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <PenSquare size={14} /> Nouveau sujet
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-button flex cursor-pointer items-center gap-2 border border-ink/15 bg-bg px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            <Home size={14} /> Accueil
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-ink/8 bg-bg px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function FindingRow({ finding }: { finding: AnalysisFinding }) {
  const Icon =
    finding.status === "ok" ? CheckCircle2 : finding.status === "warn" ? AlertTriangle : XCircle;
  const color =
    finding.status === "ok"
      ? "text-brand"
      : finding.status === "warn"
        ? "text-amber-500"
        : "text-rose-500";
  return (
    <li className="flex items-start gap-2">
      <Icon size={14} className={`mt-0.5 shrink-0 ${color}`} />
      <p className="text-sm text-ink" lang="fr">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          {finding.category}
        </span>{" "}
        — {finding.message}
      </p>
    </li>
  );
}

function SelectScreen({
  section,
  setSection,
  onStart,
}: {
  section: SimulatorSection;
  setSection: (s: SimulatorSection) => void;
  onStart: (p: SimulatorPrompt) => void;
}) {
  const pool = section === "A" ? FAITS_DIVERS_PROMPTS : ARGUMENTATION_PROMPTS;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6">
      <header className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <h1 className="text-lg font-bold text-ink">Simulateur — Expression écrite</h1>
        <p className="mt-1 text-sm text-muted" lang="fr">
          Reproduit les conditions du TEF Canada 2026 : timer, compteur de mots, sans correcteur, sans copier-coller.
        </p>
      </header>

      <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <h2 className="text-sm font-bold text-ink">Choisissez la section</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <SectionButton
            active={section === "A"}
            onClick={() => setSection("A")}
            title="Section A — Fait divers"
            meta="25 min · 80 mots minimum"
            description="Continuer un article de presse en respectant le style journalistique."
          />
          <SectionButton
            active={section === "B"}
            onClick={() => setSection("B")}
            title="Section B — Argumentation"
            meta="35 min · 200 mots minimum"
            description="Exprimer et justifier un point de vue avec des arguments structurés."
          />
        </div>
      </section>

      <section className="rounded-card border border-ink/10 bg-surface p-4 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-bold text-ink">Choisissez un sujet</h2>
          <button
            type="button"
            onClick={() => onStart(pickRandom(section))}
            className="rounded-button cursor-pointer border border-brand bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sujet aléatoire
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {pool.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onStart(p)}
                className="rounded-card w-full cursor-pointer border border-ink/10 bg-bg p-3 text-left transition-colors hover:border-brand hover:bg-brand/5"
              >
                <p className="text-sm font-bold text-ink">{p.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted" lang="fr">
                  {p.consigne}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SectionButton({
  active,
  onClick,
  title,
  meta,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  meta: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-card cursor-pointer border p-3 text-left transition-colors ${
        active
          ? "border-brand bg-brand/5"
          : "border-ink/10 bg-bg hover:border-ink/20 hover:bg-ink/5"
      }`}
    >
      <p className={`text-sm font-bold ${active ? "text-brand" : "text-ink"}`}>{title}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{meta}</p>
      <p className="mt-1 text-xs text-muted" lang="fr">
        {description}
      </p>
    </button>
  );
}

export { ALL_PROMPTS };
