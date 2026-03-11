"use client";

import { useEffect, useState } from "react";

type Stat = { label: string; value: number };

export default function CommunicationsAnalyticsPage() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    // Simple bridge to journey analytics for now
    fetch("/api/journey/analytics")
      .then((r) => r.json())
      .then((d) => {
        const consultationsBooked =
          (d.campaigns || []).reduce(
            (sum: number, c: { consultations?: number }) =>
              sum + (c.consultations || 0),
            0
          ) || 0;
        const deals =
          (d.campaigns || []).reduce(
            (sum: number, c: { deals?: number }) => sum + (c.deals || 0),
            0
          ) || 0;
        setStats([
          { label: "Consultations booked (by source)", value: consultationsBooked },
          { label: "Deals closed (by source)", value: deals },
          { label: "Sources tracked", value: (d.campaigns || []).length || 0 }
        ]);
      })
      .catch(() => setStats([]));
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Communications Analytics</h1>
        <p className="text-sm text-slate-300">
          High-level performance of WhatsApp conversations, consultations, and deals.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-4">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{s.value}</p>
          </div>
        ))}
        {stats.length === 0 && (
          <p className="text-xs text-slate-500">
            No analytics yet. Data will appear as leads and conversations grow.
          </p>
        )}
      </div>
    </section>
  );
}

