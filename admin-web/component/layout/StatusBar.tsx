"use client";

// StatusBar bisa menerima props dinamis dari masing-masing page
// lewat context atau cukup statis sebagai shell.
// Untuk employee management, kita tampilkan status server + jam kerja hari ini.

export default function StatusBar() {
  return (
    <div id="statusbar">
      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
        <div className="stat-item">
          <div
            className="stat-dot"
            style={{ background: "#4ade80", boxShadow: "0 0 5px #4ade80" }}
          />
          All systems operational
        </div>
        <div className="stat-sep" />
        <div className="stat-item">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Jam kerja: 08:00 – 17:00 WIB
        </div>
        <div className="stat-sep" />
        <div className="stat-item">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          112 / 128 karyawan hadir hari ini
        </div>
      </div>
      <div className="stat-right">
        <button className="btn-navy btn-navy-outline btn-sm">↺ Sync</button>
        <button className="btn-navy btn-navy-white btn-sm">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Karyawan
        </button>
      </div>
    </div>
  );
}