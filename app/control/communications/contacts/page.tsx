"use client";

import { useEffect, useState } from "react";

type Contact = {
  id: string;
  name: string;
  phone: string;
  city: string;
  lead_score?: number;
  temperature?: string;
  interest?: string;
  last_interaction?: string;
};

export default function CommunicationsContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []))
      .catch(() => setContacts([]));
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Contacts</h1>
        <p className="text-sm text-slate-300">
          Leads, customers, and prospects reachable through WhatsApp.
        </p>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <table className="min-w-full text-left text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Phone</th>
              <th className="pb-2">City</th>
              <th className="pb-2">Score</th>
              <th className="pb-2">Interest</th>
              <th className="pb-2">Last interaction</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="py-2 text-slate-100">{c.name}</td>
                <td className="py-2 text-slate-300">{c.phone}</td>
                <td className="py-2 text-slate-300">{c.city}</td>
                <td className="py-2 text-slate-300">
                  {typeof c.lead_score === "number" ? c.lead_score : "—"}{" "}
                  {c.temperature && (
                    <span className="ml-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-200">
                      {c.temperature}
                    </span>
                  )}
                </td>
                <td className="py-2 text-slate-300">{c.interest || "—"}</td>
                <td className="py-2 text-slate-400">
                  {c.last_interaction
                    ? new Date(c.last_interaction).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <p className="py-4 text-center text-xs text-slate-500">No contacts yet.</p>
        )}
      </div>
    </section>
  );
}

