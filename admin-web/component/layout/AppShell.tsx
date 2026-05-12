"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TopNav from "@/component/layout/TopNav";
import StatusBar from "@/component/layout/StatusBar";
import CommandPalette from "@/component/layout/CommandPalette";
import { useAuth } from "@/lib/context/AuthContext";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openCommand, setOpenCommand] = useState(false);
  const { user, isLoading } = useAuth();

  const isAuthPage = pathname.startsWith("/auth");

  // ── Route guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading) return;
    if (isAuthPage) return;

    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, isAuthPage, router]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenCommand(true);
      }
      if (e.key === "Escape") setOpenCommand(false);
    };

    const handleOpenCommand = () => setOpenCommand(true);

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("meridian:openCommand", handleOpenCommand);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("meridian:openCommand", handleOpenCommand);
    };
  }, []);

  // ── Auth pages: render tanpa shell ──────────────────────────────────────────
  if (isAuthPage) {
    return <>{children}</>;
  }

  // ── Loading state saat restore session ──────────────────────────────────────
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg)",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: "var(--navy)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
            <rect x="10" y="1" width="7" height="3" rx="1" fill="white" opacity="0.5" />
            <rect x="10" y="6" width="7" height="2" rx="1" fill="white" opacity="0.3" />
            <rect x="1" y="10" width="16" height="7" rx="1.5" fill="white" opacity="0.6" />
          </svg>
        </div>
        <div
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: 11,
            color: "var(--slate2)",
            letterSpacing: "0.08em",
          }}
        >
          Memuat sesi…
        </div>
      </div>
    );
  }

  // ── Unauthenticated: render nothing (guard redirect berlaku) ─────────────────
  if (!user) return null;

  return (
    <main>
      <TopNav onOpenCommand={() => setOpenCommand(true)} />
      <div id="app">
        <StatusBar />
        {children}
      </div>
      <CommandPalette open={openCommand} onClose={() => setOpenCommand(false)} />
    </main>
  );
}