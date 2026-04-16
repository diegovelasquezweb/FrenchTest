"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuth } from "@/src/lib/auth-context";
import { AiChatDrawer } from "@/src/components/AiChatDrawer";

const PUBLIC_PATHS = ["/login", "/auth/callback"];

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const pathname = usePathname();
  const { status } = useAuth();
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isAuthenticated = status === "authed" || status === "guest";

  if (isPublic || !isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-(--color-bg)">
      <Sidebar onOpenAiChat={() => setAiChatOpen(true)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <AiChatDrawer open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
