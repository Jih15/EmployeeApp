"use client";

import { AlertItem, alertStyles } from "@/types/Alerts";

interface AlertRowProps {
  alert: AlertItem;
  onDismiss?: (id: string) => void;
}

export default function AlertRow({ alert, onDismiss }: AlertRowProps) {
  const s = alertStyles[alert.type];
  return (
    <div className={`alert-row ${s.cls}`}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke={s.ic}
        strokeWidth="2"
        style={{ flexShrink: 0, marginTop: 1 }}
        dangerouslySetInnerHTML={{ __html: s.ipath }}
      />
      <div style={{ flex: 1 }}>
        <div className="a-title">{alert.title}</div>
        <div className="a-body">{alert.message}</div>
      </div>
      {onDismiss && (
        <span className="a-x" onClick={() => onDismiss(alert.id)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      )}
    </div>
  );
}