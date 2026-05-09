"use client";

interface StatusBarProps {
  onSync?: () => void;
  onPublish?: () => void;
}

export default function StatusBar({ onSync, onPublish }: StatusBarProps) {
  return (
    <div id="statusbar">
      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
        <div className="stat-item">
          <div className="stat-dot" style={{ background: "#4ade80", boxShadow: "0 0 5px #4ade80" }} />
          All systems operational
        </div>
        <div className="stat-sep" />
        <div className="stat-item">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Last deploy: 14 min ago
        </div>
        <div className="stat-sep" />
        <div className="stat-item">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          284,912 views this week
        </div>
      </div>
      <div className="stat-right">
        <button className="btn-navy btn-navy-outline btn-sm" onClick={onSync}>
          ↺ Sync Data
        </button>
        <button className="btn-navy btn-navy-white btn-sm" onClick={onPublish}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Quick Publish
        </button>
      </div>
    </div>
  );
}