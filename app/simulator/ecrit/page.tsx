"use client";

import { AuthGate } from "@/src/layout/AuthGate";
import { EcritSimulator } from "@/src/components/simulator/EcritSimulator";

export default function SimulatorEcritPage() {
  return (
    <AuthGate>
      <EcritSimulator />
    </AuthGate>
  );
}
