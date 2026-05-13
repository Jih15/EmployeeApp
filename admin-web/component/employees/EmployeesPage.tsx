"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Department, Employee, EmployeeStatus, Role } from "@/types/db-types/employee";
import { getEmployees } from "@/lib/api/employee";
import { useAuth } from "@/lib/context/AuthContext";
// import { MOCK_EMPLOYEES } from "@/lib/mock/employee";

const statusMap: Record<EmployeeStatus, { cls: string; label: string; dot: string }> = {
  active: { cls: "b-live", label: "Aktif", dot: "var(--emerald2)" },
  inactive: { cls: "b-draft", label: "Nonaktif", dot: "var(--slate3)" },
  "on-leave": { cls: "b-review", label: "Cuti", dot: "var(--amber2)" },
};

const roleColors: Record<Role, { bg: string; color: string }> = {
  super_admin: { bg: "var(--sapphire4)", color: "var(--sapphire)" },
  hr: { bg: "var(--emerald3)", color: "var(--emerald)" },
  employee: { bg: "var(--line2)", color: "var(--slate)" },
};

const deptList: Array<Department | "Semua"> = [
  "Semua",
  "Engineering",
  "HR",
  "Finance",
  "Marketing",
  "Operations",
];

function fmtIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDateShort(s: string) {
  return new Date(s).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Avatar({ bg, color, initials }: { bg: string; color: string; initials: string }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Fira Code", monospace',
        fontSize: 11,
        fontWeight: 700,
        flexShrink: 0,
        letterSpacing: "0.04em",
      }}
    >
      {initials}
    </div>
  );
}

