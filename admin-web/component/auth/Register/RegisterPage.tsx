"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../Login/login.css";
import "./register.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "SuperAdmin" | "HR" | "Employee";

interface Step1Data {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Step2Data {
  displayName: string;
  jobTitle: string;
  organisation: string;
  role: Role;
  avatarUrl: string | null;
}

interface Step3Data {
  emailDigest: boolean;
  publishAlerts: boolean;
  seoUpdates: boolean;
  teamFeed: boolean;
  termsAccepted: boolean;
}

type Step1Errors = Partial<Record<keyof Step1Data, string>>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map = [
    { label: "Terlalu lemah", color: "var(--ruby2)" },
    { label: "Bisa lebih kuat", color: "var(--amber2)" },
    { label: "Password bagus", color: "var(--sapphire2)" },
    { label: "Sangat kuat!", color: "var(--emerald2)" },
  ];
  return { score, ...(map[score - 1] ?? { label: "Masukkan password", color: "var(--slate2)" }) };
}

// ─── Left Panel ───────────────────────────────────────────────────────────────
function LeftPanel({ currentStep }: { currentStep: number }) {
  const features = [
    "Face recognition realtime via kamera",
    "Approval cuti otomatis ke HR",
    "Payroll otomatis dari data absensi",
    "Role-based access: SuperAdmin, HR, Employee",
  ];

  return (
    <div className="auth-left reg-left">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb reg-orb-3" />

      {/* Logo */}
      <div className="auth-logo auth-l-anim-1">
        <div className="auth-logo-icon">
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
            <rect x="10" y="1" width="7" height="3" rx="1" fill="white" opacity="0.5" />
            <rect x="10" y="6" width="7" height="2" rx="1" fill="white" opacity="0.3" />
            <rect x="1" y="10" width="16" height="7" rx="1.5" fill="white" opacity="0.6" />
          </svg>
        </div>
        <div>
          <div className="auth-logo-name">Meridian</div>
          <div className="auth-logo-sub">HR Portal · v1.0</div>
        </div>
      </div>

      {/* Main content */}
      <div className="auth-left-content">
        <div className="auth-eyebrow auth-l-anim-2">Bergabung sekarang</div>
        <h1 className="auth-headline auth-l-anim-3">
          Kelola SDM<br />dengan <em>satu</em><br />platform.
        </h1>
        <p className="auth-desc auth-l-anim-4">
          Daftarkan akun dalam 2 menit dan mulai kelola karyawan, absensi, cuti, dan payroll dari satu dashboard.
        </p>

        {/* Feature checklist */}
        <div className="reg-check-list auth-l-anim-5">
          {features.map((f) => (
            <div key={f} className="reg-check-item">
              <div className="reg-check-icon">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--emerald2)" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              {f}
            </div>
          ))}
        </div>

        {/* Plan card */}
        <div className="reg-plan-card auth-l-anim-5">
          <div className="reg-plan-head">
            <div className="reg-plan-name">Enterprise HR</div>
            <div className="reg-plan-badge">Gratis 30 hari</div>
          </div>
          <div className="reg-plan-price">
            Rp 0<span>/bulan (trial)</span>
          </div>
          <div className="reg-plan-trial">✦ Tidak butuh kartu kredit · Bisa batalkan kapan saja</div>
        </div>
      </div>

      {/* Step dots */}
      <div className="reg-steps-track auth-l-anim-5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`reg-step-dot${s === currentStep ? " active" : s < currentStep ? " done" : ""}`}
          />
        ))}
        <div style={{ flex: 1 }} />
        <span className="reg-step-counter">Step {currentStep} of 3</span>
      </div>
    </div>
  );
}

