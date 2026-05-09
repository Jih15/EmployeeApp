"use client";

// ── MetricCard ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  pipColor: string;
  title: string;
  value: string | number;
  label: string;
  trend: string;
  trendUp: boolean;
  isHero?: boolean;
  sparkline?: React.ReactNode;
}

export function MetricCard({
  pipColor,
  title,
  value,
  label,
  trend,
  trendUp,
  isHero,
  sparkline,
}: MetricCardProps) {
  const trendCls = isHero
    ? trendUp
      ? "metric-trend t-up-inv"
      : "metric-trend t-dn-inv"
    : trendUp
    ? "metric-trend t-up"
    : "metric-trend t-dn";

  return (
    <div className={`card s-3-2${isHero ? " card-hero" : ""}`}>
      <div className="card-inner">
        <div className="ctitle">
          <div className="ctitle-pip" style={{ background: pipColor }} />
          {title}
        </div>
        <div
          className="metric-value"
          style={{ color: isHero ? "#fff" : "var(--navy)" }}
        >
          {value}
        </div>
        <div
          className="metric-label"
          style={isHero ? { color: "rgba(255,255,255,0.45)" } : undefined}
        >
          {label}
        </div>
        <div className={trendCls} style={{ marginTop: 10 }}>
          {trendUp ? "↑" : "↓"} {trend}
        </div>
      </div>
      {sparkline && <div className="sparkline-abs">{sparkline}</div>}
    </div>
  );
}

// ── TrafficChart ─────────────────────────────────────────────────────────────
const barData = [
  { d: "Mon", v: 3200, u: 1800 },
  { d: "Tue", v: 4100, u: 2300 },
  { d: "Wed", v: 3700, u: 2100 },
  { d: "Thu", v: 5200, u: 3100 },
  { d: "Fri", v: 4800, u: 2700 },
  { d: "Sat", v: 2900, u: 1600 },
  { d: "Sun", v: 3500, u: 1900 },
];
const mx = Math.max(...barData.map((d) => d.v));

