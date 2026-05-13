"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Employee, DocumentStatus, EmployeeStatus, EmployeeAccount, EmployeeBackend } from "@/types/db-types/employee";
import { useAuth } from "@/lib/context/AuthContext";
import { getEmployeeAccount, getEmployeeById, mapToEmployee } from "@/lib/api/employee";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const NOW = Date.now();

function fmtIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const statusMap: Record<EmployeeStatus, { cls: string; label: string }> = {
  active: { cls: "b-live", label: "Aktif" },
  inactive: { cls: "b-draft", label: "Nonaktif" },
  "on-leave": { cls: "b-review", label: "Cuti" },
};

const docStatusMap: Record<DocumentStatus, { cls: string; label: string }> = {
  verified: { cls: "b-live", label: "Terverifikasi" },
  pending: { cls: "b-review", label: "Menunggu" },
  expired: { cls: "b-error", label: "Kadaluarsa" },
  missing: { cls: "b-draft", label: "Belum Ada" },
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ emp }: { emp: Employee }) {
  const st = statusMap[emp.status];
  const verifiedDocs = emp.documents.filter((d) => d.status === "verified").length;
  const docPct = Math.round((verifiedDocs / emp.documents.length) * 100);

  return (
    <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Avatar card */}
      <div className="card" style={{ borderRadius: "var(--r2)" }}>
        <div className="card-inner" style={{ alignItems: "center", padding: "22px 20px" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: emp.avatarBg,
              color: emp.avatarFc,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: '"Fira Code", monospace',
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 12,
              boxShadow: "0 4px 14px rgba(15,23,42,0.1)",
            }}
          >
            {emp.initials}
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 16,
                fontWeight: 700,
                color: "var(--navy)",
                marginBottom: 3,
              }}
            >
              {emp.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--slate2)", marginBottom: 10 }}>
              {emp.position}
            </div>
            <span className={`badge ${st.cls}`}>
              <span className="bdot" />
              {st.label}
            </span>
          </div>
        </div>
      </div>

      {/* Quick info */}
      <div className="card" style={{ borderRadius: "var(--r2)" }}>
        <div className="card-inner" style={{ padding: "14px 16px", gap: 0 }}>
          <div className="ctitle" style={{ marginBottom: 12 }}>
            <div className="ctitle-pip" style={{ background: "var(--sapphire)" }} />
            Informasi
          </div>
          {[
            { label: "ID Karyawan", val: emp.employeeNumber, mono: true },
            { label: "NIK", val: emp.nik, mono: true },
            { label: "Departemen", val: emp.department },
            { label: "Email", val: emp.email, mono: true, small: true },
            { label: "Telepon", val: emp.phone, mono: true },
            { label: "Bergabung", val: fmtDate(emp.joinDate) },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                paddingBottom: 9,
                marginBottom: 9,
                borderBottom: "1px solid var(--line2)",
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--slate2)",
                  marginBottom: 2,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: item.small ? 10.5 : 12,
                  color: "var(--ink2)",
                  fontFamily: item.mono ? '"Fira Code", monospace' : undefined,
                  wordBreak: "break-all",
                }}
              >
                {item.val}
              </div>
            </div>
          ))}
          <div>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--slate2)",
                marginBottom: 6,
              }}
            >
              Kelengkapan Dokumen
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: 11, color: "var(--ink3)" }}>
                {verifiedDocs}/{emp.documents.length} dokumen
              </span>
              <span
                style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 11,
                  fontWeight: 600,
                  color: docPct >= 80 ? "var(--emerald)" : "var(--amber2)",
                }}
              >
                {docPct}%
              </span>
            </div>
            <div className="prog-track">
              <div
                className="prog-fill"
                style={{
                  width: `${docPct}%`,
                  background: docPct >= 80 ? "var(--emerald2)" : "var(--amber2)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Kontak darurat */}
      <div className="card" style={{ borderRadius: "var(--r2)" }}>
        <div className="card-inner" style={{ padding: "14px 16px" }}>
          <div className="ctitle" style={{ marginBottom: 10 }}>
            <div className="ctitle-pip" style={{ background: "var(--ruby2)" }} />
            Kontak Darurat
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 2 }}>
            {emp.emergencyContact.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--slate2)", marginBottom: 6 }}>
            {emp.emergencyContact.relation}
          </div>
          <div style={{ fontFamily: '"Fira Code", monospace', fontSize: 11.5, color: "var(--ink3)" }}>
            {emp.emergencyContact.phone}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ borderRadius: "var(--r2)" }}>
        <div className="card-inner" style={{ padding: "14px 16px", gap: 7 }}>
          <Link
            href={`/employees/${emp.id}/edit`}
            className="btn btn-primary"
            style={{ width: "100%", textDecoration: "none", justifyContent: "center" }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" />
            </svg>
            Edit Data
          </Link>
          <button className="btn btn-success" style={{ width: "100%" }}>
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
            Export PDF
          </button>
          <button className="btn btn-danger" style={{ width: "100%" }}>
            Nonaktifkan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Profil Pribadi ──────────────────────────────────────────────────────
function TabProfil({ emp }: { emp: Employee }) {
  const fields = [
    { label: "Nama Lengkap", val: emp.name },
    { label: "NIK", val: emp.nik, mono: true },
    { label: "Tempat Lahir", val: emp.birthPlace },
    { label: "Tanggal Lahir", val: fmtDate(emp.birthDate) },
    { label: "Jenis Kelamin", val: emp.gender },
    { label: "Alamat", val: emp.address },
    { label: "No. Telepon", val: emp.phone, mono: true },
    { label: "Email", val: emp.email, mono: true },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {fields.map((f) => (
          <div key={f.label} style={f.label === "Alamat" ? { gridColumn: "span 2" } : {}}>
            <label className="f-label">{f.label}</label>
            <div
              style={{
                padding: "9px 12px",
                background: "var(--surface2)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                fontSize: 12.5,
                color: "var(--ink)",
                fontFamily: f.mono ? '"Fira Code", monospace' : undefined,
              }}
            >
              {f.val}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--ruby3)",
          borderRadius: "var(--r)",
          padding: "14px 16px",
          border: "1px solid rgba(185,28,28,0.15)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--ruby)",
            marginBottom: 10,
          }}
        >
          Kontak Darurat
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "Nama", val: emp.emergencyContact.name },
            { label: "Hubungan", val: emp.emergencyContact.relation },
            { label: "Telepon", val: emp.emergencyContact.phone, mono: true },
          ].map((f) => (
            <div key={f.label}>
              <div style={{ fontSize: 10, color: "var(--ruby)", marginBottom: 3 }}>{f.label}</div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--ink2)",
                  fontFamily: f.mono ? '"Fira Code", monospace' : undefined,
                }}
              >
                {f.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Pekerjaan ───────────────────────────────────────────────────────────
function TabPekerjaan({ emp }: { emp: Employee }) {
  const fields = [
    { label: "ID Karyawan", val: emp.id, mono: true },
    { label: "Departemen", val: emp.department },
    { label: "Jabatan", val: emp.position },
    { label: "Role Sistem", val: emp.role },
    { label: "Tanggal Bergabung", val: fmtDate(emp.joinDate) },
    { label: "Status", val: statusMap[emp.status].label },
    { label: "Gaji Pokok", val: fmtIDR(emp.salary), mono: true },
    {
      label: "Lama Bekerja",
      val: (() => {
        const diff = NOW - new Date(emp.joinDate).getTime();
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        const y = Math.floor(months / 12);
        const m = months % 12;
        return `${y > 0 ? `${y} tahun ` : ""}${m} bulan`;
      })(),
    },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {fields.map((f) => (
          <div key={f.label}>
            <label className="f-label">{f.label}</label>
            <div
              style={{
                padding: "9px 12px",
                background: f.label === "Gaji Pokok" ? "var(--emerald3)" : "var(--surface2)",
                border: "1px solid",
                borderColor:
                  f.label === "Gaji Pokok" ? "rgba(13,124,82,0.2)" : "var(--line)",
                borderRadius: 8,
                fontSize: 12.5,
                color: f.label === "Gaji Pokok" ? "var(--emerald)" : "var(--ink)",
                fontFamily: f.mono ? '"Fira Code", monospace' : undefined,
                fontWeight: f.label === "Gaji Pokok" ? 700 : undefined,
              }}
            >
              {f.val}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--surface2)",
          borderRadius: "var(--r)",
          padding: "14px 16px",
          border: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--slate)",
            marginBottom: 12,
          }}
        >
          Ringkasan Absensi · {emp.attendanceSummary.month}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {[
            {
              label: "Hadir",
              val: emp.attendanceSummary.hadir,
              color: "var(--emerald)",
              bg: "var(--emerald3)",
            },
            {
              label: "Telat",
              val: emp.attendanceSummary.telat,
              color: "var(--amber)",
              bg: "var(--amber3)",
            },
            {
              label: "Izin",
              val: emp.attendanceSummary.izin,
              color: "var(--sapphire)",
              bg: "var(--sapphire4)",
            },
            { label: "Cuti", val: emp.attendanceSummary.cuti, color: "#7c3aed", bg: "#ede9fe" },
            {
              label: "Alpha",
              val: emp.attendanceSummary.alpha,
              color: "var(--ruby)",
              bg: "var(--ruby3)",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: item.bg,
                borderRadius: 8,
                padding: "10px 12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 22,
                  fontWeight: 700,
                  color: item.color,
                }}
              >
                {item.val}
              </div>
              <div style={{ fontSize: 11, color: item.color, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: '"Fira Code", monospace',
            fontSize: 10,
            color: "var(--slate2)",
          }}
        >
          Total hari kerja: {emp.attendanceSummary.totalHari} hari · Tingkat kehadiran:{" "}
          {Math.round(
            (emp.attendanceSummary.hadir / emp.attendanceSummary.totalHari) * 100
          )}
          %
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Dokumen ─────────────────────────────────────────────────────────────
function TabDokumen({ emp }: { emp: Employee }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 12, color: "var(--slate2)" }}>
          {emp.documents.filter((d) => d.status === "verified").length} dari{" "}
          {emp.documents.length} dokumen terverifikasi
        </div>
        <button className="btn btn-primary btn-sm">
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
          Upload Dokumen
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {emp.documents.map((doc) => {
          const ds = docStatusMap[doc.status];
          return (
            <div
              key={doc.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                background: "var(--surface2)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r)",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  flexShrink: 0,
                  background: doc.status === "missing" ? "var(--line)" : "var(--sapphire4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={doc.status === "missing" ? "var(--slate3)" : "var(--sapphire)"}
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--navy)",
                    marginBottom: 2,
                  }}
                >
                  {doc.name}
                </div>
                <div
                  style={{
                    fontFamily: '"Fira Code", monospace',
                    fontSize: 10,
                    color: "var(--slate2)",
                  }}
                >
                  {doc.uploadedAt ? `Diupload: ${doc.uploadedAt}` : "Belum diupload"}
                  {doc.expiresAt ? ` · Kadaluarsa: ${doc.expiresAt}` : ""}
                </div>
              </div>

              <span
                style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 9.5,
                  padding: "2px 8px",
                  background: "var(--surface3)",
                  borderRadius: 4,
                  color: "var(--slate)",
                }}
              >
                {doc.type}
              </span>
              <span className={`badge ${ds.cls}`}>
                <span className="bdot" />
                {ds.label}
              </span>

              <div style={{ display: "flex", gap: 4 }}>
                {doc.status !== "missing" && (
                  <button className="btn btn-ghost btn-xs btn-icon" title="Download">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                )}
                <button className="btn btn-ghost btn-xs btn-icon" title="Upload baru">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Riwayat ─────────────────────────────────────────────────────────────
const historyColors: Record<string, { bg: string; color: string; icon: string }> = {
  join: { bg: "var(--sapphire4)", color: "var(--sapphire)", icon: "👤" },
  promotion: { bg: "var(--emerald3)", color: "var(--emerald)", icon: "⬆️" },
  salary: { bg: "#ede9fe", color: "#7c3aed", icon: "💰" },
  transfer: { bg: "var(--amber3)", color: "var(--amber)", icon: "↔️" },
  status: { bg: "var(--ruby3)", color: "var(--ruby)", icon: "🔄" },
};

function TabRiwayat({ emp }: { emp: Employee }) {
  return (
    <div>
      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 8,
            bottom: 8,
            width: 2,
            background: "var(--line)",
            borderRadius: 2,
          }}
        />
        {emp.careerHistory.map((h, i) => {
          const hc = historyColors[h.type];
          return (
            <div
              key={h.id}
              style={{
                position: "relative",
                marginBottom: i < emp.careerHistory.length - 1 ? 20 : 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -24,
                  top: 10,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: hc.bg,
                  border: `2px solid ${hc.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  zIndex: 1,
                }}
              >
                <span>{hc.icon}</span>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--surface2)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r)",
                  marginLeft: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <span
                      className="badge"
                      style={{ background: hc.bg, color: hc.color, marginBottom: 6 }}
                    >
                      {
                        {
                          join: "Bergabung",
                          promotion: "Promosi",
                          salary: "Penyesuaian Gaji",
                          transfer: "Mutasi",
                          status: "Perubahan Status",
                        }[h.type]
                      }
                    </span>
                    <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.4 }}>
                      {h.description}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Fira Code", monospace',
                        fontSize: 10,
                        color: "var(--slate2)",
                        marginTop: 6,
                      }}
                    >
                      Oleh: {h.by}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: '"Fira Code", monospace',
                      fontSize: 10.5,
                      color: "var(--slate2)",
                      flexShrink: 0,
                    }}
                  >
                    {h.date}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Akun Karyawan ───────────────────────────────────────────────────────
function TabAkunKaryawan({ emp }: { emp: Employee }) {
  const { getToken } = useAuth();
  const [account, setAccount] = useState<EmployeeBackend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    getEmployeeById(emp.id, token)
      .then((data) => setAccount(data as unknown as EmployeeBackend))
      .catch(() => setError("Gagal memuat data akun"))
      .finally(() => setLoading(false));
  }, [emp.id, getToken]);

  const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const roleMap: Record<string, { cls: string; label: string }> = {
    super_admin: { cls: "b-review", label: "Super Admin" },
    hr:          { cls: "b-live",   label: "HR" },
    employee:    { cls: "b-draft",  label: "Karyawan" },
  };

  if (loading) return (
    <div style={{ padding: "40px 0", textAlign: "center", color: "var(--slate2)", fontSize: 13 }}>
      Memuat data akun...
    </div>
  );

  if (error || !account) return (
    <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ruby)", fontSize: 13 }}>
      {error ?? "Data akun tidak ditemukan"}
    </div>
  );

  const roleInfo = roleMap[account.role] ?? { cls: "b-draft", label: account.role };


  if (loading) return (
    <div style={{ padding: "40px 0", textAlign: "center", color: "var(--slate2)", fontSize: 13 }}>
      Memuat data akun...
    </div>
  );

  if (error || !account) return (
    <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ruby)", fontSize: 13 }}>
      {error ?? "Data akun tidak ditemukan"}
    </div>   
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
          background: "var(--sapphire4)",
          borderRadius: "var(--r)",
          border: "1px solid rgba(37,99,235,0.15)",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: "var(--sapphire)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--sapphire)", marginBottom: 2 }}>
            Akun Sistem Karyawan
          </div>
          <div style={{ fontSize: 11, color: "var(--slate2)", fontFamily: '"Fira Code", monospace' }}>
            Dibuat: {fmtDateTime(account.created_at)}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span className={`badge ${account.is_active ? "b-live" : "b-draft"}`}>
            <span className="bdot" />
            {account.is_active ? "Aktif" : "Nonaktif"}
          </span>
          <span className={`badge ${account.is_verified ? "b-live" : "b-review"}`}>
            <span className="bdot" />
            {account.is_verified ? "Terverifikasi" : "Belum Verifikasi"}
          </span>
        </div>
      </div>

      {/* Grid field akun */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Email */}
        <div style={{ gridColumn: "span 2" }}>
          <label className="f-label">Email Akun</label>
          <div
            style={{
              padding: "9px 12px",
              background: "var(--surface2)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontSize: 12.5,
              color: "var(--ink)",
              fontFamily: '"Fira Code", monospace',
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{account.email}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--slate2)" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
        </div>

        {/* Password */}
        <div style={{ gridColumn: "span 2" }}>
          <label className="f-label">Password</label>
          <div
            style={{
              padding: "9px 12px",
              background: "var(--surface2)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontSize: 12.5,
              color: "var(--ink)",
              fontFamily: '"Fira Code", monospace',
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{showPassword ? "p@ssw0rd_mock!" : "••••••••••••"}</span>
            <button
              onClick={() => setShowPassword((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                color: "var(--slate2)",
              }}
              title={showPassword ? "Sembunyikan" : "Tampilkan"}
            >
              {showPassword ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <div style={{ fontSize: 10, color: "var(--slate2)", marginTop: 4 }}>
            * Password hanya dapat diubah melalui fitur reset password
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="f-label">Role / Hak Akses</label>
          <div
            style={{
              padding: "9px 12px",
              background: "var(--surface2)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontSize: 12.5,
              color: "var(--ink)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className={`badge ${roleInfo.cls}`}>
              <span className="bdot" />
              {roleInfo.label}
            </span>
            <span style={{ fontFamily: '"Fira Code", monospace', fontSize: 11, color: "var(--slate2)" }}>
              {account.role}
            </span>
          </div>
        </div>

        {/* Last login */}
        <div>
          <label className="f-label">Login Terakhir</label>
          <div
            style={{
              padding: "9px 12px",
              background: "var(--surface2)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontSize: 12.5,
              color: "var(--ink)",
              fontFamily: '"Fira Code", monospace',
            }}
          >
            {/* {fmtDateTime(account.lastLogin)} */}
          </div>
        </div>

        {/* Is Active */}
        <div>
          <label className="f-label">Status Akun</label>
          <div
            style={{
              padding: "9px 12px",
              background: account.is_active ? "var(--emerald3)" : "var(--surface2)",
              border: `1px solid ${account.is_active ? "rgba(13,124,82,0.2)" : "var(--line)"}`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className={`badge ${account.is_active ? "b-live" : "b-draft"}`}>
              <span className="bdot" />
              {account.is_active ? "Aktif" : "Nonaktif"}
            </span>
            <span style={{ fontSize: 11, color: account.is_active ? "var(--emerald)" : "var(--slate2)" }}>
              {account.is_active ? "Akun dapat login" : "Akun diblokir"}
            </span>
          </div>
        </div>

        {/* Is Verified */}
        <div>
          <label className="f-label">Status Verifikasi Email</label>
          <div
            style={{
              padding: "9px 12px",
              background: account.is_verified ? "var(--emerald3)" : "var(--amber3)",
              border: `1px solid ${account.is_verified ? "rgba(13,124,82,0.2)" : "rgba(180,110,0,0.2)"}`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className={`badge ${account.is_verified ? "b-live" : "b-review"}`}>
              <span className="bdot" />
              {account.is_verified ? "Terverifikasi" : "Belum Verifikasi"}
            </span>
            {!account.is_verified && (
              <span style={{ fontSize: 11, color: "var(--amber)" }}>Email belum dikonfirmasi</span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          paddingTop: 12,
          borderTop: "1px solid var(--line)",
        }}
      >
        <button className="btn btn-primary btn-sm">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
          </svg>
          Reset Password
        </button>
        <button className="btn btn-ghost btn-sm">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" />
          </svg>
          Ubah Role
        </button>
        {account.is_active ? (
          <button className="btn btn-danger btn-sm" style={{ marginLeft: "auto" }}>
            Nonaktifkan Akun
          </button>
        ) : (
          <button className="btn btn-success btn-sm" style={{ marginLeft: "auto" }}>
            Aktifkan Akun
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
type TabKey = "profil" | "pekerjaan" | "dokumen" | "riwayat" | "akun";

const tabs: { key: TabKey; label: string }[] = [
  { key: "profil", label: "Profil Pribadi" },
  { key: "pekerjaan", label: "Pekerjaan & Absensi" },
  { key: "dokumen", label: "Dokumen" },
  { key: "riwayat", label: "Riwayat Karir" },
  { key: "akun", label: "Akun Karyawan" }, 
];

interface EmployeeDetailPageProps {
  employeeId: string;
}

export default function EmployeeDetailPage({ employeeId }: EmployeeDetailPageProps) {
  const { getToken } = useAuth();
  const [employee, setEmployee] = useState<EmployeeBackend | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("profil");

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getEmployeeById(employeeId, token)
      .then(setEmployee)
      .finally(() => setLoading(false));
  }, [employeeId]);

  if (loading) return (
    <div style={{ padding: "80px 0", textAlign: "center", color: "var(--slate2)", fontSize: 13 }}>
      Memuat data karyawan...
    </div>
  );

  if (!employee) return (
    <div style={{ padding: "80px 0", textAlign: "center", color: "var(--ruby)", fontSize: 13 }}>
      Karyawan tidak ditemukan.
    </div>
  );

  const emp = mapToEmployee(employee);

  return (
    <div id="content">
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
          fontFamily: '"Fira Code", monospace',
          fontSize: 11,
          color: "var(--slate2)",
        }}
      >
        <Link href="/employees" style={{ color: "var(--sapphire)", textDecoration: "none" }}>
          Karyawan
        </Link>
        <span>›</span>
        <span style={{ color: "var(--ink3)" }}>{emp.name}</span>
        <span
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: 10,
            background: "var(--surface3)",
            padding: "1px 6px",
            borderRadius: 4,
          }}
        >
          {emp.employeeNumber}
        </span>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Sidebar emp={emp} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="card"
            style={{
              borderRadius: "var(--r3)",
              animation: "cardIn 0.4s ease forwards",
              opacity: 0,
            }}
          >
            <div className="card-inner" style={{ padding: 0, overflow: "hidden" }}>
              {/* Tabs header */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid var(--line)",
                  background: "var(--surface2)",
                  padding: "0 4px",
                }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: "13px 18px",
                      fontSize: 12.5,
                      fontWeight: 600,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color:
                        activeTab === tab.key ? "var(--sapphire)" : "var(--slate)",
                      borderBottom:
                        activeTab === tab.key
                          ? "2px solid var(--sapphire)"
                          : "2px solid transparent",
                      marginBottom: "-1px",
                      transition: "all 0.15s",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ padding: "20px 22px" }}>
                {activeTab === "profil" && <TabProfil emp={emp} />}
                {activeTab === "pekerjaan" && <TabPekerjaan emp={emp} />}
                {activeTab === "dokumen" && <TabDokumen emp={emp} />}
                {activeTab === "riwayat" && <TabRiwayat emp={emp} />}
                {activeTab === "akun" && <TabAkunKaryawan emp={emp} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}