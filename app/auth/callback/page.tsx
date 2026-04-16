"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { exchangeCode, validateOAuthCallback } from "@/src/lib/auth";
import { loadStore } from "@/src/lib/store";

export default function AuthCallbackPage() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-invocation — nonce is consumed on first run.
    if (ran.current) return;
    ran.current = true;

    const code = params.get("code");
    const state = params.get("state") ?? "";

    if (!code) {
      window.location.assign("/");
      return;
    }

    (async () => {
      try {
        const provider = validateOAuthCallback(state);
        await exchangeCode(code, provider);
        await loadStore();
        window.location.assign("/");
      } catch (err) {
        console.error("[auth/callback] error:", err);
        setError("La connexion a échoué. Veuillez réessayer.");
      }
    })();
  }, [params]);

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm font-medium text-wrong">{error}</p>
        <a
          href="/login"
          className="text-sm text-brand underline underline-offset-2"
        >
          Retour à la connexion
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-sm text-muted">Connexion en cours…</p>
    </div>
  );
}
