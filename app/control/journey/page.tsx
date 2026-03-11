"use client";

import { useEffect, useState } from "react";

type FunnelStep = { name: string; count: number };

type CampaignStat = { source: string; leads: number; consultations: number; deals: number };
type InterestStat = { category: string; percent: number };

export default function JourneyDashboardPage() {
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignStat[]>([]);
  const [interest, setInterest] = useState<InterestStat[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/journey/funnel")
      .then((r) => r.json())
      .then((d) => setFunnel(d.steps || []))
      .catch(() => setFunnel([]));

    fetch("/api/journey/analytics")
      .then((r) => r.json())
      .then((d) => {
        setCampaigns(d.campaigns || []);
        setInterest(d.product_interest || []);
        setInsights(d.insights || []);
      })
      .catch(() => {
        setCampaigns([]);
        setInterest([]);
        setInsights([]);
      });
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Customer Journey Intelligence</h1>
        <p className="text-sm text-slate-300">
          Funnel from showroom open to proposal acceptance and installations.
        </p>
      </div>

      <div className="glass-card p-4">
        <p className="text-sm font-semibold">Conversion Funnel</p>
        <div className="mt-4 space-y-2">
          {funnel.map((step) => (
            <div key={step.name} className="flex items-center gap-3">
              <div className="w-40 text-xs text-slate-400">{step.name}</div>
              <div className="flex-1">
                <div
                  className="h-2 rounded-full bg-[#FF6A00]/20"
                  style={{ maxWidth: "100%" }}
                >
                  <div
                    className="h-2 rounded-full bg-[#FF6A00]"
                    style={{ width: `${Math.min(100, step.count || 0) || 2}%` }}
                  />
                </div>
              </div>
              <div className="w-10 text-right text-xs text-slate-200">{step.count}</div>
            </div>
          ))}
          {funnel.length === 0 && (
            <p className="text-xs text-slate-500">No journey data yet.</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card p-4">
          <p className="text-sm font-semibold">Lead Sources</p>
          <div className="mt-3 space-y-2 text-xs">
            {campaigns.map((c) => (
              <div key={c.source} className="flex justify-between">
                <span className="text-slate-300">{c.source || "Unknown"}</span>
                <span className="text-slate-400">
                  Leads {c.leads} · Consultations {c.consultations} · Deals {c.deals}
                </span>
              </div>
            ))}
            {campaigns.length === 0 && (
              <p className="text-xs text-slate-500">No source data yet.</p>
            )}
          </div>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm font-semibold">Product Interest</p>
          <div className="mt-3 space-y-2 text-xs">
            {interest.map((i) => (
              <div key={i.category} className="flex items-center gap-3">
                <span className="w-32 text-slate-300">{i.category}</span>
                <div className="flex-1">
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{ width: `${i.percent}%` }}
                    />
                  </div>
                </div>
                <span className="w-8 text-right text-slate-400">{i.percent}%</span>
              </div>
            ))}
            {interest.length === 0 && (
              <p className="text-xs text-slate-500">No interest data yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-4">
        <p className="text-sm font-semibold">Automated Insights</p>
        <ul className="mt-3 space-y-1 text-xs text-slate-300">
          {insights.map((ins) => (
            <li key={ins}>• {ins}</li>
          ))}
          {insights.length === 0 && (
            <li className="text-xs text-slate-500">No insights yet. Data will appear as traffic grows.</li>
          )}
        </ul>
      </div>
    </section>
  );
}

