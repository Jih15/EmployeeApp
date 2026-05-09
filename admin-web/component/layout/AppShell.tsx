"use client";

import { useEffect, useState } from "react";
import TopNav from "@/component/layout/TopNav";
import StatusBar from "@/component/layout/StatusBar";
import CommandPalette from "@/component/layout/CommandPalette";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [openCommand, setOpenCommand] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenCommand(true);
      }
      if (e.key === "Escape") setOpenCommand(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main>
      <TopNav onOpenCommand={() => setOpenCommand(true)} />
      <div id="app">
        <StatusBar />
        {/* #content wrapping dilakukan di masing-masing page */}
        {children}
      </div>
      <CommandPalette open={openCommand} onClose={() => setOpenCommand(false)} />
    </main>
  );
}