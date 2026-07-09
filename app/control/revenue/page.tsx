"use client";

import { useEffect, useState } from "react";

type RevenueAnalytics = {
  metrics?: Record<string, number>;
  sourcePerformance?: Array<{ _id?: string; leads: number; average_score?: number }>;
  campaignPerformance?: Array<{ _id?: string; leads: number; average_score?: number }>;
};

const labels: Record<string, string> = {
  planner_to_proposal_pct: "Planner to Proposal",
  proposal_to_consultation_pct: "Proposal to Consultation",
  consultation_to_site_visit_pct: "Consultation to Site Visit",
  site_visit_to_proposal_approval_pct: "Site Visit to Approval",
  proposal_approval_pct: "Proposal Approval",
  average_sales_cycle_days: "Average Sales Cycle"
};

export default function ControlRevenuePage() {
  const [analytics, setAnalytics] = useState<RevenueAnalytics>({});

  useEffect(() => {
    fetch("/api/revenue/analytics")
      .then((response) => response.json())
      .then((data) => setAnalytics(data))
      .catch(() => setAnalytics({}));
  }, []);

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold">Revenue Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">
          Planner, proposal, consultation, site visit, and approval conversion metrics.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(analytics.metrics || {}).map(([key, value]) => (
          <div key={key} className="glass-card p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{labels[key] || key}</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {key.includes("pct") ? `${value}%` : value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Lead Source Performance</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(analytics.sourcePerformance || []).map((item) => (
              <p key={item._id || "unknown"}>
                {item._id || "Unknown"} | Leads {item.leads} | Avg score {Math.round(item.average_score || 0)}
              </p>
            ))}
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Campaign Performance</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(analytics.campaignPerformance || []).map((item) => (
              <p key={item._id || "unknown"}>
                {item._id || "Unknown"} | Leads {item.leads} | Avg score {Math.round(item.average_score || 0)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
