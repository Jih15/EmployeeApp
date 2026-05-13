"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Employee,
  Department,
  Role,
  EmployeeStatus,
  Gender,
} from "@/types/db-types/employee";
import { useAuth } from "@/lib/context/AuthContext";
import { createEmployee, deactivateEmployee, getEmployeeById, updateEmployeeProfile } from "@/lib/api/employee";

interface EmployeeFormPageProps {
  mode: "create" | "edit";
  employee?: Employee;
  employeeId?: string; // ← tambah
}

type FormData = {
  employeeNumber: string;
  name: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: Gender | "";
  address: string;
  phone: string;
  email: string;
  department: Department | "";
  role: Role | "";
  position: string;
  status: EmployeeStatus | "";
  joinDate: string;
  salary: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
};

const DEPARTMENTS: Department[] = ["Engineering", "HR", "Finance", "Marketing", "Operations"];
const ROLES: { value: string; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "hr", label: "HR" },
  { value: "employee", label: "Karyawan" },
];

const STATUSES: { value: EmployeeStatus; label: string }[] = [
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
  { value: "on-leave", label: "Cuti" },
];
const GENDERS: { value: string; label: string }[] = [
  { value: "M", label: "Laki-laki" },
  { value: "F", label: "Perempuan" },
];

function Section({
  title,
  pip,
  children,
}: {
  title: string;
  pip: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--surface2)",
        borderRadius: "var(--r)",
        border: "1px solid var(--line)",
        padding: "18px 20px",
        marginBottom: 16,
      }}
    >
      <div className="ctitle" style={{ marginBottom: 16 }}>
        <div className="ctitle-pip" style={{ background: pip }} />
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
  span,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <div style={span ? { gridColumn: "span 2" } : {}}>
      <label className="f-label">
        {label}
        {required && (
          <span style={{ color: "var(--ruby2)", marginLeft: 3 }}>*</span>
        )}
      </label>
      {children}
    </div>
  );
}

function fmtIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function EmployeeFormPage({ mode, employee, employeeId }: EmployeeFormPageProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState<FormData>({
    employeeNumber: employee?.id ?? "",
    name: employee?.name ?? "",
    nik: employee?.nik ?? "",
    birthPlace: employee?.birthPlace ?? "",
    birthDate: employee?.birthDate ?? "",
    gender: employee?.gender ?? "",
    address: employee?.address ?? "",
    phone: employee?.phone ?? "",
    email: employee?.email ?? "",
    department: employee?.department ?? "",
    role: employee?.role ?? "",
    position: employee?.position ?? "",
    status: employee?.status ?? "",
    joinDate: employee?.joinDate ?? "",
    salary: employee?.salary?.toString() ?? "",
    emergencyName: employee?.emergencyContact.name ?? "",
    emergencyRelation: employee?.emergencyContact.relation ?? "",
    emergencyPhone: employee?.emergencyContact.phone ?? "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(mode === "edit" && !employee);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [deactivating, setDeactivating] = useState(false);
  const { getToken } = useAuth();

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function validate() {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errs.name = "Nama wajib diisi";
    if (!form.nik.trim()) errs.nik = "NIK wajib diisi";
    else if (form.nik.length !== 16) errs.nik = "NIK harus 16 digit";
    if (!form.email.trim()) errs.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Format email tidak valid";
    if (!form.phone.trim()) errs.phone = "Telepon wajib diisi";
    if (!form.department) errs.department = "Departemen wajib dipilih";
    if (!form.role) errs.role = "Role wajib dipilih";
    if (!form.position.trim()) errs.position = "Jabatan wajib diisi";
    if (!form.status) errs.status = "Status wajib dipilih";
    if (!form.joinDate) errs.joinDate = "Tanggal bergabung wajib diisi";
    if (!form.salary.trim()) errs.salary = "Gaji wajib diisi";
    else if (isNaN(Number(form.salary.replace(/\D/g, "")))) errs.salary = "Gaji tidak valid";
    return errs;
  }

  async function handleDeactivate() {
    if (!confirm("Nonaktifkan karyawan ini? Tindakan ini tidak dapat dibatalkan.")) return;
    const token = getToken();
    if (!token || !employee) return;
    setDeactivating(true);
    try {
      await deactivateEmployee(employee.id, token);
      router.push("/employees");
    } catch {
      alert("Gagal menonaktifkan karyawan.");
    } finally {
      setDeactivating(false);
    }
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      if (isEdit && employee) {
        // Update profile
        await updateEmployeeProfile(employee.id, token, {
          full_name: form.name,
          phone: form.phone,
          address: form.address,
          birth_date: form.birthDate || undefined,
          gender: form.gender || undefined,
          department: form.department || undefined,
          position: form.position || undefined,
          join_date: form.joinDate || undefined,
          base_salary: form.salary ? Number(form.salary) : undefined,
          tax_id: form.nik || undefined,
          emergency_contact_name: form.emergencyName || undefined,
          emergency_contact_phone: form.emergencyPhone || undefined,
          emergency_contact_relation: form.emergencyRelation || undefined,
        });
      } else {
        // Create baru
        const result = await createEmployee(token, {
          full_name: form.name,
          employee_number: form.employeeNumber,
          phone: form.phone || undefined,
          address: form.address || undefined,
          birth_date: form.birthDate || undefined,
          gender: form.gender || undefined,
          department: form.department || undefined,
          position: form.position || undefined,
          join_date: form.joinDate || undefined,
          base_salary: form.salary ? Number(form.salary) : undefined,
          tax_id: form.nik || undefined,
          emergency_contact_name: form.emergencyName || undefined,
          emergency_contact_phone: form.emergencyPhone || undefined,
          emergency_contact_relation: form.emergencyRelation || undefined,
          email: form.email || undefined,
          role: form.role || undefined,
        });

        // Tampilkan generated_password jika ada
        if (result.generated_password) {
          setGeneratedPassword(result.generated_password);
          return; // jangan redirect dulu, tampilkan password ke HR
        }
      }

      setSaved(true);
      setTimeout(() => {
        router.push(isEdit ? `/employees/${employee?.id}` : "/employees");
      }, 1200);
    } catch (err) {
      setErrors({ name: "Gagal menyimpan. Coba lagi." });
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (mode !== "edit" || !employeeId || employee) return;
    const token = getToken();
    if (!token) return;

    getEmployeeById(employeeId, token)
      .then((raw) => {
        const p = raw.profile;
        setForm({
          employeeNumber: p.employee_number,
          name: p.full_name,
          nik: p.tax_id ?? "",
          birthPlace: "",
          birthDate: p.birth_date ?? "",
          gender: p.gender as Gender ?? "",
          address: p.address ?? "",
          phone: p.phone ?? "",
          email: raw.email,
          department: p.department as Department ?? "",
          role: raw.role as Role ?? "",
          position: p.position ?? "",
          status: raw.is_active ? "active" : "inactive",
          joinDate: p.join_date ?? "",
          salary: p.base_salary?.toString() ?? "",
          emergencyName: p.emergency_contact_name ?? "",
          emergencyRelation: p.emergency_contact_relation ?? "",
          emergencyPhone: p.emergency_contact_phone ?? "",
        });
      })
      .finally(() => setFetchLoading(false));
  }, [employeeId]);

  if (fetchLoading) return (
    <div style={{ padding: "80px 0", textAlign: "center", color: "var(--slate2)", fontSize: 13 }}>
      <div style={{ fontSize: 24, marginBottom: 12 }}>⏳</div>
      Memuat data karyawan...
    </div>
  );
  
  const inputStyle = (key: keyof FormData) => ({
    borderColor: errors[key] ? "var(--ruby2)" : undefined,
    boxShadow: errors[key] ? "0 0 0 3px var(--ruby3)" : undefined,
  });

  return (
    <div id="content">
      {/* Modal generated password */}
      {generatedPassword && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
        }}>
          <div className="card" style={{ width: 420, borderRadius: "var(--r3)" }}>
            <div className="card-inner" style={{ padding: "24px 28px", gap: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>
                ✅ Karyawan Berhasil Dibuat
              </div>
              <div style={{
                background: "var(--amber3)",
                border: "1px solid rgba(217,119,6,0.3)",
                borderRadius: "var(--r)", padding: "14px 16px",
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: "var(--amber)",
                  marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em",
                }}>
                  ⚠️ Password Auto-Generate — Catat & Sampaikan ke Karyawan
                </div>
                <div style={{
                  fontFamily: '"Fira Code", monospace', fontSize: 20, fontWeight: 700,
                  color: "var(--navy)", letterSpacing: "0.1em", padding: "8px 0",
                }}>
                  {generatedPassword}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--amber)", marginTop: 4 }}>
                  Password ini hanya muncul sekali dan tidak tersimpan di database.
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                onClick={() => {
                  setGeneratedPassword(null);
                  router.push("/employees");
                }}
              >
                Sudah Dicatat, Lanjut →
              </button>
            </div>
          </div>
        </div>
      )}

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
        {isEdit && (
          <>
            <span>›</span>
            <Link
              href={`/employees/${employee?.id}`}
              style={{ color: "var(--sapphire)", textDecoration: "none" }}
            >
              {employee?.name}
            </Link>
          </>
        )}
        <span>›</span>
        <span style={{ color: "var(--ink3)" }}>
          {isEdit ? "Edit Data" : "Tambah Karyawan Baru"}
        </span>
      </div>

      {/* Page Header */}
      <div className="section-head" style={{ marginBottom: 20 }}>
        <div>
          <div className="section-title">
            {isEdit ? (
              <>
                Edit <span>{employee?.name}</span>
              </>
            ) : (
              <>
                Tambah <span>Karyawan Baru</span>
              </>
            )}
          </div>
          <div className="section-sub">
            {isEdit
              ? `ID: ${employee?.id} · ${employee?.department} · ${employee?.position}`
              : "Isi semua data yang diperlukan untuk mendaftarkan karyawan baru"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href={isEdit ? `/employees/${employee?.id}` : "/employees"} className="btn btn-outline btn-sm" style={{ textDecoration: "none" }}>
            Batal
          </Link>
          <button
            className={`btn btn-sm ${saved ? "btn-success" : "btn-primary"}`}
            onClick={handleSubmit}
            disabled={saving}
            style={{ minWidth: 120 }}
          >
            {saving ? (
              <>
                <svg
                  className="spin"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25" />
                  <path d="M21 12a9 9 0 00-9-9" />
                </svg>
                Menyimpan…
              </>
            ) : saved ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Tersimpan!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                {isEdit ? "Simpan Perubahan" : "Buat Karyawan"}
              </>
            )}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
        {/* Left Column */}
        <div>
          {/* Identitas Pribadi */}
          <Section title="Identitas Pribadi" pip="var(--sapphire)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Nomor Karyawan" required={!isEdit}>
                <input
                  className="f-input"
                  placeholder="Contoh: EMP-001"
                  value={form.employeeNumber}
                  onChange={set("employeeNumber")}
                  disabled={isEdit} // tidak bisa diubah setelah dibuat
                  style={{
                    fontFamily: '"Fira Code", monospace',
                    opacity: isEdit ? 0.6 : 1,
                  }}
                />
              </Field>

              <Field label="Nama Lengkap" required span>
                <input
                  className="f-input"
                  placeholder="Contoh: Budi Santoso"
                  value={form.name}
                  onChange={set("name")}
                  style={inputStyle("name")}
                />
                {errors.name && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.name}</div>}
              </Field>

              <Field label="NIK (16 digit)" required>
                <input
                  className="f-input"
                  placeholder="3271010101900001"
                  value={form.nik}
                  onChange={set("nik")}
                  maxLength={16}
                  style={{ fontFamily: '"Fira Code", monospace', ...inputStyle("nik") }}
                />
                {errors.nik && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.nik}</div>}
              </Field>

              <Field label="Tempat Lahir">
                <input
                  className="f-input"
                  placeholder="Bandung"
                  value={form.birthPlace}
                  onChange={set("birthPlace")}
                />
              </Field>

              <Field label="Tanggal Lahir">
                <input
                  className="f-input"
                  type="date"
                  value={form.birthDate}
                  onChange={set("birthDate")}
                />
              </Field>

              <Field label="Jenis Kelamin">
                <select className="f-input f-select" value={form.gender} onChange={set("gender")}>
                  <option value="">— Pilih —</option>
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="No. Telepon" required>
                <input
                  className="f-input"
                  placeholder="+62 812-0000-0000"
                  value={form.phone}
                  onChange={set("phone")}
                  style={{ fontFamily: '"Fira Code", monospace', ...inputStyle("phone") }}
                />
                {errors.phone && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.phone}</div>}
              </Field>

              <Field label="Email" required span>
                <input
                  className="f-input"
                  type="email"
                  placeholder="nama@meridian.co.id"
                  value={form.email}
                  onChange={set("email")}
                  style={{ fontFamily: '"Fira Code", monospace', ...inputStyle("email") }}
                />
                {errors.email && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.email}</div>}
              </Field>

              <Field label="Alamat Lengkap" span>
                <textarea
                  className="f-input"
                  rows={2}
                  placeholder="Jl. Merdeka No. 1, Jakarta Pusat 10110"
                  value={form.address}
                  onChange={set("address")}
                  style={{ resize: "none" }}
                />
              </Field>
            </div>
          </Section>

          {/* Data Pekerjaan */}
          <Section title="Data Pekerjaan" pip="var(--emerald2)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Departemen" required>
                <select
                  className="f-input f-select"
                  value={form.department}
                  onChange={set("department")}
                  style={inputStyle("department")}
                >
                  <option value="">— Pilih Departemen —</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.department && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.department}</div>}
              </Field>

              <Field label="Role Sistem" required>
                <select className="f-input f-select" value={form.role} onChange={set("role")}>
                  <option value="">— Pilih Role —</option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {errors.role && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.role}</div>}
              </Field>

              <Field label="Jabatan / Posisi" required span>
                <input
                  className="f-input"
                  placeholder="Contoh: Backend Engineer"
                  value={form.position}
                  onChange={set("position")}
                  style={inputStyle("position")}
                />
                {errors.position && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.position}</div>}
              </Field>

              <Field label="Status Kepegawaian" required>
                <select
                  className="f-input f-select"
                  value={form.status}
                  onChange={set("status")}
                  style={inputStyle("status")}
                >
                  <option value="">— Pilih Status —</option>
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {errors.status && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.status}</div>}
              </Field>

              <Field label="Tanggal Bergabung" required>
                <input
                  className="f-input"
                  type="date"
                  value={form.joinDate}
                  onChange={set("joinDate")}
                  style={inputStyle("joinDate")}
                />
                {errors.joinDate && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.joinDate}</div>}
              </Field>

              <Field label="Gaji Pokok (IDR)" required span>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                    fontFamily: '"Fira Code", monospace', fontSize: 11, color: "var(--slate2)",
                    pointerEvents: "none",
                  }}>
                    Rp
                  </div>
                  <input
                    className="f-input"
                    placeholder="15000000"
                    value={form.salary}
                    onChange={set("salary")}
                    style={{
                      paddingLeft: 36,
                      fontFamily: '"Fira Code", monospace',
                      ...inputStyle("salary"),
                    }}
                  />
                </div>
                {errors.salary && <div style={{ fontSize: 10.5, color: "var(--ruby2)", marginTop: 4 }}>{errors.salary}</div>}
                {form.salary && !isNaN(Number(form.salary)) && Number(form.salary) > 0 && (
                  <div style={{ fontSize: 10.5, color: "var(--emerald)", marginTop: 4 }}>
                    = {fmtIDR(Number(form.salary))}
                  </div>
                )}
              </Field>
            </div>
          </Section>

          {/* Kontak Darurat */}
          <Section title="Kontak Darurat" pip="var(--ruby2)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <Field label="Nama">
                <input
                  className="f-input"
                  placeholder="Nama lengkap"
                  value={form.emergencyName}
                  onChange={set("emergencyName")}
                />
              </Field>
              <Field label="Hubungan">
                <input
                  className="f-input"
                  placeholder="Istri, Orang Tua, dll"
                  value={form.emergencyRelation}
                  onChange={set("emergencyRelation")}
                />
              </Field>
              <Field label="No. Telepon">
                <input
                  className="f-input"
                  placeholder="+62 812-0000-0000"
                  value={form.emergencyPhone}
                  onChange={set("emergencyPhone")}
                  style={{ fontFamily: '"Fira Code", monospace' }}
                />
              </Field>
            </div>
          </Section>
        </div>

        {/* Right Column — Preview & Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Live Preview */}
          <div className="card" style={{ borderRadius: "var(--r2)", animation: "cardIn 0.4s ease 0.1s forwards", opacity: 0 }}>
            <div className="card-inner" style={{ padding: "16px 18px" }}>
              <div className="ctitle" style={{ marginBottom: 14 }}>
                <div className="ctitle-pip" style={{ background: "var(--navy)" }} />
                Preview Kartu Karyawan
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "var(--sapphire4)",
                    color: "var(--sapphire)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: '"Fira Code", monospace',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {form.name
                    ? form.name
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase() ?? "")
                        .join("")
                    : "??"}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--navy)",
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    {form.name || "Nama Karyawan"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--slate2)" }}>
                    {form.position || "Jabatan"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { label: "Departemen", val: form.department || "—" },
                  { label: "Role", val: form.role || "—" },
                  { label: "Email", val: form.email || "—", mono: true, small: true },
                  {
                    label: "Gaji",
                    val: form.salary && Number(form.salary) > 0 ? fmtIDR(Number(form.salary)) : "—",
                    mono: true,
                  },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10.5, color: "var(--slate2)" }}>{item.label}</span>
                    <span
                      style={{
                        fontSize: item.small ? 10 : 11.5,
                        fontWeight: 600,
                        color: "var(--ink2)",
                        fontFamily: item.mono ? '"Fira Code", monospace' : undefined,
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panduan */}
          <div
            className="card"
            style={{
              borderRadius: "var(--r2)",
              animation: "cardIn 0.4s ease 0.2s forwards",
              opacity: 0,
              background: "var(--sapphire4)",
              border: "1px solid rgba(26,86,219,0.15)",
            }}
          >
            <div className="card-inner" style={{ padding: "14px 16px" }}>
              <div className="ctitle" style={{ marginBottom: 10, color: "var(--sapphire)" }}>
                <div className="ctitle-pip" style={{ background: "var(--sapphire)" }} />
                Panduan Pengisian
              </div>
              {[
                "NIK harus 16 digit sesuai KTP",
                "Email akan digunakan sebagai akun login",
                "Gaji diisi dalam angka (tanpa Rp atau titik)",
                "Kontak darurat minimal nama dan nomor HP",
              ].map((tip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    marginBottom: 8,
                    fontSize: 11.5,
                    color: "var(--sapphire)",
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "rgba(26,86,219,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Dokumen yg perlu disiapkan */}
          {!isEdit && (
            <div
              className="card"
              style={{
                borderRadius: "var(--r2)",
                animation: "cardIn 0.4s ease 0.3s forwards",
                opacity: 0,
                background: "var(--amber3)",
                border: "1px solid rgba(217,119,6,0.2)",
              }}
            >
              <div className="card-inner" style={{ padding: "14px 16px" }}>
                <div className="ctitle" style={{ marginBottom: 10, color: "var(--amber)" }}>
                  <div className="ctitle-pip" style={{ background: "var(--amber2)" }} />
                  Dokumen Diperlukan
                </div>
                {["KTP", "NPWP", "Ijazah terakhir", "Kontrak kerja", "BPJS Kesehatan"].map(
                  (doc) => (
                    <div
                      key={doc}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 7,
                        fontSize: 11.5,
                        color: "var(--amber)",
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {doc}
                    </div>
                  )
                )}
                <div style={{ fontSize: 10.5, color: "var(--amber)", marginTop: 8, opacity: 0.7 }}>
                  Upload dokumen bisa dilakukan setelah karyawan dibuat.
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone (edit only) */}
          {isEdit && (
            <div
              className="card"
              style={{
                borderRadius: "var(--r2)",
                animation: "cardIn 0.4s ease 0.3s forwards",
                opacity: 0,
                border: "1px solid rgba(185,28,28,0.25)",
              }}
            >
              <div className="card-inner" style={{ padding: "14px 16px" }}>
                <div className="ctitle" style={{ marginBottom: 10, color: "var(--ruby)" }}>
                  <div className="ctitle-pip" style={{ background: "var(--ruby2)" }} />
                  Zona Berbahaya
                </div>
                <div style={{ fontSize: 11.5, color: "var(--slate2)", marginBottom: 10 }}>
                  Tindakan ini tidak dapat dibatalkan. Lanjutkan dengan hati-hati.
                </div>
                <button
                  className="btn btn-danger"
                  style={{ width: "100%", fontSize: 11.5 }}
                  onClick={handleDeactivate}
                  disabled={deactivating}
                >
                  {deactivating ? "Menonaktifkan..." : "Nonaktifkan Karyawan Ini"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}