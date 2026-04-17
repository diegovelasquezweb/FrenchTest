"use client";

import { TerminaisonsGuide } from "@/src/components/guides/TerminaisonsGuide";
import { AuthGate } from "@/src/layout/AuthGate";

export default function TerminaisonsPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 items-center justify-center">
        <TerminaisonsGuide />
      </div>
    </AuthGate>
  );
}
