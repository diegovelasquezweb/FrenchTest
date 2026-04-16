"use client";

import { TranslatorView } from "@/src/components/TranslatorView";
import { AuthGate } from "@/src/layout/AuthGate";

export default function TraducteurPage() {
  return (
    <AuthGate>
      <TranslatorView />
    </AuthGate>
  );
}
