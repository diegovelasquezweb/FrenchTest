"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "@/src/lib/auth-context";
import { pushStore } from "@/src/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  // Mount gate: prevents rendering any tree that reads localStorage during SSR.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Push store to worker on tab close — global concern, belongs at root.
  useEffect(() => {
    const handleBeforeUnload = () => {
      void pushStore();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  if (!mounted) return null;

  return <AuthProvider>{children}</AuthProvider>;
}
