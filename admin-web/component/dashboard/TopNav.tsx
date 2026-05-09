"use client";

import { useState } from "react";

interface TopNavProps {
  onOpenCommand: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 5-5" />
      </svg>
    ),
  },
  {
    label: "Pages",
    count: "347",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    label: "Media",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    label: "Team",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export default function TopNav({ onOpenCommand }: TopNavProps) {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <nav id="topnav">
      {/* Logo */}
      <div className="logo-wrap">
        <div className="logo-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
            <rect x="10" y="1" width="7" height="3" rx="1" fill="white" opacity="0.5" />
            <rect x="10" y="6" width="7" height="2" rx="1" fill="white" opacity="0.3" />
            <rect x="1" y="10" width="16" height="7" rx="1.5" fill="white" opacity="0.6" />
          </svg>
        </div>
        <div>
          <div className="logo-name">Meridian</div>
          <div className="logo-sub">CMS Platform · v3.1</div>
        </div>
        <div className="logo-divider" />
        <div style={{ fontSize: 11, color: "var(--slate2)", fontFamily: '"Fira Code", monospace' }}>
          meridian.co
        </div>
      </div>

      {/* Nav Pills */}
      <div className="nav-pills">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`pill${activeNav === item.label ? " active" : ""}`}
            onClick={() => setActiveNav(item.label)}
          >
            {item.icon}
            {item.label}
            {item.count && <span className="pill-count">{item.count}</span>}
          </div>
        ))}
      </div>

      {/* Nav Right */}
      <div className="nav-right">
        <button className="cmd-btn" onClick={onOpenCommand}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Search or jump…
          <span className="kbd-tag">⌘K</span>
        </button>
        <div className="icon-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" strokeWidth="1.9">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <div className="notif-pip" />
        </div>
        <div className="user-av">AR</div>
      </div>
    </nav>
  );
}