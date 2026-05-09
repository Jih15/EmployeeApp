"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { LoginForm } from "@/types/auth";

// ─── Left Panel ────────────────────────────────────────────────────────────────
function LeftPanel() {
  const stats = [
    { val: "128", label: "Karyawan Aktif", dot: true },
    { val: "99.9%", label: "Uptime SLA" },
    { val: "5 Modul", label: "HR Lengkap" },
  ];

  return (
    <div className="auth-left">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

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

      {/* Content */}
      <div className="auth-left-content">
        <div className="auth-eyebrow auth-l-anim-2">Employee Management System</div>
        <h1 className="auth-headline auth-l-anim-3">
          Kelola SDM<br />dengan <em>presisi.</em>
        </h1>
        <p className="auth-desc auth-l-anim-4">
          Meridian HR memberikan tim Anda satu workspace terpadu untuk mengelola
          karyawan, absensi, cuti, dan payroll — semuanya dari satu dashboard.
        </p>

        <div className="auth-stat-pills auth-l-anim-5">
          {stats.map((s) => (
            <div key={s.label} className="auth-stat-pill">
              {s.dot && <div className="auth-stat-dot" />}
              <div>
                <div className="auth-stat-val">{s.val}</div>
                <div className="auth-stat-lbl">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="auth-testimonial auth-l-anim-5">
        <div className="auth-testimonial-text">
            <p>
            &ldquo;Meridian HR memangkas waktu rekap absensi dari 2 hari menjadi 10 menit.
            Fitur payroll otomatis dan manajemen dokumen sangat membantu tim HR kami.&rdquo;
            </p>
        </div>
        <div className="auth-testimonial-author">
          <div className="auth-t-av" style={{ background: "#d1fae5", color: "#0d7c52" }}>DS</div>
          <div>
            <div className="auth-t-name">Dewi Sartika</div>
            <div className="auth-t-role">HR Manager, PT Meridian</div>
          </div>
          <div className="auth-t-stars">★★★★★</div>
        </div>
      </div>
    </div>
  );
}

// ─── Login Page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
//   const [form, setForm] = useState<LoginForm>({ email: "", password: "", rememberMe: true });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

//   function set(key: keyof LoginForm) {
//     return (e: React.ChangeEvent<HTMLInputElement>) => {
//       const val = key === "rememberMe" ? (e.target as HTMLInputElement).checked : e.target.value;
//       setForm((prev) => ({ ...prev, [key]: val }));
//       setErrors((prev) => ({ ...prev, [key]: undefined }));
//     };
//   }

//   function validate() {
//     const errs: typeof errors = {};
//     const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRx.test(form.email.trim())) errs.email = "Masukkan alamat email yang valid.";
//     if (form.password.length < 8) errs.password = "Password minimal 8 karakter.";
//     return errs;
//   }

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length > 0) { setErrors(errs); return; }
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       setSuccess(true);
//       setTimeout(() => router.push("/"), 1200);
//     }, 1800);
//   }

  return (
    <div className="auth-page">
      <LeftPanel />

      {/* Right Panel */}
      <div className="auth-right">
        {/* Status badge */}
        <div className="auth-anim-1">
          <div className="auth-status-badge">
            <div className="auth-status-dot" />
            Semua sistem berjalan normal
          </div>
        </div>

        <div className="auth-form-header auth-anim-2">
          <div className="auth-form-tagline">Selamat datang kembali</div>
          <div className="auth-form-title">
            Masuk ke <em>Meridian</em>
          </div>
          <div className="auth-form-subtitle">
            Masukkan kredensial Anda untuk mengakses HR Portal.
          </div>
        </div>

        <form noValidate>
          {/* Email */}
          <div className="auth-field-group auth-anim-3">
            <div>
              <label className="f-label">Email</label>
              <div className="auth-field-wrap">
                <svg className="auth-f-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  className={`f-input${errors.email ? " auth-input-error" : ""}`}
                  type="email"
                  placeholder="nama@meridian.co.id"
                  
                  style={{ fontFamily: '"Fira Code", monospace' }}
                />
              </div>
              {errors.email && <div className="auth-error-msg">{errors.email}</div>}
            </div>

            {/* Password */}
            <div>
              <label className="f-label">Password</label>
              <div className="auth-field-wrap">
                <svg className="auth-f-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  className={`f-input${errors.password ? " auth-input-error" : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="Masukkan password Anda"

                />
                <button
                  type="button"
                  className="auth-f-eye"
                  onClick={() => setShowPass((v) => !v)}
                  title={showPass ? "Sembunyikan" : "Tampilkan"}
                >
                  {showPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <div className="auth-error-msg">{errors.password}</div>}
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="auth-remember-row auth-anim-4">
            <label className="auth-remember-label">
              <input
                type="checkbox"

                style={{ accentColor: "var(--sapphire)", width: 15, height: 15, cursor: "pointer" }}
              />
              Ingat saya 30 hari
            </label>
            <Link href="/auth/forgot-password" className="auth-forgot-link">
              Lupa password?
            </Link>
          </div>

          {/* Role hint */}
          <div className="auth-role-hint auth-anim-4">
            <div className="auth-role-hint-inner">
              <div className="auth-role-pip" style={{ background: "var(--sapphire)" }} />
              <span>SuperAdmin</span>
            </div>
            <div className="auth-role-hint-inner">
              <div className="auth-role-pip" style={{ background: "var(--emerald2)" }} />
              <span>HR Manager</span>
            </div>
            <div className="auth-role-hint-inner">
              <div className="auth-role-pip" style={{ background: "var(--slate3)" }} />
              <span>Employee</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`auth-submit-btn auth-anim-5${success ? " auth-submit-success" : ""}`}
          >
            {loading ? (
              <>
                <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25" />
                  <path d="M21 12a9 9 0 00-9-9" />
                </svg>
                Masuk…
              </>
            ) : success ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Selamat datang, Arif!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Masuk ke Meridian HR
              </>
            )}
          </button>
        </form>

        <div className="auth-bottom-text auth-anim-6">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="auth-bottom-link">
            Daftar sekarang →
          </Link>
        </div>

        <div className="auth-panel-footer auth-anim-6">
          <div className="auth-footer-left">© 2026 Meridian HR · v1.0</div>
          <div className="auth-footer-links">
            <Link href="#">Privasi</Link>
            <Link href="#">Ketentuan</Link>
            <Link href="#">Dukungan</Link>
          </div>
        </div>
      </div>
    </div>
  );
}