function StatsRow({ employees }: {employees: Employee[]}) {
  const active = employees.filter((e) => e.status === "active").length;
  const onLeave = employees.filter((e) => e.status === "on-leave").length;
  const inactive = employees.filter((e) => e.status === "inactive").length;

  const stats = [
    {
      label: "Total Karyawan",
      value: "128",
      sub: `${employees.length} data tersedia`,
      pip: "var(--sapphire)",
      trend: "t-up",
      arrow: "↑",
    },
    {
      label: "Hadir Hari Ini",
      value: "112",
      sub: "87.5% tingkat kehadiran",
      pip: "var(--emerald2)",
      trend: "t-up",
      arrow: "↑",
    },
    {
      label: "Sedang Cuti",
      value: String(onLeave),
      sub: "3 menunggu approval",
      pip: "var(--amber2)",
      trend: "t-dn",
      arrow: "↓",
    },
    {
      label: "Nonaktif",
      value: String(inactive),
      sub: "Perlu tindak lanjut",
      pip: "var(--ruby2)",
      trend: "t-dn",
      arrow: "↓",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 12,
        marginBottom: 16,
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="card"
          style={{ animationDelay: `${i * 0.06}s`, borderRadius: "var(--r2)" }}
        >
          <div className="card-inner" style={{ padding: "16px 18px" }}>
            <div className="ctitle" style={{ marginBottom: 8 }}>
              <div className="ctitle-pip" style={{ background: s.pip }} />
              {s.label}
            </div>
            <div
              className="metric-value"
              style={{ fontSize: 30, color: "var(--navy)", letterSpacing: "-0.02em" }}
            >
              {s.value}
            </div>
            <div className={`metric-trend ${s.trend}`} style={{ marginTop: 8 }}>
              {s.arrow} {s.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EmployeesPage() {
  const { getToken } = useAuth();
  const [employees, setEmployee] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState<Department | "Semua">("Semua");
  const [activeStatus, setActiveStatus] = useState<EmployeeStatus | "all">("all");
  const [sortCol, setSortCol] = useState<"name" | "joinDate" | "salary" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getEmployees(token)
      .then(({ employees, total }) => {
        setEmployee(employees);
        setTotal(total);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSort(col: "name" | "joinDate" | "salary") {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  }

  const filtered = employees.filter((e) => {
    if (!e?.name || !e?.email) return false;
    const q = search.toLowerCase();
    const matchSearch =
      (e.name ?? "").toLowerCase().includes(q) ||
      (e.email ?? "").toLowerCase().includes(q) ||
      (e.id ?? "").toLowerCase().includes(q) ||
      (e.position ?? "").toLowerCase().includes(q);
    const matchDept = activeDept === "Semua" || e.department === activeDept;
    const matchStatus = activeStatus === "all" || e.status === activeStatus;
    return matchSearch && matchDept && matchStatus;
  })

  // plain function, not a component — avoids "created during render" error
  function sortIcon(col: "name" | "joinDate" | "salary") {
    const active = sortCol === col;
    return (
      <svg
        width="8"
        height="10"
        viewBox="0 0 8 10"
        fill="none"
        style={{ marginLeft: 4, opacity: active ? 1 : 0.3, flexShrink: 0 }}
      >
        <path d="M4 0L7 4H1L4 0Z" fill={active && sortDir === "asc" ? "var(--sapphire)" : "var(--slate2)"} />
        <path d="M4 10L1 6H7L4 10Z" fill={active && sortDir === "desc" ? "var(--sapphire)" : "var(--slate2)"} />
      </svg>
    );
  }

  return (
    <div id="content">
      {/* Header */}
      <div className="section-head">
        <div>
          <div className="section-title">
            Daftar <span>Karyawan</span>
          </div>
          <div className="section-sub">
            128 karyawan terdaftar · Engineering, HR, Finance, Marketing, Operations
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <Link
            href="/employees/new"
            className="btn btn-primary btn-sm"
            style={{ textDecoration: "none" }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Karyawan
          </Link>
        </div>
      </div>

      <StatsRow employees={employees} />

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
              padding: "12px 16px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              background: "var(--surface2)",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", flex: "0 0 220px" }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--slate2)"
                strokeWidth="2"
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="f-input"
                placeholder="Cari nama, email, jabatan…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 30, fontSize: 12, height: 34 }}
              />
            </div>

            {/* Dept Filter */}
            <div
              style={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                padding: "3px",
                background: "var(--surface3)",
                borderRadius: 8,
                border: "1px solid var(--line)",
              }}
            >
              {deptList.map((d) => (
                <button
                  key={d}
                  className="btn btn-xs"
                  onClick={() => setActiveDept(d)}
                  style={{
                    background: activeDept === d ? "var(--navy)" : "transparent",
                    color: activeDept === d ? "#fff" : "var(--slate)",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 10px",
                    transition: "all 0.15s",
                    fontWeight: activeDept === d ? 700 : 500,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
              {(
                [
                  { val: "all", label: "Semua" },
                  { val: "active", label: "Aktif" },
                  { val: "on-leave", label: "Cuti" },
                  { val: "inactive", label: "Nonaktif" },
                ] as const
              ).map((s) => (
                <button
                  key={s.val}
                  className="btn btn-xs"
                  onClick={() => setActiveStatus(s.val)}
                  style={{
                    background:
                      activeStatus === s.val ? "var(--sapphire4)" : "transparent",
                    color:
                      activeStatus === s.val ? "var(--sapphire)" : "var(--slate2)",
                    border: "1px solid",
                    borderColor:
                      activeStatus === s.val
                        ? "rgba(26,86,219,0.2)"
                        : "transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  <th
                    style={{
                      padding: "10px 16px 10px 20px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--slate2)",
                      borderBottom: "1px solid var(--line)",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => handleSort("name")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Karyawan
                      {sortIcon("name")}
                    </div>
                  </th>
                  {[
                    { label: "Departemen", key: null },
                    { label: "Role", key: null },
                    { label: "Status", key: null },
                    { label: "Bergabung", key: "joinDate" as const },
                    { label: "Gaji Pokok", key: "salary" as const },
                    { label: "Absensi", key: null },
                  ].map((col) => (
                    <th
                      key={col.label}
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--slate2)",
                        borderBottom: "1px solid var(--line)",
                        whiteSpace: "nowrap",
                        cursor: col.key ? "pointer" : "default",
                        userSelect: "none",
                      }}
                      onClick={() => col.key && handleSort(col.key)}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {col.label}
                        {col.key && sortIcon(col.key)}
                      </div>
                    </th>
                  ))}
                  <th
                    style={{
                      padding: "10px 20px 10px 12px",
                      textAlign: "right",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--slate2)",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "48px 20px",
                        color: "var(--slate2)",
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--slate)", marginBottom: 4 }}>
                        Tidak ada karyawan ditemukan
                      </div>
                      <div style={{ fontSize: 12, color: "var(--slate2)" }}>
                        Coba ubah filter atau kata kunci pencarian
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp, idx) => {
                    const st = statusMap[emp.status];
                    const rc = roleColors[emp.role];
                    const att = emp.attendanceSummary;
                    const attRate = Math.round((att.hadir / att.totalHari) * 100);
                    const attColor =
                      attRate >= 90
                        ? "var(--emerald)"
                        : attRate >= 75
                        ? "var(--amber2)"
                        : "var(--ruby2)";

                    return (
                      <tr
                        key={emp.employeeNumber}
                        style={{
                          borderBottom:
                            idx < filtered.length - 1
                              ? "1px solid var(--line2)"
                              : "none",
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            "var(--surface2)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            "transparent";
                        }}
                      >
                        {/* Karyawan */}
                        <td style={{ padding: "12px 16px 12px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Avatar
                              bg={emp.avatarBg}
                              color={emp.avatarFc}
                              initials={emp.initials}
                            />
                            <div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "var(--navy)",
                                  marginBottom: 2,
                                  lineHeight: 1,
                                }}
                              >
                                {emp.name}
                              </div>
                              <div
                                style={{
                                  fontFamily: '"Fira Code", monospace',
                                  fontSize: 10,
                                  color: "var(--slate2)",
                                }}
                              >
                                {emp.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Departemen */}
                        <td style={{ padding: "12px" }}>
                          <div style={{ fontSize: 12.5, color: "var(--ink3)" }}>
                            {emp.department}
                          </div>
                          <div
                            style={{
                              fontFamily: '"Fira Code", monospace',
                              fontSize: 10,
                              color: "var(--slate2)",
                              marginTop: 2,
                            }}
                          >
                            {emp.position}
                          </div>
                        </td>

                        {/* Role */}
                        <td style={{ padding: "12px" }}>
                          <span
                            className="badge"
                            style={{ background: rc.bg, color: rc.color }}
                          >
                            {emp.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "12px" }}>
                          <span className={`badge ${st.cls}`}>
                            <span className="bdot" />
                            {st.label}
                          </span>
                        </td>

                        {/* Bergabung */}
                        <td style={{ padding: "12px" }}>
                          <div
                            style={{
                              fontFamily: '"Fira Code", monospace',
                              fontSize: 11,
                              color: "var(--ink3)",
                            }}
                          >
                            {fmtDateShort(emp.joinDate)}
                          </div>
                          <div
                            style={{
                              fontFamily: '"Fira Code", monospace',
                              fontSize: 9.5,
                              color: "var(--slate2)",
                              marginTop: 2,
                            }}
                          >
                            {emp.employeeNumber}
                          </div>
                        </td>

                        {/* Gaji */}
                        <td style={{ padding: "12px" }}>
                          <div
                            style={{
                              fontFamily: '"Fira Code", monospace',
                              fontSize: 11.5,
                              fontWeight: 600,
                              color: "var(--ink2)",
                            }}
                          >
                            {fmtIDR(emp.salary)}
                          </div>
                        </td>

                        {/* Absensi mini-bar */}
                        <td style={{ padding: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                              minWidth: 80,
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  height: 4,
                                  borderRadius: 2,
                                  background: "var(--surface3)",
                                  overflow: "hidden",
                                  marginBottom: 4,
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${attRate}%`,
                                    background: attColor,
                                    borderRadius: 2,
                                    transition: "width 0.8s ease",
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  fontFamily: '"Fira Code", monospace',
                                  fontSize: 10,
                                  color: attColor,
                                  fontWeight: 600,
                                }}
                              >
                                {attRate}%{" "}
                                <span style={{ color: "var(--slate2)", fontWeight: 400 }}>
                                  hadir
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Aksi */}
                        <td style={{ padding: "12px 20px 12px 12px" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: 4,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Link
                              href={`/employees/${emp.id}`}
                              className="btn btn-ghost btn-xs btn-icon"
                              title="Lihat Detail"
                              style={{ textDecoration: "none" }}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </Link>
                            <Link
                              href={`/employees/${emp.id}/edit`}
                              className="btn btn-ghost btn-xs btn-icon"
                              title="Edit"
                              style={{ textDecoration: "none" }}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" />
                              </svg>
                            </Link>
                            <button
                              className="btn btn-danger btn-xs btn-icon"
                              title="Nonaktifkan"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
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

          {/* Footer */}
          <div
            style={{
              padding: "10px 20px",
              borderTop: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--surface2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 10.5,
                  color: "var(--slate2)",
                }}
              >
                Menampilkan{" "}
                <strong style={{ color: "var(--ink3)" }}>{filtered.length}</strong> dari{" "}
                <strong style={{ color: "var(--ink3)" }}>{total}</strong> karyawan
              </span>
              {search && (
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => setSearch("")}
                  style={{ fontSize: 10.5, color: "var(--slate2)" }}
                >
                  ✕ Reset
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <button className="btn btn-ghost btn-xs">‹ Prev</button>
              {[1, 2, 3, "…", 16].map((p, i) => (
                <button
                  key={i}
                  className="btn btn-xs"
                  style={{
                    background: p === 1 ? "var(--sapphire4)" : "transparent",
                    color: p === 1 ? "var(--sapphire)" : "var(--slate2)",
                    border: "1px solid",
                    borderColor: p === 1 ? "rgba(26,86,219,0.2)" : "transparent",
                    minWidth: 28,
                    cursor: p === "…" ? "default" : "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
              <button className="btn btn-ghost btn-xs">Next ›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}