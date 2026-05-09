"use client";

interface CreatePageFormProps {
  onSuccess?: () => void;
}

export default function CreatePageForm({ onSuccess }: CreatePageFormProps) {
  return (
    <div className="card s-5-4">
      <div className="card-inner">
        <div className="ctitle" style={{ marginBottom: 14 }}>
          <div className="ctitle-pip" style={{ background: "var(--sapphire)" }} />
          Create New Page
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <div>
            <label className="f-label">Page Title *</label>
            <input className="f-input" placeholder="e.g. Our Services 2026" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label className="f-label">Template</label>
              <select className="f-input f-select">
                <option>Default</option>
                <option>Landing Page</option>
                <option>Blog</option>
                <option>Contact</option>
              </select>
            </div>
            <div>
              <label className="f-label">Status</label>
              <select className="f-input f-select">
                <option>Draft</option>
                <option>Published</option>
                <option>Scheduled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="f-label">URL Slug</label>
            <div style={{ display: "flex" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  background: "var(--surface3)",
                  border: "1px solid var(--line)",
                  borderRight: "none",
                  borderRadius: "8px 0 0 8px",
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 11,
                  color: "var(--slate2)",
                  whiteSpace: "nowrap",
                }}
              >
                /pages/
              </span>
              <input
                className="f-input"
                placeholder="our-services"
                style={{ borderRadius: "0 8px 8px 0", borderLeft: "none" }}
              />
            </div>
          </div>
          <div>
            <label className="f-label">SEO Description</label>
            <textarea
              className="f-input"
              rows={2}
              placeholder="Short description for search engines…"
              style={{ resize: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={onSuccess}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Page
            </button>
            <button className="btn btn-outline">Discard</button>
          </div>
        </div>
      </div>
    </div>
  );
}