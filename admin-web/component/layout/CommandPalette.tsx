"use client";

import { useState, useEffect, useRef } from "react";

interface Command {
  icon: string;
  label: string;
  desc: string;
  short: string;
  href?: string;
}

const cmds: Command[] = [
  { icon: "👤", label: "Tambah Karyawan", desc: "Daftarkan karyawan baru", short: "N", href: "/employees/new" },
  { icon: "📋", label: "Rekap Absensi", desc: "Lihat laporan kehadiran hari ini", short: "A", href: "/attendance" },
  { icon: "🏖️", label: "Pengajuan Cuti", desc: "Buat pengajuan cuti baru", short: "L", href: "/leave/new" },
  { icon: "💰", label: "Generate Payroll", desc: "Proses penggajian bulan ini", short: "P", href: "/payroll" },
  { icon: "📊", label: "Dashboard", desc: "Kembali ke dashboard utama", short: "D", href: "/" },
  { icon: "👥", label: "Daftar Karyawan", desc: "Kelola semua karyawan", short: "E", href: "/employees" },
  { icon: "⚙️", label: "Pengaturan", desc: "Konfigurasi sistem HR", short: "", href: "/settings" },
  { icon: "📁", label: "Dokumen", desc: "Kelola dokumen karyawan", short: "" },
  { icon: "🔒", label: "Hak Akses", desc: "Atur role & permission", short: "" },
  { icon: "📈", label: "Laporan", desc: "Export laporan HR", short: "" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

function CommandPaletteInner({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? cmds.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.desc.toLowerCase().includes(query.toLowerCase())
      )
    : cmds;

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        // Bisa navigate ke href jika ada
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [filtered.length, onClose]);

  return (
    <div
      id="cmdoverlay"
      className="open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div id="cmdbox">
        <input
          ref={inputRef}
          id="cmdinput"
          placeholder="Cari karyawan, aksi, modul…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
        />
        <div className="cmd-results">
          <div className="cmd-section-lbl">Aksi & Navigasi</div>
          {filtered.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", fontSize: 13, color: "var(--slate2)" }}>
              Tidak ditemukan
            </div>
          ) : (
            filtered.map((item, i) => (
              <div
                key={item.label}
                className={`cmd-item${i === selectedIdx ? " sel" : ""}`}
                onClick={onClose}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <div className="cmd-item-icon">{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="cmd-item-label">{item.label}</div>
                  <div className="cmd-item-desc">{item.desc}</div>
                </div>
                {item.short && <div className="cmd-shortcut">⌘{item.short}</div>}
              </div>
            ))
          )}
        </div>
        <div className="cmd-footer">
          <span className="cmd-hint"><span className="kbd">↑↓</span> Navigasi</span>
          <span className="cmd-hint"><span className="kbd">↵</span> Pilih</span>
          <span className="cmd-hint"><span className="kbd">ESC</span> Tutup</span>
          <span style={{ marginLeft: "auto", fontFamily: '"Fira Code", monospace', fontSize: 9.5, color: "var(--slate2)" }}>
            Meridian HR
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) return null;
  return <CommandPaletteInner key="cmd-palette" onClose={onClose} />;
}