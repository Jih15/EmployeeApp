"use client";

import { useState } from "react";
import AlertRow from "@/component/ui/AlertRow";
import { AlertItem, AlertType } from "@/types/Alerts";

const defaultAlerts: AlertItem[] = [
  { id: "1", type: "info", title: "Scheduled Maintenance", message: "System maintenance on May 10, 02:00–04:00 UTC." },
  { id: "2", type: "success", title: "Homepage Published", message: "3 pages updated. CDN cache cleared successfully." },
  { id: "3", type: "warn", title: "SEO Score Below Threshold", message: "4 pages have SEO scores below 60." },
  { id: "4", type: "error", title: "Build Failed — Config Error", message: "Missing env variables. Check settings and redeploy." },
];

export default function SystemAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>(defaultAlerts);

  const addAlert = (type: AlertType) => {
    const map: Record<AlertType, Omit<AlertItem, "id">> = {
      info: { type: "info", title: "Site rebuild triggered", message: "Your site is rebuilding. Estimated 2 minutes." },
      success: { type: "success", title: "Page saved successfully", message: "Changes queued for publishing." },
      warn: { type: "warn", title: "Storage at 80% capacity", message: "Clean up unused media files." },
      error: { type: "error", title: "Form validation failed", message: "Fill all required fields and try again." },
    };
    const newAlert = { ...map[type], id: Date.now().toString() };
    setAlerts((prev) => [newAlert, ...prev]);
    setTimeout(() => setAlerts((prev) => prev.filter((a) => a.id !== newAlert.id)), 5000);
  };

  const dismiss = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="card s-7-3">
      <div className="card-inner">
        <div className="ctitle" style={{ marginBottom: 10 }}>
          <div className="ctitle-pip" style={{ background: "var(--ruby2)" }} />
          System Alerts
          <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
            <button
              className="btn btn-xs"
              style={{ background: "var(--sapphire4)", color: "var(--sapphire)", border: "1px solid rgba(26,86,219,0.15)" }}
              onClick={() => addAlert("info")}
            >
              Info
            </button>
            <button className="btn btn-amber btn-xs" onClick={() => addAlert("warn")}>Warn</button>
            <button className="btn btn-danger btn-xs" onClick={() => addAlert("error")}>Error</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {alerts.map((a) => (
            <AlertRow key={a.id} alert={a} onDismiss={dismiss} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Export addAlert type so DashboardPage can call it
export type { AlertType };