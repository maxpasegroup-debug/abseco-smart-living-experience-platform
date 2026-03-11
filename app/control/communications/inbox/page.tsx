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

type Message = {
  _id: string;
  sender: "lead" | "system" | "sales";
  message: string;
  timestamp: string;
};

export default function CommunicationsInboxPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []))
      .catch(() => setContacts([]));
  }, []);

  useEffect(() => {
    if (!activeLeadId) {
      setMessages([]);
      return;
    }
    fetch(`/api/messages/history?lead_id=${encodeURIComponent(activeLeadId)}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => setMessages([]));
  }, [activeLeadId]);

  async function sendMessage() {
    if (!activeLeadId || !text.trim()) return;
    const body = { lead_id: activeLeadId, text };
    setText("");
    await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    // refresh
    fetch(`/api/messages/history?lead_id=${encodeURIComponent(activeLeadId)}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => setMessages([]));
  }

  const activeContact = contacts.find((c) => c.id === activeLeadId);

  return (
    <section className="grid gap-4 md:grid-cols-[260px_minmax(0,1.3fr)_minmax(0,0.9fr)]">
      {/* Left panel: contacts */}
      <div className="glass-card flex h-[70vh] flex-col overflow-hidden">
        <div className="border-b border-white/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Contacts
          </p>
        </div>
        <div className="flex-1 overflow-y-auto text-xs">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveLeadId(c.id)}
              className={`flex w-full flex-col items-start gap-0.5 border-b border-white/5 px-3 py-2 text-left ${
                activeLeadId === c.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <span className="text-slate-100">{c.name}</span>
              <span className="text-[10px] text-slate-400">
                {c.city} · {c.phone}
              </span>
              {typeof c.lead_score === "number" && (
                <span className="text-[10px] text-slate-400">
                  Score {c.lead_score} · {c.temperature?.toUpperCase()}
                </span>
              )}
            </button>
          ))}
          {contacts.length === 0 && (
            <p className="p-3 text-xs text-slate-500">No contacts yet.</p>
          )}
        </div>
      </div>

      {/* Center: conversation */}
      <div className="glass-card flex h-[70vh] flex-col overflow-hidden">
        <div className="border-b border-white/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Conversation
          </p>
          {activeContact && (
            <p className="mt-1 text-xs text-slate-300">
              {activeContact.name} · {activeContact.phone}
            </p>
          )}
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-3 text-xs">
          {!activeLeadId && (
            <p className="text-xs text-slate-500">Select a contact to view messages.</p>
          )}
          {messages.map((m) => (
            <div
              key={m._id}
              className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                m.sender === "lead" ? "ml-0 bg-blue-900/40" : "ml-auto bg-slate-700/60"
              }`}
            >
              <p className="text-[10px] text-slate-300">
                {m.sender} · {new Date(m.timestamp).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-100 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
        {activeLeadId && (
          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a WhatsApp reply..."
                className="flex-1 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs outline-none"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="rounded-full bg-[#FF6A00] px-3 py-2 text-[11px] font-semibold text-white"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: lead details */}
      <div className="glass-card h-[70vh] overflow-y-auto p-4 text-xs">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Lead details
        </p>
        {activeContact ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-slate-100">{activeContact.name}</p>
            <p className="text-slate-400">{activeContact.city}</p>
            <p className="text-slate-400">{activeContact.phone}</p>
            {typeof activeContact.lead_score === "number" && (
              <p className="mt-2 text-slate-300">
                Score {activeContact.lead_score} ·{" "}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    activeContact.temperature === "hot"
                      ? "bg-red-500/30 text-red-100"
                      : activeContact.temperature === "warm"
                      ? "bg-amber-400/30 text-amber-100"
                      : "bg-slate-600/40 text-slate-100"
                  }`}
                >
                  {activeContact.temperature?.toUpperCase() || "COLD"}
                </span>
              </p>
            )}
            <p className="mt-2 text-slate-400">
              Interest: {activeContact.interest || "—"}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">Select a contact to see details.</p>
        )}
      </div>
    </section>
  );
}

