"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useState, useRef, useEffect } from "react";

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

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  hr: "HR",
  employee: "Employee",
};

function getInitials(email: string): string {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function TopNav({ onOpenCommand }: TopNavProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = user ? getInitials(user.email) : "??";
  const roleLabel = user ? (roleLabels[user.role] ?? user.role) : "";

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <style>{`
        .user-menu-wrap {
          position: relative;
        }

        .user-av {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--sapphire, #2563eb);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          transition: opacity 0.15s, box-shadow 0.15s;
          outline: none;
          border: none;
        }

        .user-av:hover {
          opacity: 0.85;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
        }

        .user-av[aria-expanded="true"] {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.28);
          opacity: 1;
        }

        /* Dropdown */
        .user-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 220px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          z-index: 9999;
          overflow: hidden;

          /* Animation */
          transform-origin: top right;
          animation: dropdown-in 0.18s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes dropdown-in {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(-6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .user-dropdown-info {
          padding: 14px 16px 12px;
        }

        .user-dropdown-divider {
          height: 1px;
          background: rgba(0,0,0,0.06);
          margin: 0;
        }

        .user-dropdown-menu {
          padding: 6px;
        }

        .user-dropdown-item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 8px 10px;
          border-radius: 7px;
          border: none;
          background: transparent;
          font-size: 12.5px;
          color: var(--navy, #0f172a);
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
          font-family: inherit;
        }

        .user-dropdown-item:hover {
          background: rgba(0,0,0,0.05);
        }

        .user-dropdown-item.danger {
          color: #dc2626;
        }

        .user-dropdown-item.danger:hover {
          background: rgba(220, 38, 38, 0.07);
        }

        .user-dropdown-item svg {
          flex-shrink: 0;
          opacity: 0.7;
        }

        .user-dropdown-item.danger svg {
          opacity: 0.85;
        }
      `}</style>

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

        {/* Nav Pills */}
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

          <div className="icon-btn" title="Notifikasi">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" strokeWidth="1.9">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <div className="notif-pip" />
          </div>

          {/* User Avatar + Dropdown */}
          <div className="user-menu-wrap" ref={dropdownRef}>
            <button
              className="user-av"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              title={`${user?.email} · ${roleLabel}`}
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className="user-dropdown" role="menu">
                {/* User info */}
                <div className="user-dropdown-info">
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--navy, #0f172a)" }}>
                    {user?.email}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Fira Code", monospace',
                      fontSize: 9.5,
                      color: user?.role === "super_admin" ? "var(--sapphire, #2563eb)" : "var(--emerald, #059669)",
                      marginTop: 3,
                    }}
                  >
                    {roleLabel}
                  </div>
                </div>

                <div className="user-dropdown-divider" />

                <div className="user-dropdown-menu">
                  {/* Profile */}
                  <Link
                    href="/settings/profile"
                    className="user-dropdown-item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    style={{ textDecoration: "none" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profil Saya
                  </Link>

                  {/* Change password */}
                  <Link
                    href="/settings/security"
                    className="user-dropdown-item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    style={{ textDecoration: "none" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Ganti Password
                  </Link>

                  <div className="user-dropdown-divider" style={{ margin: "6px 0" }} />

                  {/* Logout */}
                  <button
                    className="user-dropdown-item danger"
                    role="menuitem"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}