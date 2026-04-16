"use client";

import { TranslatorView } from "@/src/components/TranslatorView";
import { AuthGate } from "@/src/layout/AuthGate";

export default function TraducteurPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 items-center justify-center">
        <TranslatorView />
      </div>
    </AuthGate>
  );
}
