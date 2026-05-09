"use client";

import { useState } from "react";
import Link from "next/link";
import { Department, EmployeeStatus, Role } from "@/types/db-types/employee";
import { MOCK_EMPLOYEES } from "@/lib/mock/employee";

const statusMap: Record<EmployeeStatus, { cls: string; label: string }> = {
  active: { cls: "b-live", label: "Aktif" },
  inactive: { cls: "b-draft", label: "Nonaktif" },
  "on-leave": { cls: "b-review", label: "Cuti" },
};

const roleColors: Record<Role, { bg: string; color: string }> = {
  SuperAdmin: { bg: "var(--sapphire4)", color: "var(--sapphire)" },
  HR: { bg: "var(--emerald3)", color: "var(--emerald)" },
  Employee: { bg: "var(--line2)", color: "var(--slate)" },
};

const deptList: Array<Department | "Semua"> = [
  "Semua", "Engineering", "HR", "Finance", "Marketing", "Operations",
];

function fmtIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);
}

function StatsRow() {
  const active = MOCK_EMPLOYEES.filter((e) => e.status === "active").length;
  const onLeave = MOCK_EMPLOYEES.filter((e) => e.status === "on-leave").length;
  const inactive = MOCK_EMPLOYEES.filter((e) => e.status === "inactive").length;

  const stats = [
    { label: "Total Karyawan", value: "128", sub: `${MOCK_EMPLOYEES.length} sample aktif`, pip: "var(--sapphire)", up: true },
    { label: "Hadir Hari Ini", value: "112", sub: "87.5% tingkat kehadiran", pip: "var(--emerald2)", up: true },
    { label: "Sedang Cuti", value: String(onLeave), sub: "3 menunggu approval", pip: "var(--amber2)", up: false },
    { label: "Nonaktif", value: String(inactive), sub: "Perlu tindak lanjut", pip: "var(--ruby2)", up: false },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
      {stats.map((s, i) => (
        <div key={s.label} className="card" style={{ animationDelay: `${i * 0.06}s`, borderRadius: "var(--r2)" }}>
          <div className="card-inner" style={{ padding: "16px 18px" }}>
            <div className="ctitle" style={{ marginBottom: 8 }}>
              <div className="ctitle-pip" style={{ background: s.pip }} />
              {s.label}
            </div>
            <div className="metric-value" style={{ fontSize: 30, color: "var(--navy)" }}>{s.value}</div>
            <div className={`metric-trend ${s.up ? "t-up" : "t-dn"}`} style={{ marginTop: 8 }}>
              {s.up ? "↑" : "↓"} {s.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState<Department | "Semua">("Semua");
  const [activeStatus, setActiveStatus] = useState<EmployeeStatus | "all">("all");

  const filtered = MOCK_EMPLOYEES.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q);
    const matchDept = activeDept === "Semua" || e.department === activeDept;
    const matchStatus = activeStatus === "all" || e.status === activeStatus;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div id="content">
      {/* Header */}
      <div className="section-head">
        <div>
          <div className="section-title">Daftar <span>Karyawan</span></div>
          <div className="section-sub">
            128 karyawan terdaftar · Engineering, HR, Finance, Marketing, Operations
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <Link href="/employees/new" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Karyawan
          </Link>
        </div>
      </div>

      <StatsRow />

      {/* Table Card */}
      <div className="card" style={{ borderRadius: "var(--r3)", animation: "cardIn 0.45s ease forwards", animationDelay: "0.28s", opacity: 0 }}>
        <div className="card-inner" style={{ padding: 0, overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "0 0 240px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--slate2)" strokeWidth="2"
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input className="f-input" placeholder="Cari nama, email, jabatan, ID…"
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32, fontSize: 12 }} />
            </div>

            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {deptList.map((d) => (
                <button key={d} className="btn btn-xs" onClick={() => setActiveDept(d)}
                  style={{
                    background: activeDept === d ? "var(--navy)" : "var(--surface3)",
                    color: activeDept === d ? "#fff" : "var(--slate)",
                    border: "1px solid",
                    borderColor: activeDept === d ? "var(--navy)" : "var(--line)",
                    transition: "all 0.15s",
                  }}>
                  {d}
                </button>
              ))}
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {(["all", "active", "on-leave", "inactive"] as const).map((s) => (
                <button key={s} className="btn btn-xs" onClick={() => setActiveStatus(s)}
                  style={{
                    background: activeStatus === s ? "var(--sapphire4)" : "transparent",
                    color: activeStatus === s ? "var(--sapphire)" : "var(--slate2)",
                    border: "1px solid",
                    borderColor: activeStatus === s ? "rgba(26,86,219,0.2)" : "transparent",
                    transition: "all 0.15s",
                  }}>
                  {{ all: "Semua", active: "Aktif", "on-leave": "Cuti", inactive: "Nonaktif" }[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table className="m-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 20 }}>Karyawan</th>
                  <th>ID</th>
                  <th>Departemen</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Bergabung</th>
                  <th>Gaji Pokok</th>
                  <th style={{ paddingRight: 20, textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--slate2)", fontSize: 13 }}>
                      Tidak ada karyawan ditemukan
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => {
                    const st = statusMap[emp.status];
                    const rc = roleColors[emp.role];
                    const joinFmt = new Date(emp.joinDate).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    });
                    return (
                      <tr key={emp.id}>
                        <td style={{ paddingLeft: 20 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="team-av" style={{ background: emp.avatarBg, color: emp.avatarFc, width: 34, height: 34, borderRadius: 9, fontSize: 11, flexShrink: 0 }}>
                              {emp.initials}
                            </div>
                            <div>
                              <div className="pg-title" style={{ fontSize: 13 }}>{emp.name}</div>
                              <div className="pg-slug">{emp.position}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: '"Fira Code", monospace', fontSize: 10.5, color: "var(--slate2)", background: "var(--surface3)", padding: "2px 7px", borderRadius: 4 }}>
                            {emp.id}
                          </span>
                        </td>
                        <td style={{ fontSize: 12.5, color: "var(--ink3)" }}>{emp.department}</td>
                        <td>
                          <span className="badge" style={{ background: rc.bg, color: rc.color }}>{emp.role}</span>
                        </td>
                        <td>
                          <span className={`badge ${st.cls}`}><span className="bdot" />{st.label}</span>
                        </td>
                        <td style={{ fontFamily: '"Fira Code", monospace', fontSize: 11, color: "var(--slate2)" }}>
                          {joinFmt}
                        </td>
                        <td style={{ fontFamily: '"Fira Code", monospace', fontSize: 11.5, color: "var(--ink3)", fontWeight: 600 }}>
                          {fmtIDR(emp.salary)}
                        </td>
                        <td style={{ paddingRight: 20 }}>
                          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                            <Link href={`/employees/${emp.id}`} className="btn btn-ghost btn-xs btn-icon" title="Lihat Detail" style={{ textDecoration: "none" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                              </svg>
                            </Link>
                            <Link href={`/employees/${emp.id}/edit`} className="btn btn-ghost btn-xs btn-icon" title="Edit" style={{ textDecoration: "none" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" />
                              </svg>
                            </Link>
                            <button className="btn btn-danger btn-xs btn-icon" title="Nonaktifkan">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ padding: "9px 20px", borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: '"Fira Code", monospace', fontSize: 10, color: "var(--slate2)" }}>
              Menampilkan {filtered.length} dari 128 karyawan
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
    </div>
  );
}