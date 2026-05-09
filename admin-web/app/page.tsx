"use client";

import CommandPalette from "@/component/dashboard/CommandPalette";
import DashboardPage from "@/component/dashboard/DashboardPage";
import StatusBar from "@/component/dashboard/StatusBar";
import TopNav from "@/component/dashboard/TopNav";
import { useEffect, useState } from "react";



export default function Home() {
  const [openCommand, setOpenCommand] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenCommand(true);
      }
      if (e.key === "Escape") {
        setOpenCommand(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main>
      <TopNav onOpenCommand={() => setOpenCommand(true)} />

      <div id="app">
        <StatusBar
          onSync={() => console.log("sync")}
          onPublish={() => console.log("publish")}
        />
        <DashboardPage />
      </div>

      <CommandPalette open={openCommand} onClose={() => setOpenCommand(false)} />
    </main>
  );
}