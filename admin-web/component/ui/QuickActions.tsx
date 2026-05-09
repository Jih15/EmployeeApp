"use client";

interface QuickActionsProps {
  onPublish?: () => void;
  onDeleteAlert?: () => void;
}

export default function QuickActions({ onPublish, onDeleteAlert }: QuickActionsProps) {
  return (
    <div className="card s-3-3">
      <div className="card-inner" style={{ padding: 0 }}>
        <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--line)" }}>
          <div className="ctitle" style={{ marginBottom: 0, flex: 1 }}>
            <div className="ctitle-pip" style={{ background: "var(--amber2)" }} />
            Quick Actions
          </div>
        </div>
        <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "flex-start", gap: 10 }} onClick={onPublish}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Publish Page
          </button>
          <button className="btn btn-outline" style={{ width: "100%", justifyContent: "flex-start", gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" />
            </svg>
            Edit Draft
          </button>
          <button className="btn btn-sapphire" style={{ width: "100%", justifyContent: "flex-start", gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            SEO Audit
          </button>
          <button className="btn btn-success" style={{ width: "100%", justifyContent: "flex-start", gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
          <button className="btn btn-danger" style={{ width: "100%", justifyContent: "flex-start", gap: 10 }} onClick={onDeleteAlert}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
            Delete Selected
          </button>
          <button className="btn btn-amber" style={{ width: "100%", justifyContent: "flex-start", gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Schedule Post
          </button>
        </div>
      </div>
    </div>
  );
}