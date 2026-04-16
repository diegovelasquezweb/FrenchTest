"use client";

import { TerminaisonsGuide } from "@/src/components/TerminaisonsGuide";
import { AuthGate } from "@/src/layout/AuthGate";

export default function TerminaisonsPage() {
  return (
    <AuthGate>
      <TerminaisonsGuide />
    </AuthGate>
  );
}
