"use client";

import { EssentialVerbsGuide } from "@/src/components/guides/EssentialVerbsGuide";
import { AuthGate } from "@/src/layout/AuthGate";

export default function VerbsEssentielsPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 items-center justify-center">
        <EssentialVerbsGuide />
      </div>
    </AuthGate>
  );
}
