"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { ThemeToggle } from "@/src/components/ui/ThemeToggle";
import { useAuth } from "@/src/lib/auth-context";
import { useTheme } from "@/src/hooks/useTheme";
import { logout } from "@/src/lib/auth";

export function Topbar() {
  const pathname = usePathname();
  const { session, status } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();

  const isHome = pathname === "/";
  const login =
    status === "authed"
      ? (session?.login ?? "?")
      : status === "guest"
        ? "Invité"
        : "?";
  const initial = login[0]?.toUpperCase() ?? "?";

  async function handleLogout() {
    await logout();
    window.location.assign("/");
  }

  return (
    <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-ink/8 bg-surface px-4 py-3">
      {isHome ? (
        <Link
          href="/"
          className="text-sm font-bold text-ink hover:text-brand transition-colors duration-150"
        >
          🇨🇦 TEF Pratiquer
        </Link>
      ) : (
        <Link
          href="/"
          className="text-sm font-medium text-muted hover:text-ink transition-colors duration-150"
        >
          ← Accueil
        </Link>
      )}

      <div className="flex items-center gap-2">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand"
            >
              {initial}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="end"
              sideOffset={8}
              className="z-50 min-w-36 rounded-card border border-ink/8 bg-surface py-1 shadow-lg shadow-ink/8"
            >
              <div className="px-3 py-1.5 text-xs font-medium text-muted">{login}</div>
              {status === "authed" && (
                <Link
                  href="/mes-notes"
                  className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-ink/5 transition-colors duration-150"
                >
                  Mes notes
                </Link>
              )}
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/8 transition-colors duration-150"
              >
                Déconnexion
              </button>
              <Popover.Arrow className="fill-surface" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
    </div>
  );
}
