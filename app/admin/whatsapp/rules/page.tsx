"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Rule = {
  _id: string;
  name: string;
  trigger: string;
  action: string;
  delay_minutes?: number;
  enabled: boolean;
};

export default function WhatsAppRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    fetch("/api/whatsapp/rules")
      .then((r) => r.json())
      .then((d) => setRules(d.rules || []))
      .catch(() => setRules([]));
  }, []);

  const toggleEnabled = (id: string, enabled: boolean) => {
    fetch(`/api/whatsapp/rules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled })
    })
      .then((r) => r.json())
      .then((d) => setRules((prev) => prev.map((r) => (r._id === id ? { ...r, enabled: d.rule.enabled } : r))))
      .catch(() => {});
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Automation Rules</h1>
          <p className="text-sm text-slate-300">Trigger → action rules for welcome, follow-up, handover</p>
        </div>
        <Link href="/admin/whatsapp" className="text-sm text-slate-400 hover:text-white">← WhatsApp</Link>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Trigger</th>
              <th className="pb-2">Action</th>
              <th className="pb-2">Delay (min)</th>
              <th className="pb-2">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r._id} className="border-t border-white/10">
                <td className="py-2 font-medium">{r.name}</td>
                <td className="py-2">{r.trigger}</td>
                <td className="py-2">{r.action}</td>
                <td className="py-2">{r.delay_minutes ?? 0}</td>
                <td className="py-2">
                  <button
                    type="button"
                    onClick={() => toggleEnabled(r._id, !r.enabled)}
                    className={`rounded px-2 py-1 text-xs ${r.enabled ? "bg-emerald-600 text-white" : "bg-slate-600 text-slate-300"}`}
                  >
                    {r.enabled ? "On" : "Off"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rules.length === 0 && <p className="py-4 text-center text-slate-500">No rules. Create via API.</p>}
      </div>

      <div className="glass-card p-4">
        <p className="text-sm text-slate-400">
          Create/edit via <code className="rounded bg-white/10 px-1">POST /api/whatsapp/rules</code> and <code className="rounded bg-white/10 px-1">PATCH /api/whatsapp/rules/[id]</code>. Triggers: new_lead, no_reply, keyword, consultation_request. Actions: send_message, create_consultation, mark_qualified, notify_sales.
        </p>
      </div>
    </section>
  );
}
