"use client";

import { MrsVandertrampGuide } from "@/src/components/MrsVandertrampGuide";
import { AuthGate } from "@/src/layout/AuthGate";

export default function EtreAvoirGuidePage() {
  return (
    <AuthGate>
      <MrsVandertrampGuide />
    </AuthGate>
  );
}
