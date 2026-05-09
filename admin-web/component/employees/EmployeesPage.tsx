"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Department = "Engineering" | "HR" | "Finance" | "Marketing" | "Operations";
type Role = "SuperAdmin" | "HR" | "Employee";
type EmployeeStatus = "active" | "inactive" | "on-leave";

interface Employee {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarFc: string;
  department: Department;
  role: Role;
  position: string;
  status: EmployeeStatus;
  joinDate: string;
  phone: string;
  email: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const employees: Employee[] = [
  {
    id: "EMP-001",
    name: "Arif Rahman",
    initials: "AR",
    avatarBg: "#dce9ff",
    avatarFc: "var(--sapphire)",
    department: "Engineering",
    role: "SuperAdmin",
    position: "CTO",
    status: "active",
    joinDate: "Jan 2022",
    phone: "+62 812-0001-0001",
    email: "arif@meridian.co.id",
  },
  {
    id: "EMP-002",
    name: "Dewi Sartika",
    initials: "DS",
    avatarBg: "#d1fae5",
    avatarFc: "var(--emerald)",
    department: "HR",
    role: "HR",
    position: "HR Manager",
    status: "active",
    joinDate: "Mar 2022",
    phone: "+62 812-0002-0002",
    email: "dewi@meridian.co.id",
  },
  {
    id: "EMP-003",
    name: "Budi Wahyono",
    initials: "BW",
    avatarBg: "#fef3c7",
    avatarFc: "var(--amber)",
    department: "Engineering",
    role: "Employee",
    position: "Backend Engineer",
    status: "active",
    joinDate: "Jun 2022",
    phone: "+62 812-0003-0003",
    email: "budi@meridian.co.id",
  },
  {
    id: "EMP-004",
    name: "Siti Marlina",
    initials: "SM",
    avatarBg: "#fee2e2",
    avatarFc: "var(--ruby)",
    department: "Marketing",
    role: "Employee",
    position: "SEO Specialist",
    status: "on-leave",
    joinDate: "Aug 2022",
    phone: "+62 812-0004-0004",
    email: "siti@meridian.co.id",
  },
  {
    id: "EMP-005",
    name: "Rizky Pratama",
    initials: "RP",
    avatarBg: "#ede9fe",
    avatarFc: "#7c3aed",
    department: "Finance",
    role: "Employee",
    position: "Finance Analyst",
    status: "active",
    joinDate: "Nov 2022",
    phone: "+62 812-0005-0005",
    email: "rizky@meridian.co.id",
  },
  {
    id: "EMP-006",
    name: "Ayu Lestari",
    initials: "AL",
    avatarBg: "#fce7f3",
    avatarFc: "#be185d",
    department: "Operations",
    role: "Employee",
    position: "Ops Coordinator",
    status: "inactive",
    joinDate: "Feb 2023",
    phone: "+62 812-0006-0006",
    email: "ayu@meridian.co.id",
  },
  {
    id: "EMP-007",
    name: "Hendro Santoso",
    initials: "HS",
    avatarBg: "#ecfdf5",
    avatarFc: "var(--emerald2)",
    department: "Engineering",
    role: "Employee",
    position: "Frontend Engineer",
    status: "active",
    joinDate: "Apr 2023",
    phone: "+62 812-0007-0007",
    email: "hendro@meridian.co.id",
  },
  {
    id: "EMP-008",
    name: "Rina Kusuma",
    initials: "RK",
    avatarBg: "#fff7ed",
    avatarFc: "#c2410c",
    department: "HR",
    role: "HR",
    position: "HR Generalist",
    status: "active",
    joinDate: "Jul 2023",
    phone: "+62 812-0008-0008",
    email: "rina@meridian.co.id",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
  "Semua",
  "Engineering",
  "HR",
  "Finance",
  "Marketing",
  "Operations",
];

// ─── Stats Cards ──────────────────────────────────────────────────────────────
function EmployeeStats() {
  const stats = [
    {
      label: "Total Karyawan",
      value: "128",
      sub: "+3 bulan ini",
      pip: "var(--sapphire)",
      up: true,
    },
    {
      label: "Hadir Hari Ini",
      value: "112",
      sub: "87.5% tingkat kehadiran",
      pip: "var(--emerald2)",
      up: true,
    },
    {
      label: "Sedang Cuti",
      value: "9",
      sub: "3 menunggu approval",
      pip: "var(--amber2)",
      up: false,
    },
    {
      label: "Karyawan Baru",
      value: "5",
      sub: "30 hari terakhir",
      pip: "var(--navy3)",
      up: true,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        marginBottom: 16,
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="card"
          style={{
            animationDelay: `${i * 0.06}s`,
            borderRadius: "var(--r2)",
          }}
        >
          <div className="card-inner" style={{ padding: "16px 18px" }}>
            <div className="ctitle" style={{ marginBottom: 8 }}>
              <div className="ctitle-pip" style={{ background: s.pip }} />
              {s.label}
            </div>
            <div
              className="metric-value"
              style={{ fontSize: 28, color: "var(--navy)" }}
            >
              {s.value}
            </div>
            <div
              className={`metric-trend ${s.up ? "t-up" : "t-dn"}`}
              style={{ marginTop: 8 }}
            >
              {s.up ? "↑" : "↓"} {s.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState<Department | "Semua">("Semua");
  const [activeStatus, setActiveStatus] = useState<EmployeeStatus | "all">("all");

  const filtered = employees.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = activeDept === "Semua" || e.department === activeDept;
    const matchStatus = activeStatus === "all" || e.status === activeStatus;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div id="content">
      {/* Section Header */}
      <div className="section-head">
        <div>
          <div className="section-title">
            Daftar <span>Karyawan</span>
          </div>
          <div className="section-sub">
            128 karyawan terdaftar · Divisi Engineering, HR, Finance, Marketing, Operations
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
          <button className="btn btn-primary btn-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Karyawan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <EmployeeStats />

      {/* Table Card */}
      <div
        className="card"
        style={{
          borderRadius: "var(--r3)",
          animation: "cardIn 0.45s ease forwards",
          animationDelay: "0.28s",
          opacity: 0,
        }}
      >
        <div className="card-inner" style={{ padding: 0, overflow: "hidden" }}>
          {/* Toolbar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", flex: "0 0 220px" }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--slate2)"
                strokeWidth="2"
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="f-input"
                placeholder="Cari nama, email, ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32, fontSize: 12 }}
              />
            </div>

            {/* Department filter */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {deptList.map((d) => (
                <button
                  key={d}
                  className="btn btn-xs"
                  style={{
                    background: activeDept === d ? "var(--navy)" : "var(--surface3)",
                    color: activeDept === d ? "#fff" : "var(--slate)",
                    border: "1px solid",
                    borderColor: activeDept === d ? "var(--navy)" : "var(--line)",
                    transition: "all 0.15s",
                  }}
                  onClick={() => setActiveDept(d)}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {(["all", "active", "on-leave", "inactive"] as const).map((s) => (
                <button
                  key={s}
                  className="btn btn-xs"
                  style={{
                    background: activeStatus === s ? "var(--sapphire4)" : "transparent",
                    color: activeStatus === s ? "var(--sapphire)" : "var(--slate2)",
                    border: "1px solid",
                    borderColor: activeStatus === s ? "rgba(26,86,219,0.2)" : "transparent",
                    transition: "all 0.15s",
                  }}
                  onClick={() => setActiveStatus(s)}
                >
                  {s === "all" ? "Semua" : s === "active" ? "Aktif" : s === "on-leave" ? "Cuti" : "Nonaktif"}
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
                  <th>Kontak</th>
                  <th style={{ paddingRight: 20 }} />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ textAlign: "center", padding: "32px", color: "var(--slate2)", fontSize: 13 }}
                    >
                      Tidak ada karyawan ditemukan
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => {
                    const st = statusMap[emp.status];
                    const rc = roleColors[emp.role];
                    return (
                      <tr key={emp.id}>
                        {/* Karyawan */}
                        <td style={{ paddingLeft: 20 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              className="team-av"
                              style={{
                                background: emp.avatarBg,
                                color: emp.avatarFc,
                                width: 34,
                                height: 34,
                                borderRadius: 9,
                                fontSize: 11,
                              }}
                            >
                              {emp.initials}
                            </div>
                            <div>
                              <div className="pg-title" style={{ fontSize: 13 }}>
                                {emp.name}
                              </div>
                              <div className="pg-slug">{emp.position}</div>
                            </div>
                          </div>
                        </td>

                        {/* ID */}
                        <td>
                          <span
                            style={{
                              fontFamily: '"Fira Code", monospace',
                              fontSize: 10.5,
                              color: "var(--slate2)",
                              background: "var(--surface3)",
                              padding: "2px 7px",
                              borderRadius: 4,
                            }}
                          >
                            {emp.id}
                          </span>
                        </td>

                        {/* Dept */}
                        <td style={{ fontSize: 12.5, color: "var(--ink3)" }}>
                          {emp.department}
                        </td>

                        {/* Role */}
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: rc.bg,
                              color: rc.color,
                              border: "none",
                            }}
                          >
                            {emp.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`badge ${st.cls}`}>
                            <span className="bdot" />
                            {st.label}
                          </span>
                        </td>

                        {/* Join Date */}
                        <td
                          style={{
                            fontFamily: '"Fira Code", monospace',
                            fontSize: 11,
                            color: "var(--slate2)",
                          }}
                        >
                          {emp.joinDate}
                        </td>

                        {/* Kontak */}
                        <td
                          style={{
                            fontFamily: '"Fira Code", monospace',
                            fontSize: 10.5,
                            color: "var(--slate)",
                          }}
                        >
                          {emp.phone}
                        </td>

                        {/* Actions */}
                        <td style={{ paddingRight: 20 }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button className="btn btn-ghost btn-xs btn-icon" title="Lihat Detail">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                            <button className="btn btn-ghost btn-xs btn-icon" title="Edit">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" />
                              </svg>
                            </button>
                            <button className="btn btn-danger btn-xs btn-icon" title="Nonaktifkan">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
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
          <div
            style={{
              padding: "9px 20px",
              borderTop: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 10,
                color: "var(--slate2)",
              }}
            >
              Menampilkan {filtered.length} dari 128 karyawan
            </span>
            <div style={{ display: "flex", gap: 3 }}>
              <button className="btn btn-ghost btn-xs">‹</button>
              <button
                className="btn btn-xs"
                style={{
                  background: "var(--sapphire4)",
                  color: "var(--sapphire)",
                  border: "1px solid rgba(26,86,219,0.2)",
                }}
              >
                1
              </button>
              <button className="btn btn-ghost btn-xs">2</button>
              <button className="btn btn-ghost btn-xs">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}