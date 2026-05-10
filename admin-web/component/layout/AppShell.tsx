"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TopNav from "@/component/layout/TopNav";
import StatusBar from "@/component/layout/StatusBar";
import CommandPalette from "@/component/layout/CommandPalette";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [openCommand, setOpenCommand] = useState(false);

  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    // ── Keyboard shortcut: ⌘K / Ctrl+K ──
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenCommand(true);
      }
      if (e.key === "Escape") setOpenCommand(false);
    };

    // ── Custom event dari DashboardPage (dan halaman lain) ──
    const handleOpenCommand = () => setOpenCommand(true);

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("meridian:openCommand", handleOpenCommand);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("meridian:openCommand", handleOpenCommand);
    };
  }, []);

  if (isAuthPage) {
    return <>{children}</>;
  }

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