// ─── Step 1: Account ──────────────────────────────────────────────────────────
function Step1({
  data,
  onChange,
  errors,
}: {
  data: Step1Data;
  onChange: (key: keyof Step1Data, val: string) => void;
  errors: Step1Errors;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const pwStrength = data.password ? getPasswordStrength(data.password) : null;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());

  return (
    <div>
      <div className="reg-pane-title">
        Buat <em>akun</em> Anda
      </div>
      <div className="reg-pane-sub">Kredensial login dasar. Kurang dari semenit.</div>

      {/* Name row */}
      <div className="reg-field-grid reg-col-2">
        <div>
          <label className="f-label">
            Nama Depan <span className="reg-req">*</span>
          </label>
          <div className="reg-field-wrap">
            <svg className="reg-f-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <input
              className={`f-input reg-f-input${errors.firstName ? " reg-input-error" : ""}`}
              placeholder="Budi"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
          </div>
          {errors.firstName && <div className="reg-error-msg">{errors.firstName}</div>}
        </div>
        <div>
          <label className="f-label">
            Nama Belakang <span className="reg-req">*</span>
          </label>
          <div className="reg-field-wrap">
            <svg className="reg-f-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <input
              className={`f-input reg-f-input${errors.lastName ? " reg-input-error" : ""}`}
              placeholder="Santoso"
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </div>
          {errors.lastName && <div className="reg-error-msg">{errors.lastName}</div>}
        </div>
      </div>

      {/* Email */}
      <div className="reg-field-grid reg-col-1">
        <div>
          <label className="f-label">
            Alamat Email <span className="reg-req">*</span>
          </label>
          <div className="reg-field-wrap">
            <svg className="reg-f-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              className={`f-input reg-f-input${errors.email ? " reg-input-error" : emailValid && data.email ? " reg-input-valid" : ""}`}
              type="email"
              placeholder="nama@meridian.co.id"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              style={{ fontFamily: '"Fira Code", monospace' }}
            />
            {emailValid && data.email && (
              <div className="reg-f-check">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--emerald2)" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
          {errors.email && <div className="reg-error-msg">{errors.email}</div>}
        </div>

        {/* Password */}
        <div>
          <label className="f-label">
            Password <span className="reg-req">*</span>
          </label>
          <div className="reg-field-wrap">
            <svg className="reg-f-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <input
              className={`f-input reg-f-input${errors.password ? " reg-input-error" : ""}`}
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 karakter"
              value={data.password}
              onChange={(e) => onChange("password", e.target.value)}
            />
            <button type="button" className="reg-f-eye" onClick={() => setShowPw((v) => !v)}>
              {showPw ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {/* Strength bar */}
          {data.password && pwStrength && (
            <div className="reg-pw-strength">
              <div className="reg-pw-bars">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="reg-pw-bar"
                    style={{ background: i < pwStrength.score ? pwStrength.color : "var(--line)" }}
                  />
                ))}
              </div>
              <div className="reg-pw-label" style={{ color: pwStrength.color }}>
                {pwStrength.label}
              </div>
            </div>
          )}
          {errors.password && <div className="reg-error-msg">{errors.password}</div>}
        </div>

        {/* Confirm password */}
        <div>
          <label className="f-label">
            Konfirmasi Password <span className="reg-req">*</span>
          </label>
          <div className="reg-field-wrap">
            <svg className="reg-f-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <input
              className={`f-input reg-f-input${errors.confirmPassword ? " reg-input-error" : ""}`}
              type={showPw2 ? "text" : "password"}
              placeholder="Ulangi password"
              value={data.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
            />
            <button type="button" className="reg-f-eye" onClick={() => setShowPw2((v) => !v)}>
              {showPw2 ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && <div className="reg-error-msg">{errors.confirmPassword}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Profile ──────────────────────────────────────────────────────────
const ROLES: { value: Role; icon: string; label: string; desc: string }[] = [
  { value: "SuperAdmin", icon: "🛡️", label: "Super Admin", desc: "Akses penuh ke semua fitur" },
  { value: "HR", icon: "👥", label: "HR Manager", desc: "Kelola karyawan & absensi" },
  { value: "Employee", icon: "👤", label: "Employee", desc: "Akses self-service saja" },
];

function Step2({
  data,
  onChange,
  step1,
}: {
  data: Step2Data;
  onChange: <K extends keyof Step2Data>(key: K, val: Step2Data[K]) => void;
  step1: Step1Data;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const initials =
    (step1.firstName[0] ?? "") + (step1.lastName[0] ?? "") ||
    (data.displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()) ||
    "??";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange("avatarUrl", ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="reg-pane-title">
        Profil <em>Anda</em>
      </div>
      <div className="reg-pane-sub">Informasi yang terlihat oleh rekan kerja Anda.</div>

      {/* Avatar upload */}
      <div className="reg-avatar-upload" onClick={() => fileRef.current?.click()}>
        <div
          className="reg-avatar-preview"
          style={
            data.avatarUrl
              ? { backgroundImage: `url(${data.avatarUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : {}
          }
        >
          {!data.avatarUrl && initials}
        </div>
        <div style={{ flex: 1 }}>
          <div className="reg-avatar-title">Upload foto profil</div>
          <div className="reg-avatar-sub">PNG, JPG maks 5MB · Rekomendasi 400×400px</div>
        </div>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--slate3)" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      </div>

      {/* Fields */}
      <div className="reg-field-grid reg-col-1" style={{ marginBottom: 20 }}>
        <div>
          <label className="f-label">Nama Tampilan</label>
          <div className="reg-field-wrap">
            <svg className="reg-f-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <input
              className="f-input reg-f-input"
              placeholder={`${step1.firstName} ${step1.lastName}`.trim() || "Nama lengkap"}
              value={data.displayName}
              onChange={(e) => onChange("displayName", e.target.value)}
            />
          </div>
          <div className="reg-f-hint">Ini nama yang terlihat oleh rekan tim.</div>
        </div>

        <div className="reg-col-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label className="f-label">Jabatan</label>
            <div className="reg-field-wrap">
              <svg className="reg-f-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
              <input
                className="f-input reg-f-input"
                placeholder="Backend Engineer"
                value={data.jobTitle}
                onChange={(e) => onChange("jobTitle", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="f-label">Perusahaan</label>
            <div className="reg-field-wrap">
              <svg className="reg-f-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <input
                className="f-input reg-f-input"
                placeholder="PT Meridian Indonesia"
                value={data.organisation}
                onChange={(e) => onChange("organisation", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role selector */}
      <label className="f-label" style={{ marginBottom: 10 }}>Pilih Role</label>
      <div className="reg-role-grid">
        {ROLES.map((r) => (
          <div
            key={r.value}
            className={`reg-role-card${data.role === r.value ? " selected" : ""}`}
            onClick={() => onChange("role", r.value)}
          >
            <div className="reg-role-check">
              {data.role === r.value && (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="reg-role-icon">{r.icon}</span>
            <div className="reg-role-name">{r.label}</div>
            <div className="reg-role-desc">{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Preferences ──────────────────────────────────────────────────────
const NOTIFICATION_ITEMS = [
  { key: "emailDigest" as const, title: "Email Digest", desc: "Ringkasan mingguan performa HR" },
  { key: "publishAlerts" as const, title: "Notifikasi Absensi", desc: "Alert ketika ada karyawan terlambat atau alpha" },
  { key: "seoUpdates" as const, title: "Update Cuti", desc: "Notif ketika ada pengajuan cuti baru" },
  { key: "teamFeed" as const, title: "Aktivitas Tim", desc: "Update aksi tim secara realtime" },
];

function Step3({
  data,
  onChange,
  termsError,
}: {
  data: Step3Data;
  onChange: <K extends keyof Step3Data>(key: K, val: Step3Data[K]) => void;
  termsError: boolean;
}) {
  return (
    <div>
      <div className="reg-pane-title">
        Hampir <em>selesai.</em>
      </div>
      <div className="reg-pane-sub">Sesuaikan preferensi notifikasi dan setujui ketentuan.</div>

      {/* Notification toggles */}
      <label className="f-label" style={{ marginBottom: 10 }}>Preferensi Notifikasi</label>
      <div style={{ marginBottom: 22 }}>
        {NOTIFICATION_ITEMS.map((item) => (
          <div
            key={item.key}
            className="reg-toggle-row"
            onClick={() => onChange(item.key, !data[item.key])}
          >
            <div className="reg-toggle-info">
              <div className="reg-toggle-title">{item.title}</div>
              <div className="reg-toggle-desc">{item.desc}</div>
            </div>
            <div className={`reg-toggle-switch${data[item.key] ? " on" : ""}`} />
          </div>
        ))}
      </div>

      {/* Terms */}
      <div
        className={`reg-terms-box${termsError ? " reg-terms-error" : ""}`}
        onClick={() => onChange("termsAccepted", !data.termsAccepted)}
      >
        <div
          className={`reg-terms-checkbox${data.termsAccepted ? " checked" : ""}`}
        >
          {data.termsAccepted && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <div className="reg-terms-text">
          Saya menyetujui{" "}
          <a href="#" onClick={(e) => e.stopPropagation()}>Syarat & Ketentuan</a>{" "}
          dan{" "}
          <a href="#" onClick={(e) => e.stopPropagation()}>Kebijakan Privasi</a>{" "}
          Meridian HR. Saya memahami bahwa akun saya akan dikelola sesuai kebijakan perusahaan.
        </div>
      </div>
      {termsError && (
        <div className="reg-error-msg" style={{ marginBottom: 4 }}>
          Anda harus menyetujui ketentuan untuk melanjutkan.
        </div>
      )}
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ email, role }: { email: string; role: Role }) {
  const roleLabel = { SuperAdmin: "Super Admin", HR: "HR Manager", Employee: "Employee" }[role];
  return (
    <div className="reg-success">
      <div className="reg-success-icon">🎉</div>
      <div className="reg-success-title">
        Selamat datang di <em>Meridian!</em>
      </div>
      <div className="reg-success-sub">
        Akun Anda berhasil dibuat. Kami telah mengirim email verifikasi — cek inbox Anda untuk mengaktifkan akun.
      </div>
      <div className="reg-success-meta">
        {[
          { k: "Email", v: email },
          { k: "Role", v: roleLabel },
          { k: "Status", v: "✓ Aktif", green: true },
          { k: "Trial", v: "30 hari gratis" },
        ].map((row) => (
          <div key={row.k} className="reg-success-row">
            <span className="reg-success-key">{row.k}</span>
            <span className="reg-success-val" style={row.green ? { color: "var(--emerald)" } : {}}>
              {row.v}
            </span>
          </div>
        ))}
      </div>
      <Link href="/auth" style={{ textDecoration: "none" }}>
        <button className="btn btn-primary" style={{ minWidth: 220, padding: "12px 24px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Masuk ke Meridian HR
        </button>
      </Link>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [step1, setStep1] = useState<Step1Data>({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });
  const [step1Errors, setStep1Errors] = useState<Step1Errors>({});

  const [step2, setStep2] = useState<Step2Data>({
    displayName: "", jobTitle: "", organisation: "", role: "Employee", avatarUrl: null,
  });

  const [step3, setStep3] = useState<Step3Data>({
    emailDigest: true, publishAlerts: true, seoUpdates: false, teamFeed: true, termsAccepted: false,
  });

  const scrollTop = useCallback(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function validateStep1(): boolean {
    const errs: Step1Errors = {};
    if (!step1.firstName.trim()) errs.firstName = "Nama depan wajib diisi.";
    if (!step1.lastName.trim()) errs.lastName = "Nama belakang wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email.trim())) errs.email = "Masukkan alamat email yang valid.";
    if (step1.password.length < 8) errs.password = "Password minimal 8 karakter.";
    if (step1.password !== step1.confirmPassword || !step1.confirmPassword) errs.confirmPassword = "Password tidak cocok.";
    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step < 3) { setStep((s) => s + 1); scrollTop(); }
    else handleSubmit();
  }

  function handleBack() {
    if (step > 1) { setStep((s) => s - 1); scrollTop(); }
  }

  function handleSubmit() {
    if (!step3.termsAccepted) { setTermsError(true); return; }
    setTermsError(false);
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1800);
  }

  // Progress width per step
  const progWidth = { 1: "33%", 2: "67%", 3: "100%" }[step as 1 | 2 | 3];

  // Breadcrumb states
  const crumbState = (n: number) =>
    n < step ? "done" : n === step ? "active" : "idle";

  const CRUMBS = ["Akun", "Profil", "Preferensi"];

  if (done) {
    return (
      <div className="auth-page">
        <LeftPanel currentStep={3} />
        <div className="reg-right-panel">
          <SuccessScreen email={step1.email} role={step2.role} />
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <LeftPanel currentStep={step} />

      <div className="reg-right-panel">
        {/* Step header */}
        <div className="reg-step-header">
          {/* Breadcrumb */}
          <div className="reg-breadcrumb">
            {CRUMBS.map((label, i) => {
              const n = i + 1;
              const state = crumbState(n);
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div className={`reg-crumb reg-crumb-${state}`}>
                    <div className="reg-crumb-num">
                      {state === "done" ? (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        n
                      )}
                    </div>
                    {label}
                  </div>
                  {n < 3 && <span className="reg-crumb-sep">›</span>}
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="reg-prog-track">
            <div className="reg-prog-fill" style={{ width: progWidth }} />
          </div>
        </div>

        {/* Step body */}
        <div className="reg-step-body" ref={bodyRef}>
          <div key={step} className="reg-pane-anim">
            {step === 1 && (
              <Step1
                data={step1}
                onChange={(k, v) => {
                  setStep1((p) => ({ ...p, [k]: v }));
                  setStep1Errors((p) => ({ ...p, [k]: undefined }));
                }}
                errors={step1Errors}
              />
            )}
            {step === 2 && (
              <Step2
                data={step2}
                onChange={(k, v) => setStep2((p) => ({ ...p, [k]: v }))}
                step1={step1}
              />
            )}
            {step === 3 && (
              <Step3
                data={step3}
                onChange={(k, v) => {
                  setStep3((p) => ({ ...p, [k]: v }));
                  if (k === "termsAccepted") setTermsError(false);
                }}
                termsError={termsError}
              />
            )}
          </div>
        </div>

        {/* Nav footer */}
        <div className="reg-step-nav">
          <div>
            {step === 1 ? (
              <div className="reg-bottom-text">
                Sudah punya akun?{" "}
                <Link href="/auth" style={{ color: "var(--sapphire)", textDecoration: "none", fontWeight: 600 }}>
                  Masuk →
                </Link>
              </div>
            ) : (
              <button className="btn btn-outline btn-sm" onClick={handleBack}>
                ← Kembali
              </button>
            )}
          </div>

          <button
            className={`btn btn-sm${step === 3 ? " btn-sapphire" : " btn-primary"}`}
            onClick={handleNext}
            disabled={submitting}
            style={{ minWidth: 140 }}
          >
            {submitting ? (
              <>
                <svg className="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25" />
                  <path d="M21 12a9 9 0 00-9-9" />
                </svg>
                Membuat akun…
              </>
            ) : step === 3 ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                Buat Akun
              </>
            ) : (
              "Lanjutkan →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}