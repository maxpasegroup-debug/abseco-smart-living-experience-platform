"use client";

import { useEffect, useState } from "react";

type Consultation = {
  _id: string;
  lead_id: string;
  consultation_type: string;
  date?: string;
  time?: string;
  city?: string;
  property_type?: string;
  status: string;
};

export default function ControlConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    fetch("/api/consultations")
      .then((r) => r.json())
      .then((d) => setConsultations(d.consultations || []))
      .catch(() => setConsultations([]));
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Consultations</h1>
        <p className="text-sm text-slate-300">
          Upcoming and recent smart home consultations booked by leads.
        </p>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <table className="min-w-full text-left text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-2">Lead</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">City</th>
              <th className="pb-2">Property</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Time</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((c) => (
              <tr key={c._id} className="border-t border-white/10">
                <td className="py-2 text-slate-300">{c.lead_id}</td>
                <td className="py-2 text-slate-300">{c.consultation_type}</td>
                <td className="py-2 text-slate-300">{c.city || "—"}</td>
                <td className="py-2 text-slate-300">{c.property_type || "—"}</td>
                <td className="py-2 text-slate-300">{c.date || "—"}</td>
                <td className="py-2 text-slate-300">{c.time || "—"}</td>
                <td className="py-2 text-slate-200">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {consultations.length === 0 && (
          <p className="py-4 text-center text-xs text-slate-500">No consultations yet.</p>
        )}
      </div>
    </section>
  );
}

