"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";

// Routes accessible without authentication (guest and unauthed alike).
const PUBLIC_PATHS = ["/auth/callback", "/login"];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (!isPublic && status === "unauthed") {
      router.replace("/login");
    }
  }, [status, isPublic, router]);

  // Always render public paths immediately.
  if (isPublic) return <>{children}</>;

  // Show nothing while loading or redirecting unauthed users.
  if (status === "loading" || status === "unauthed") return null;

  return <>{children}</>;
}
