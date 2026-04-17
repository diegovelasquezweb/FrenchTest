"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Session } from "./auth";
import {
  clearGuestMode,
  enterGuestMode,
  isGuest,
  logout as rawLogout,
  redirectToGitHub,
  redirectToGoogle,
  restoreSession,
} from "./auth";
import { loadStore } from "./store";

export type AuthStatus = "loading" | "authed" | "guest" | "unauthed";

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  signInGitHub: () => void;
  signInGoogle: () => void;
  enterGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const restored = restoreSession();
    if (restored) {
      setSession(restored);
      void loadStore().finally(() => setStatus("authed"));
      return;
    }
    if (isGuest()) {
      setStatus("guest");
      return;
    }
    setStatus("unauthed");
  }, []);

  const enterGuest = useCallback(() => {
    enterGuestMode();
    setStatus("guest");
  }, []);

  const signOut = useCallback(async () => {
    await rawLogout();
    clearGuestMode();
    setSession(null);
    setStatus("unauthed");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        session,
        signInGitHub: redirectToGitHub,
        signInGoogle: redirectToGoogle,
        enterGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
