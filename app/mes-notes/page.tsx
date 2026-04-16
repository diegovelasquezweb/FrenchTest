"use client";

import { useEffect, useState } from "react";
import { NotesView } from "@/src/components/NotesView";
import type { UserNote } from "@/src/components/NotesView";
import { AuthGate } from "@/src/layout/AuthGate";
import { getItem, setItem } from "@/src/lib/store";

export default function MesNotesPage() {
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = getItem("tef-notes");
      setUserNotes(stored ? (JSON.parse(stored) as UserNote[]) : []);
    } catch {
      setUserNotes([]);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    setItem("tef-notes", JSON.stringify(userNotes));
  }, [userNotes, initialized]);

  function handleAddNote(text: string, note: string) {
    setUserNotes((prev) => [
      { id: crypto.randomUUID(), text, note, createdAt: Date.now() },
      ...prev,
    ]);
  }

  function handleDeleteNote(id: string) {
    setUserNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <AuthGate>
      <div className="w-full">
        <NotesView
          notes={userNotes}
          onAdd={handleAddNote}
          onDelete={handleDeleteNote}
        />
      </div>
    </AuthGate>
  );
}
