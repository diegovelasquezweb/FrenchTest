"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-5xl font-bold text-brand">404</p>
      <h1 className="text-xl font-semibold text-ink">
        Page introuvable
      </h1>
      <p className="text-sm text-muted">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-button bg-brand px-4 py-2 text-sm font-medium text-white"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
