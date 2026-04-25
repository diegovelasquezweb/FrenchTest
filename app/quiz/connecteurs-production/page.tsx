"use client";

import { AuthGate } from "@/src/layout/AuthGate";
import { ConnecteursProductionView } from "@/src/components/quiz/ConnecteursProductionView";

export default function ConnecteursProductionPage() {
  return (
    <AuthGate>
      <ConnecteursProductionView />
    </AuthGate>
  );
}
