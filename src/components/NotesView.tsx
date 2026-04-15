import { useRef, useState } from "react";
import { Trash2, NotebookPen } from "lucide-react";

export interface UserNote {
  id: string;
  text: string;
  note: string;
  createdAt: number;
}

interface NotesViewProps {
  notes: UserNote[];
  onAdd(text: string, note: string): void;
  onDelete(id: string): void;
}

export function NotesView({ notes, onAdd, onDelete }: NotesViewProps) {
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const textRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimText = text.trim();
    if (!trimText) return;
    onAdd(trimText, note.trim());
    setText("");
    setNote("");
    textRef.current?.focus();
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Add form */}
      <div className="rounded-(--radius-card) bg-(--color-surface) shadow-sm mb-4 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-(--color-ink)/8">
          <NotebookPen size={15} className="text-(--color-ink)" />
          <span className="text-sm font-semibold text-(--color-ink)">Mes notes</span>
          {notes.length > 0 && (
            <span className="ml-auto text-xs font-bold text-(--color-muted)">{notes.length}</span>
          )}
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="note-text" className="text-xs font-semibold text-(--color-muted) uppercase tracking-wide">
              Mot ou phrase
            </label>
            <input
              ref={textRef}
              id="note-text"
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Ex: à la suite de"
              lang="fr"
              className="w-full rounded-(--radius-button) border border-(--color-ink)/16 bg-(--color-bg) px-3 py-2 text-sm text-(--color-ink) placeholder:text-(--color-muted)/50 focus:outline-none focus:ring-2 focus:ring-(--color-ring) transition-shadow duration-150"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="note-desc" className="text-xs font-semibold text-(--color-muted) uppercase tracking-wide">
              Note <span className="normal-case font-normal opacity-60">(optionnelle)</span>
            </label>
            <input
              id="note-desc"
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ex: utilisé pour les causes formelles"
              lang="fr"
              className="w-full rounded-(--radius-button) border border-(--color-ink)/16 bg-(--color-bg) px-3 py-2 text-sm text-(--color-ink) placeholder:text-(--color-muted)/50 focus:outline-none focus:ring-2 focus:ring-(--color-ring) transition-shadow duration-150"
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className="self-end rounded-(--radius-button) bg-(--color-brand) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Ajouter
          </button>
        </form>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center text-(--color-muted)">
          <NotebookPen size={32} strokeWidth={1.5} />
          <p className="text-sm font-medium text-(--color-ink)">Aucune note pour l'instant</p>
          <p className="text-xs max-w-xs">
            Ajoute les mots ou expressions que tu veux retenir et qui ne sont pas encore dans l'application.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map(n => (
            <li
              key={n.id}
              className="flex items-start gap-3 rounded-(--radius-card) bg-(--color-surface) px-4 py-3 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-(--color-ink) leading-snug" lang="fr">{n.text}</p>
                {n.note && (
                  <p className="mt-0.5 text-xs text-(--color-muted)" lang="fr">{n.note}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDelete(n.id)}
                aria-label={`Supprimer "${n.text}"`}
                className="shrink-0 mt-0.5 text-(--color-muted) hover:text-red-400 transition-colors duration-150"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
