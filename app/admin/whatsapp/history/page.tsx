"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Message = {
  _id: string;
  lead_id: string;
  sender: string;
  message: string;
  timestamp: string;
};

type Lead = {
  _id: string;
  name: string;
  phone: string;
};

export default function WhatsAppHistoryPage() {
  const [leadId, setLeadId] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .catch(() => setLeads([]));
  }, []);

  useEffect(() => {
    if (!leadId) {
      setMessages([]);
      return;
    }
    fetch(`/api/whatsapp/history?lead_id=${encodeURIComponent(leadId)}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => setMessages([]));
  }, [leadId]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Message History</h1>
          <p className="text-sm text-slate-300">View WhatsApp conversation per lead</p>
        </div>
        <Link href="/admin/whatsapp" className="text-sm text-slate-400 hover:text-white">← WhatsApp</Link>
      </div>

      <div className="glass-card p-4">
        <label className="block text-sm text-slate-400">Select lead</label>
        <select
          value={leadId}
          onChange={(e) => setLeadId(e.target.value)}
          className="mt-1 w-full max-w-xs rounded border border-white/20 bg-white/5 px-3 py-2 text-sm"
        >
          <option value="">— Choose lead —</option>
          {leads.map((l) => (
            <option key={l._id} value={l._id}>{l.name} — {l.phone}</option>
          ))}
        </select>
      </div>

      <div className="glass-card p-4">
        <h2 className="text-sm font-semibold">Conversation</h2>
        <ul className="mt-3 space-y-2">
          {messages.length === 0 && <li className="text-sm text-slate-500">{leadId ? "No messages" : "Select a lead"}</li>}
          {messages.map((m) => (
            <li key={m._id} className={`rounded p-2 text-sm ${m.sender === "lead" ? "bg-blue-900/30 ml-4" : "bg-slate-700/30 mr-4"}`}>
              <span className="text-xs text-slate-400">{m.sender}</span>
              <span className="mx-2">·</span>
              <span className="text-xs text-slate-500">{new Date(m.timestamp).toLocaleString()}</span>
              <p className="mt-1 whitespace-pre-wrap">{m.message}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
