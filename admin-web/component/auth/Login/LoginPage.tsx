"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./login.css";

// ─── Left Panel ────────────────────────────────────────────────────────────────
function LeftPanel() {
  const stats = [
    { val: "128", label: "Karyawan Aktif", pulse: true },
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

      {/* Main content */}
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
              {s.pulse && <div className="auth-stat-dot" />}
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
          &ldquo;Meridian HR memangkas waktu rekap absensi dari 2 hari menjadi 10 menit.
          Fitur payroll otomatis dan manajemen dokumen sangat membantu tim HR kami.&rdquo;
        </div>
        <div className="auth-testimonial-author">
          <div className="auth-t-av" style={{ background: "#d1fae5", color: "#0d7c52" }}>
            DS
          </div>
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

// ─── Form fields type ─────────────────────────────────────────────────────────
interface FormErrors {
  email?: string;
  password?: string;
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.trim())) errs.email = "Masukkan alamat email yang valid.";
    if (password.length < 8) errs.password = "Password minimal 8 karakter.";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push("/"), 1200);
    }, 1800);
  }

  return (
    <div className="auth-page">
      <LeftPanel />

      {/* Right panel */}
      <div className="auth-right">

        {/* Status badge */}
        <div className="auth-anim-1">
          <div className="auth-status-badge">
            <div className="auth-status-dot" />
            Semua sistem berjalan normal
          </div>
        </div>

        {/* Header */}
        <div className="auth-form-header auth-anim-2">
          <div className="auth-form-tagline">Selamat datang kembali</div>
          <div className="auth-form-title">
            Masuk ke <em>Meridian</em>
          </div>
          <div className="auth-form-subtitle">
            Masukkan kredensial Anda untuk mengakses HR Portal.
          </div>
        </div>

        {/* SSO */}
        <div className="auth-sso-row auth-anim-2">
          <button type="button" className="auth-sso-btn">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button type="button" className="auth-sso-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* OR divider */}
        <div className="auth-or-divider auth-anim-3">
          <div className="auth-or-line" />
          <div className="auth-or-text">atau dengan email</div>
          <div className="auth-or-line" />
        </div>

        {/* Form */}
        <form noValidate onSubmit={handleSubmit}>
          <div className="auth-field-group auth-anim-4">
            {/* Email */}
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
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  autoComplete="email"
                  style={{ fontFamily: '"Fira Code", monospace' }}
                />
              </div>
              {errors.email && (
                <div className="auth-error-msg">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errors.email}
                </div>
              )}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-f-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  title={showPassword ? "Sembunyikan" : "Tampilkan"}
                >
                  {showPassword ? (
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
              {errors.password && (
                <div className="auth-error-msg">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="auth-remember-row auth-anim-5">
            <label className="auth-remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "var(--sapphire)", width: 15, height: 15, cursor: "pointer" }}
              />
              Ingat saya 30 hari
            </label>
            <Link href="/auth/forgot-password" className="auth-forgot-link">
              Lupa password?
            </Link>
          </div>

          {/* Role hint */}
          <div className="auth-role-hint auth-anim-5">
            {[
              { label: "SuperAdmin", color: "var(--sapphire)" },
              { label: "HR Manager", color: "var(--emerald2)" },
              { label: "Employee", color: "var(--slate3)" },
            ].map((r) => (
              <div key={r.label} className="auth-role-hint-inner">
                <div className="auth-role-pip" style={{ background: r.color }} />
                <span>{r.label}</span>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`auth-submit-btn auth-anim-6${success ? " auth-submit-success" : ""}`}
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

        <div className="auth-bottom-text auth-anim-7">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="auth-bottom-link">
            Daftar sekarang →
          </Link>
        </div>

        <div className="auth-panel-footer auth-anim-7">
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