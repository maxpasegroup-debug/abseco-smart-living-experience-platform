"use client";

import { useEffect, useState } from "react";

type Proposal = {
  _id: string;
  lead_id: string;
  property_type: string;
  status: string;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  currency: string;
  created_at: string;
};

export default function ControlProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    fetch("/api/proposals")
      .then((r) => r.json())
      .then((d) => setProposals(d.proposals || []))
      .catch(() => setProposals([]));
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Proposals</h1>
          <p className="text-sm text-slate-300">
            Smart home proposals created after consultations and site visits.
          </p>
        </div>
        <a
          href="/control/proposals/create"
          className="rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-semibold text-white"
        >
          Create Proposal
        </a>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <table className="min-w-full text-left text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-2">Lead</th>
              <th className="pb-2">Property</th>
              <th className="pb-2">Value</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p._id} className="border-t border-white/10">
                <td className="py-2 text-slate-300">{p.lead_id}</td>
                <td className="py-2">{p.property_type}</td>
                <td className="py-2">
                  {p.estimated_cost_min && p.estimated_cost_max
                    ? `${p.currency} ${p.estimated_cost_min.toLocaleString()} – ${p.estimated_cost_max.toLocaleString()}`
                    : "—"}
                </td>
                <td className="py-2">
                  <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-200">
                    {p.status}
                  </span>
                </td>
                <td className="py-2 text-slate-400">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {proposals.length === 0 && (
          <p className="py-4 text-center text-xs text-slate-500">
            No proposals yet.
          </p>
        )}
      </div>
    </section>
  );
}

