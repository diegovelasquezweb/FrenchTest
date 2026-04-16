import { useEffect, useRef, useState } from "react";
import { X, Send, Trash2 } from "lucide-react";
import type { ChatMessage } from "./aiChat";
import { checkAiKey, deleteAiKey, sendMessage } from "./aiChat";
import { ApiKeySetup } from "./ApiKeySetup";

interface AiChatDrawerProps {
  open: boolean;
  onClose(): void;
}

export function AiChatDrawer({ open, onClose }: AiChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyConfigured, setKeyConfigured] = useState<boolean | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || keyConfigured !== null) return;
    checkAiKey().then(setKeyConfigured);
  }, [open, keyConfigured]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open && keyConfigured) inputRef.current?.focus();
  }, [open, keyConfigured]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await sendMessage(next);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  async function handleDeleteKey() {
    await deleteAiKey();
    setKeyConfigured(false);
    setMessages([]);
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Poser une question à l'IA"
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[90vw] flex flex-col bg-(--color-surface) shadow-xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-ink)/8 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-(--color-ink)">Poser une question à l'IA</span>
            <span className="inline-flex items-center rounded-full bg-(--color-brand)/10 px-2 py-0.5 text-[10px] font-semibold text-(--color-brand)">Claude</span>
          </div>
          <div className="flex items-center gap-1">
            {keyConfigured && (
              <button
                type="button"
                onClick={handleDeleteKey}
                aria-label="Supprimer la clé API"
                className="flex h-7 w-7 items-center justify-center rounded text-(--color-muted) hover:bg-red-500/10 hover:text-red-500 transition-colors duration-150"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="flex h-7 w-7 items-center justify-center rounded text-(--color-muted) hover:bg-(--color-ink)/8 hover:text-(--color-ink) transition-colors duration-150"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        {keyConfigured === null ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-xs text-(--color-muted)">Chargement…</span>
          </div>
        ) : !keyConfigured ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-(--color-muted)">
              Pour utiliser le chat, configure ta clé API Anthropic.
            </p>
            <button
              type="button"
              onClick={() => setShowSetup(true)}
              className="rounded-(--radius-button) bg-(--color-brand) px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Configurer la clé
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {messages.length === 0 && (
                <p className="text-xs text-(--color-muted) text-center mt-4">
                  Pose une question sur la grammaire, le vocabulaire, la traduction ou le TEF.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-(--color-brand) text-white rounded-br-sm"
                        : "bg-(--color-ink)/6 text-(--color-ink) rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-(--color-ink)/6 px-3 py-2">
                    <span className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="inline-block h-1.5 w-1.5 rounded-full bg-(--color-muted) animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              {error && (
                <p className="text-xs text-red-500 dark:text-red-400 text-center">{error}</p>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-(--color-ink)/8 px-3 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écris ta question…"
                  className="flex-1 resize-none rounded-(--radius-button) border border-(--color-ink)/12 bg-(--color-bg) px-3 py-2 text-sm text-(--color-ink) placeholder:text-(--color-muted)/50 focus:outline-2 focus:outline-(--color-ring) focus:outline-offset-2 max-h-32 overflow-y-auto"
                  style={{ fieldSizing: "content" } as React.CSSProperties}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  aria-label="Envoyer"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-button) bg-(--color-brand) text-white transition-opacity disabled:opacity-40 hover:opacity-90"
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-(--color-muted)/50 text-center">Enter pour envoyer · Shift+Enter nouvelle ligne</p>
            </div>
          </>
        )}
      </div>

      {showSetup && (
        <ApiKeySetup
          onSaved={() => { setShowSetup(false); setKeyConfigured(true); }}
          onCancel={() => setShowSetup(false)}
        />
      )}
    </>
  );
}
