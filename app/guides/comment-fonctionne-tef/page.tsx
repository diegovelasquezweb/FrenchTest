"use client";

import { CommentFonctionneTefGuide } from "@/src/components/guides/CommentFonctionneTefGuide";
import { AuthGate } from "@/src/layout/AuthGate";

export default function CommentFonctionneTefPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 items-start justify-center">
        <CommentFonctionneTefGuide />
      </div>
    </AuthGate>
  );
}
