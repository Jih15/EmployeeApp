"use client";

import { useState, useEffect, useRef } from "react";

interface Command {
  icon: string;
  label: string;
  desc: string;
  short: string;
}

const cmds: Command[] = [
  { icon: "📄", label: "New Page", desc: "Create a blank page", short: "N" },
  { icon: "🚀", label: "Publish Now", desc: "Publish pending changes", short: "P" },
  { icon: "📊", label: "Analytics", desc: "View analytics dashboard", short: "A" },
  { icon: "🔍", label: "SEO Audit", desc: "Run a full SEO check", short: "S" },
  { icon: "👥", label: "Invite Member", desc: "Add a new team member", short: "I" },
  { icon: "📁", label: "Media Library", desc: "Browse uploaded media", short: "M" },
  { icon: "⚙️", label: "Settings", desc: "Open system settings", short: "" },
  { icon: "🗑️", label: "Trash", desc: "View deleted pages", short: "" },
  { icon: "📝", label: "Blog Posts", desc: "Manage blog content", short: "B" },
  { icon: "🔒", label: "Permissions", desc: "Manage roles & access", short: "" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

// Inner component — re-mounts fresh every time the palette opens,
// so useState initializers act as the "reset" with no side-effectful setState.
function CommandPaletteInner({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? cmds.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.desc.toLowerCase().includes(query.toLowerCase())
      )
    : cmds;

  // Focus input on mount — this is fine because it's a DOM side-effect, not setState
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, []);

  // Keyboard navigation — subscribes to external (DOM) events
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [filtered.length, onClose]);

  return (
    <div
      id="cmdoverlay"
      className="open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div id="cmdbox">
        <input
          ref={inputRef}
          id="cmdinput"
          placeholder="Search pages, actions, team…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIdx(0);
          }}
        />
        <div id="cmdresults" className="cmd-results">
          <div className="cmd-section-lbl">Suggested Actions</div>
          {filtered.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", fontSize: 13, color: "var(--slate2)" }}>
              No results found
            </div>
          ) : (
            filtered.map((item, i) => (
              <div
                key={item.label}
                className={`cmd-item${i === selectedIdx ? " sel" : ""}`}
                onClick={onClose}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <div className="cmd-item-icon">{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="cmd-item-label">{item.label}</div>
                  <div className="cmd-item-desc">{item.desc}</div>
                </div>
                {item.short && <div className="cmd-shortcut">⌘{item.short}</div>}
              </div>
            ))
          )}
        </div>
        <div className="cmd-footer">
          <span className="cmd-hint">
            <span className="kbd">↑↓</span> Navigate
          </span>
          <span className="cmd-hint">
            <span className="kbd">↵</span> Select
          </span>
          <span className="cmd-hint">
            <span className="kbd">ESC</span> Close
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: '"Fira Code", monospace',
              fontSize: 9.5,
              color: "var(--slate2)",
            }}
          >
            Meridian CMS
          </span>
        </div>
      </div>
    </div>
  );
}

// Outer shell — mounts/unmounts the inner component when open changes.
// This means state (query, selectedIdx) resets automatically on each open,
// with no need for a setState-in-effect.
export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) return null;
  return <CommandPaletteInner key="cmd-palette" onClose={onClose} />;
}