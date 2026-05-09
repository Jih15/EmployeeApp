"use client";

interface Page {
  t: string;
  s: string;
  st: "live" | "draft" | "review";
  v: string;
  seo: number;
  u: string;
}

const pages: Page[] = [
  { t: "Home", s: "/", st: "live", v: "84.2k", seo: 92, u: "Today" },
  { t: "About Us", s: "/about", st: "live", v: "22.1k", seo: 88, u: "May 5" },
  { t: "Products", s: "/products", st: "live", v: "61.7k", seo: 79, u: "May 4" },
  { t: "Blog Index", s: "/blog", st: "live", v: "18.3k", seo: 84, u: "May 3" },
  { t: "Contact", s: "/contact", st: "draft", v: "—", seo: 55, u: "May 1" },
  { t: "Careers 2026", s: "/careers", st: "review", v: "9.4k", seo: 61, u: "Apr 28" },
];

const stMap: Record<string, string> = {
  live: "b-live",
  draft: "b-draft",
  review: "b-review",
};

function seoColor(s: number) {
  if (s >= 80) return "var(--emerald)";
  if (s >= 65) return "var(--amber2)";
  return "var(--ruby2)";
}

interface PagesTableProps {
  onNew?: () => void;
}

export default function PagesTable({ onNew }: PagesTableProps) {
  return (
    <div className="card s-8-4">
      <div className="card-inner" style={{ padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px 11px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--line)" }}>
          <div className="ctitle" style={{ marginBottom: 0, flex: 1 }}>
            <div className="ctitle-pip" style={{ background: "var(--navy)" }} />
            Published Pages
          </div>
          <input className="f-input" placeholder="Filter pages…" style={{ width: 150, padding: "6px 11px", fontSize: 11.5 }} />
          <button className="btn btn-outline btn-xs">Export</button>
          <button className="btn btn-primary btn-xs" onClick={onNew}>+ New</button>
        </div>

        {/* Table */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          <table className="m-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>Page Title</th>
                <th>Status</th>
                <th>Views</th>
                <th>SEO</th>
                <th>Updated</th>
                <th style={{ paddingRight: 20 }} />
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.s}>
                  <td style={{ paddingLeft: 20 }}>
                    <div className="pg-title">{p.t}</div>
                    <div className="pg-slug">{p.s}</div>
                  </td>
                  <td>
                    <span className={`badge ${stMap[p.st]}`}>
                      <span className="bdot" />
                      {p.st}
                    </span>
                  </td>
                  <td style={{ fontFamily: '"Fira Code", monospace', fontSize: 11.5, color: "var(--slate)" }}>{p.v}</td>
                  <td>
                    <span style={{ fontFamily: '"Fira Code", monospace', fontSize: 11.5, fontWeight: 600, color: seoColor(p.seo) }}>
                      {p.seo}
                    </span>
                  </td>
                  <td style={{ fontFamily: '"Fira Code", monospace', fontSize: 11, color: "var(--slate2)" }}>{p.u}</td>
                  <td style={{ paddingRight: 20 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-ghost btn-xs btn-icon" title="Edit">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" />
                        </svg>
                      </button>
                      <button className="btn btn-danger btn-xs btn-icon" title="Delete">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: "9px 20px", borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: '"Fira Code", monospace', fontSize: 10, color: "var(--slate2)" }}>
            Showing 6 of 347 pages
          </span>
          <div style={{ display: "flex", gap: 3 }}>
            <button className="btn btn-ghost btn-xs">‹</button>
            <button className="btn btn-xs" style={{ background: "var(--sapphire4)", color: "var(--sapphire)", border: "1px solid rgba(26,86,219,0.2)" }}>1</button>
            <button className="btn btn-ghost btn-xs">2</button>
            <button className="btn btn-ghost btn-xs">3</button>
            <button className="btn btn-ghost btn-xs">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}