export function TrafficChart() {
  return (
    <div className="card s-6-3">
      <div className="card-inner">
        <div className="ctitle" style={{ marginBottom: 8 }}>
          <div className="ctitle-pip" style={{ background: "var(--sapphire)" }} />
          Traffic · Last 7 Days
          <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
            {[
              { color: "var(--navy)", label: "Views" },
              { color: "var(--sapphire3)", label: "Visitors" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: '"Fira Code", monospace', fontSize: 9.5, color: "var(--slate2)" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="chart-bars">
          {barData.map((d, i) => (
            <div className="cbar-col" key={d.d}>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 2, width: "100%" }}>
                <div
                  className="cbar"
                  style={{
                    flex: 1,
                    height: `${Math.round((d.v / mx) * 100)}%`,
                    background: "var(--navy)",
                    opacity: i === 3 ? 1 : 0.6,
                  }}
                  title={`${d.d}: ${d.v.toLocaleString()} views`}
                />
                <div
                  className="cbar"
                  style={{
                    flex: 1,
                    height: `${Math.round((d.u / mx) * 100)}%`,
                    background: "var(--sapphire3)",
                    opacity: i === 3 ? 1 : 0.6,
                  }}
                  title={`${d.d}: ${d.u.toLocaleString()} visitors`}
                />
              </div>
              <div className="cbar-lbl">{d.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TrafficSources (Donut) ───────────────────────────────────────────────────
const sources = [
  { label: "Organic Search", pct: "40%", color: "var(--navy)", dasharray: "110.6 165.7", dashoffset: "0" },
  { label: "Direct", pct: "26%", color: "var(--sapphire2)", dasharray: "66.3 210", dashoffset: "-110.6" },
  { label: "Social", pct: "19%", color: "var(--sapphire3)", dasharray: "49.7 226.6", dashoffset: "-176.9" },
  { label: "Referral", pct: "15%", color: "var(--slate3)", dasharray: "49.4 226.9", dashoffset: "-226.6" },
];

export function TrafficSources() {
  return (
    <div className="card s-3-3">
      <div className="card-inner">
        <div className="ctitle">
          <div className="ctitle-pip" style={{ background: "var(--sapphire3)" }} />
          Traffic Sources
        </div>
        <svg viewBox="0 0 120 120" width="110" height="110" style={{ alignSelf: "center", margin: "-4px 0 8px" }}>
          <circle cx="60" cy="60" r="44" fill="none" stroke="var(--surface3)" strokeWidth="13" />
          {sources.map((s) => (
            <circle
              key={s.label}
              cx="60" cy="60" r="44"
              fill="none"
              stroke={s.color}
              strokeWidth="13"
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
              strokeLinecap="round"
            />
          ))}
          <text x="60" y="55" textAnchor="middle" className="ring-center-label">40%</text>
          <text x="60" y="68" textAnchor="middle" className="ring-center-sub">Organic</text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sources.map((s) => (
            <div key={s.label} className="legend-row">
              <div className="leg-swatch" style={{ background: s.color }} />
              {s.label}
              <span className="leg-val">{s.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SEOGrid ──────────────────────────────────────────────────────────────────
const seoItems = [
  { l: "Overall SEO", v: 84, c: "var(--sapphire)" },
  { l: "Page Speed", v: 91, c: "var(--emerald)" },
  { l: "Mobile Score", v: 78, c: "var(--amber2)" },
  { l: "Core Vitals", v: 89, c: "var(--emerald2)" },
  { l: "Struct. Data", v: 67, c: "var(--ruby2)" },
  { l: "Accessibility", v: 95, c: "var(--sapphire2)" },
];

export function SEOGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {seoItems.map((s) => (
        <div key={s.l}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: "var(--slate)" }}>{s.l}</span>
            <span style={{ fontFamily: '"Fira Code", monospace', fontSize: 11, fontWeight: 600, color: s.c }}>{s.v}</span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${s.v}%`, background: s.c }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── ActivityFeed ─────────────────────────────────────────────────────────────
const acts = [
  { n: "Arif R.", a: "Published homepage", t: "2m", bg: "#dce9ff", fc: "var(--sapphire)" },
  { n: "Dewi S.", a: "Uploaded 8 media files", t: "14m", bg: "#d1fae5", fc: "var(--emerald)" },
  { n: "Budi W.", a: "Created /contact-2026", t: "1h", bg: "#fef3c7", fc: "var(--amber)" },
  { n: "Siti M.", a: "Updated SEO for /about", t: "2h", bg: "#fee2e2", fc: "var(--ruby)" },
  { n: "Arif R.", a: "Invited new team member", t: "3h", bg: "#dce9ff", fc: "var(--sapphire)" },
];

export function ActivityFeed() {
  return (
    <div>
      {acts.map((a, i) => {
        const initials = a.n.split(" ").map((x) => x[0]).join("");
        return (
          <div key={i} className="act-row">
            <div className="act-icon" style={{ background: a.bg }}>
              <span style={{ fontFamily: '"Fira Code", monospace', fontSize: 9, fontWeight: 700, color: a.fc }}>
                {initials}
              </span>
            </div>
            <div>
              <div className="act-msg">
                <strong style={{ color: "var(--navy)" }}>{a.n}</strong> {a.a}
              </div>
              <div className="act-time">{a.t} ago</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── TeamList ─────────────────────────────────────────────────────────────────
const team = [
  { n: "Arif Rahman", r: "Super Admin", i: "AR", bg: "#dce9ff", fc: "var(--sapphire)", pip: "var(--emerald2)" },
  { n: "Dewi Sartika", r: "Content Editor", i: "DS", bg: "#d1fae5", fc: "var(--emerald)", pip: "var(--emerald2)" },
  { n: "Budi Wahyono", r: "Developer", i: "BW", bg: "#fef3c7", fc: "var(--amber)", pip: "var(--amber2)" },
  { n: "Siti Marlina", r: "SEO Specialist", i: "SM", bg: "#fee2e2", fc: "var(--ruby)", pip: "var(--slate3)" },
];

export function TeamList() {
  return (
    <div id="team-list">
      {team.map((m) => (
        <div key={m.n} className="team-row">
          <div className="team-av" style={{ background: m.bg, color: m.fc }}>{m.i}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="team-name">{m.n}</div>
            <div className="team-role">{m.r}</div>
          </div>
          <div className="status-pip" style={{ background: m.pip }} />
          <button className="btn btn-ghost btn-xs">Manage</button>
        </div>
      ))}
    </div>
  );
}