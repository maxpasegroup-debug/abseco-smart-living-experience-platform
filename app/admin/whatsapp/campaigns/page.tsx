"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Campaign = {
  _id: string;
  title: string;
  message: string;
  segment: string;
  status: string;
  sent_at?: string;
};

export default function WhatsAppCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/whatsapp/campaigns")
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns || []))
      .catch(() => setCampaigns([]));
  }, []);

  const sendCampaign = (id: string) => {
    setSending(id);
    fetch(`/api/whatsapp/campaigns/${id}/send`, { method: "POST" })
      .then((r) => r.json())
      .then(() => {
        setCampaigns((prev) => prev.map((c) => (c._id === id ? { ...c, status: "sent" } : c)));
        setSending(null);
      })
      .catch(() => setSending(null));
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">WhatsApp Campaigns</h1>
          <p className="text-sm text-slate-300">Broadcast to segments: all leads, new, active, customers</p>
        </div>
        <Link href="/admin/whatsapp" className="text-sm text-slate-400 hover:text-white">← WhatsApp</Link>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-2">Title</th>
              <th className="pb-2">Segment</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Sent</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="border-t border-white/10">
                <td className="py-2 font-medium">{c.title}</td>
                <td className="py-2">{c.segment}</td>
                <td className="py-2">{c.status}</td>
                <td className="py-2">{c.sent_at ? new Date(c.sent_at).toLocaleString() : "-"}</td>
                <td className="py-2">
                  {c.status !== "sent" && (
                    <button
                      type="button"
                      onClick={() => sendCampaign(c._id)}
                      disabled={sending === c._id}
                      className="rounded bg-emerald-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                    >
                      {sending === c._id ? "Sending…" : "Send now"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {campaigns.length === 0 && <p className="py-4 text-center text-slate-500">No campaigns. Create via API or add a form here.</p>}
      </div>

      <div className="glass-card p-4">
        <p className="text-sm text-slate-400">
          Create campaigns via <code className="rounded bg-white/10 px-1">POST /api/whatsapp/campaigns</code> with title, message, segment (all_leads | new_leads | active_prospects | customers).
        </p>
      </div>
    </section>
  );
}
