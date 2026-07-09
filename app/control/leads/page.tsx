"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Lead = {
  _id: string;
  name: string;
  phone: string;
  home_type: string;
  budget: string;
  lead_score?: number;
  lead_temperature?: string;
  status?: string;
  assigned_sales_rep?: string;
  lead_source?: string;
};

export default function ControlLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetch("/api/leads")
      .then((response) => response.json())
      .then((data) => setLeads(data.leads || []))
      .catch(() => setLeads([]));
  }, []);

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold">Lead CRM</h1>
        <p className="mt-1 text-sm text-slate-400">
          Qualified planner leads, score, assignment, and revenue status.
        </p>
      </div>

      <div className="glass-card overflow-x-auto p-5">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2">Lead</th>
              <th className="pb-2">Home</th>
              <th className="pb-2">Budget</th>
              <th className="pb-2">Score</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Assigned</th>
              <th className="pb-2">Source</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td className="py-3">
                  <p className="font-medium text-white">{lead.name}</p>
                  <p className="text-xs text-slate-500">{lead.phone}</p>
                </td>
                <td className="py-3 text-slate-300">{lead.home_type}</td>
                <td className="py-3 text-slate-300">{lead.budget}</td>
                <td className="py-3 text-slate-300">
                  {lead.lead_score || 0} / {lead.lead_temperature || "warm"}
                </td>
                <td className="py-3 text-slate-300">{lead.status || "new"}</td>
                <td className="py-3 text-slate-300">{lead.assigned_sales_rep || "-"}</td>
                <td className="py-3 text-slate-300">{lead.lead_source || "-"}</td>
                <td className="py-3">
                  <Link href={`/control/leads/${lead._id}`} className="text-xs font-semibold text-[#FF6A00]">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No leads yet.</p>}
      </div>
    </section>
  );
}
