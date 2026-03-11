"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Notification = {
  _id: string;
  type: string;
  lead_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export default function AdminWhatsAppPage() {
  const [pending, setPending] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch("/api/whatsapp/queue/stats")
      .then((r) => r.json())
      .then((d) => setPending(d.pending ?? 0))
      .catch(() => setPending(null));
    fetch("/api/whatsapp/notifications?unread=true")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => setNotifications([]));
  }, []);

  const processQueue = () => {
    setProcessing(true);
    fetch("/api/whatsapp/send", { method: "GET" })
      .then((r) => r.json())
      .then(() => {
        setPending((p) => Math.max(0, (p ?? 0) - 10));
        setProcessing(false);
      })
      .catch(() => setProcessing(false));
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">ABSECO WhatsApp Sales Engine</h1>
          <p className="text-sm text-slate-300">Automation, campaigns, and message history</p>
        </div>
        <Link href="/admin" className="text-sm text-slate-400 hover:text-white">← Admin</Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400">Queue pending</p>
          <p className="mt-1 text-xl font-semibold">{pending ?? "-"}</p>
          <button
            type="button"
            onClick={processQueue}
            disabled={processing || (pending ?? 0) === 0}
            className="mt-2 rounded bg-emerald-600 px-2 py-1 text-xs text-white disabled:opacity-50"
          >
            {processing ? "Processing…" : "Process queue"}
          </button>
        </div>
        <Link href="/admin/whatsapp/campaigns" className="glass-card block p-4 text-blue-300 hover:bg-white/5">
          <p className="text-xs text-slate-400">WhatsApp Campaigns</p>
          <p className="mt-1 font-medium">Create & send broadcasts →</p>
        </Link>
        <Link href="/admin/whatsapp/rules" className="glass-card block p-4 text-blue-300 hover:bg-white/5">
          <p className="text-xs text-slate-400">Automation Rules</p>
          <p className="mt-1 font-medium">Edit triggers & actions →</p>
        </Link>
        <Link href="/admin/whatsapp/history" className="glass-card block p-4 text-blue-300 hover:bg-white/5">
          <p className="text-xs text-slate-400">Message History</p>
          <p className="mt-1 font-medium">View conversations →</p>
        </Link>
      </div>

      <div className="glass-card p-4">
        <h2 className="text-sm font-semibold">Sales notifications</h2>
        <p className="text-xs text-slate-400">Consultation requests, quotations, site visits</p>
        <ul className="mt-3 space-y-2">
          {notifications.length === 0 && <li className="text-sm text-slate-500">No unread notifications</li>}
          {notifications.slice(0, 10).map((n) => (
            <li key={n._id} className="flex items-start justify-between border-t border-white/10 pt-2 text-sm">
              <div>
                <span className="font-medium">{n.title}</span>
                <span className="ml-2 text-slate-400">{n.body}</span>
              </div>
              <Link href={`/admin/leads?lead=${n.lead_id}`} className="text-blue-300">View lead</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
