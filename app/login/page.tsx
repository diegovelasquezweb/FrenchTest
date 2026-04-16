"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginScreen } from "@/src/components/LoginScreen";
import { useAuth } from "@/src/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { signInGitHub, signInGoogle, enterGuest, status } = useAuth();

  // Redirect away from login once authenticated (guest or authed).
  useEffect(() => {
    if (status === "authed" || status === "guest") {
      void router.replace("/");
    }
  }, [status, router]);

  return (
    <LoginScreen
      onGitHub={signInGitHub}
      onGoogle={signInGoogle}
      onGuest={enterGuest}
    />
  );
}
