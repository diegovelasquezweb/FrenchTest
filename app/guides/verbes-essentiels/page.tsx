"use client";

import { EssentialVerbsGuide } from "@/src/components/EssentialVerbsGuide";
import { AuthGate } from "@/src/layout/AuthGate";

export default function VerbsEssentielsPage() {
  return (
    <AuthGate>
      <EssentialVerbsGuide />
    </AuthGate>
  );
}
