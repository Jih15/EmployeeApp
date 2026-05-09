"use client";

import { useEffect, useRef, useState, useCallback } from "react";

import AlertRow from "@/component/ui/AlertRow";
import PagesTable from "@/component/ui/PagesTable";
import QuickActions from "@/component/ui/QuickActions";
import CreatePageForm from "@/component/ui/CreatePageForm";
import SystemAlerts from "@/component/ui/SystemAlerts";
import {
  MetricCard,
  TrafficChart,
  TrafficSources,
  SEOGrid,
  ActivityFeed,
  TeamList,
} from "@/component/ui/BentoCards";
import { AlertItem, AlertType } from "@/component/types/Alerts";

const dynAlertDefs: Record<string, Omit<AlertItem, "id">> = {
  info: { type: "info", title: "Site rebuild triggered", message: "Your site is rebuilding. Estimated 2 minutes." },
  success: { type: "success", title: "Page saved successfully", message: "Changes queued for publishing." },
  warning: { type: "warn", title: "Storage at 80% capacity", message: "Clean up unused media files." },
  error: { type: "error", title: "Form validation failed", message: "Fill all required fields and try again." },
};

function useCountUp(target: number, delay = 350) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let c = 0;
      const step = Math.ceil(target / 45);
      const iv = setInterval(() => {
        c = Math.min(c + step, target);
        setValue(c);
        if (c >= target) clearInterval(iv);
      }, 25);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay]);
  return value;
}

export default function DashboardPage() {
  const [dynAlerts, setDynAlerts] = useState<AlertItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const pageViews = useCountUp(284912);
  const activeUsers = useCountUp(8472);
  const publishedPages = useCountUp(347);

  const showDynAlert = useCallback((key: string) => {
    const def = dynAlertDefs[key];
    if (!def) return;
    const alert: AlertItem = { ...def, id: Date.now().toString() };
    setDynAlerts((prev) => [alert, ...prev]);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setDynAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 5000);
  }, []);

  const dismissDynAlert = (id: string) =>
    setDynAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div id="content" ref={contentRef}>
      {/* Dynamic Alerts Zone */}
      {dynAlerts.length > 0 && (
        <div id="dyn-alerts">
          {dynAlerts.map((a) => (
            <AlertRow key={a.id} alert={a} onDismiss={dismissDynAlert} />
          ))}
        </div>
      )}

      {/* Section Header */}
      <div className="section-head">
        <div>
          <div className="section-title">
            Good morning, <span>Arif.</span>
          </div>
          <div className="section-sub">
            Thursday, 8 May 2026 · Week 19 · meridian.co is performing above average
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={() => showDynAlert("warning")}>
            ⚠ 4 SEO Issues
          </button>
          <button className="btn btn-sapphire btn-sm">⌘ Command Palette</button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="bento">
        {/* 1: Page Views — Hero */}
        <MetricCard
          isHero
          pipColor="rgba(107,156,255,0.6)"
          title="Page Views"
          value={pageViews.toLocaleString()}
          label="This week · vs last week"
          trend="18.4%"
          trendUp
          sparkline={
            <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6b9cff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#6b9cff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,48 C25,42 50,22 80,28 C105,33 130,12 160,16 C178,19 192,8 200,5" stroke="#6b9cff" strokeWidth="1.5" fill="none" />
              <path d="M0,48 C25,42 50,22 80,28 C105,33 130,12 160,16 C178,19 192,8 200,5 L200,60 L0,60Z" fill="url(#g1)" />
            </svg>
          }
        />

        {/* 2: Active Users */}
        <MetricCard
          pipColor="var(--emerald2)"
          title="Active Users"
          value={activeUsers.toLocaleString()}
          label="Online right now"
          trend="9.2% this week"
          trendUp
          sparkline={
            <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
              <path d="M0,52 C30,46 60,28 95,20 C120,14 150,26 180,18 C190,15 197,10 200,8" stroke="var(--emerald2)" strokeWidth="2" fill="none" />
            </svg>
          }
        />

        {/* 3: Published Pages */}
        <MetricCard
          pipColor="var(--sapphire2)"
          title="Published Pages"
          value={publishedPages.toLocaleString()}
          label="347 total · 12 scheduled"
          trend="4.1% this month"
          trendUp
        />

        {/* 4: Load Time */}
        <div className="card s-3-2">
          <div className="card-inner">
            <div className="ctitle">
              <div className="ctitle-pip" style={{ background: "var(--amber2)" }} />
              Avg Load Time
            </div>
            <div className="metric-value" style={{ color: "var(--navy)" }}>
              1.34<span style={{ fontSize: 18, color: "var(--slate2)" }}>s</span>
            </div>
            <div className="metric-label">Core Web Vitals · Good</div>
            <div className="metric-trend t-dn" style={{ marginTop: 10 }}>↓ 2.3% slower</div>
          </div>
        </div>

        {/* 5: Traffic Chart */}
        <TrafficChart />

        {/* 6: Traffic Sources */}
        <TrafficSources />

        {/* 7: Quick Actions */}
        <QuickActions
          onPublish={() => showDynAlert("success")}
          onDeleteAlert={() => showDynAlert("error")}
        />

        {/* 8: Pages Table */}
        <PagesTable onNew={() => showDynAlert("success")} />

        {/* 9: Team Members */}
        <div className="card s-4-4">
          <div className="card-inner">
            <div className="ctitle" style={{ marginBottom: 10 }}>
              <div className="ctitle-pip" style={{ background: "var(--emerald2)" }} />
              Team Members
              <button className="btn btn-sapphire btn-xs" style={{ marginLeft: "auto" }}>
                + Invite
              </button>
            </div>
            <TeamList />
          </div>
        </div>

        {/* 10: Create Page Form */}
        <CreatePageForm onSuccess={() => showDynAlert("success")} />

        {/* 11: System Alerts */}
        <SystemAlerts />

        {/* 12: SEO + Activity (full width) */}
        <div className="card s-12-2" style={{ gridRow: "span 2" }}>
          <div className="card-inner" style={{ flexDirection: "row", gap: 0, padding: 0, alignItems: "stretch" }}>
            {/* SEO */}
            <div style={{ flex: 1, padding: "16px 20px", borderRight: "1px solid var(--line)" }}>
              <div className="ctitle" style={{ marginBottom: 12 }}>
                <div className="ctitle-pip" style={{ background: "var(--sapphire)" }} />
                SEO &amp; Site Health
              </div>
              <SEOGrid />
            </div>
            {/* Activity */}
            <div style={{ flex: 1, padding: "16px 20px" }}>
              <div className="ctitle" style={{ marginBottom: 10 }}>
                <div className="ctitle-pip" style={{ background: "var(--navy)" }} />
                Recent Activity
              </div>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}