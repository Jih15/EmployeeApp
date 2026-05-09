"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopNavProps {
  onOpenCommand: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/",
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
    label: "Employees",
    href: "/employees",
    count: "128",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Leave",
    href: "/leave",
    count: "7",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Payroll",
    href: "/payroll",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export default function TopNav({ onOpenCommand }: TopNavProps) {
  // usePathname() dari next/navigation — otomatis reactive saat route berubah
  const pathname = usePathname();

  // Cek apakah route aktif:
  // "/" hanya match exact, selain itu gunakan startsWith
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
          <div className="logo-sub">HR Portal · v1.0</div>
        </div>
        <div className="logo-divider" />
        <div style={{ fontSize: 11, color: "var(--slate2)", fontFamily: '"Fira Code", monospace' }}>
          pt-meridian.co.id
        </div>
      </div>

      {/* Nav Pills — setiap item adalah next/link */}
      <div className="nav-pills">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`pill${isActive(item.href) ? " active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            {item.icon}
            {item.label}
            {item.count && <span className="pill-count">{item.count}</span>}
          </Link>
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