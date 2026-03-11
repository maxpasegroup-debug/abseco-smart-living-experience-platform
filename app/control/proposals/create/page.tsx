"use client";

import { FormEvent, useEffect, useState } from "react";

type Lead = { _id: string; name: string; home_type: string; budget: string };

const CATEGORIES = [
  "Smart Lighting",
  "Smart Curtains",
  "Smart Security",
  "Voice Automation",
  "Home Theatre",
  "Energy Monitoring"
];

const ROOMS = ["Living Room", "Bedroom", "Kitchen", "Home Theatre", "Security Zones", "Outdoor"];

export default function CreateProposalPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadId, setLeadId] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .catch(() => setLeads([]));
  }, []);

  function toggle(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          property_type: propertyType,
          rooms,
          automation_categories: categories,
          estimated_cost_min: minCost ? Number(minCost) : undefined,
          estimated_cost_max: maxCost ? Number(maxCost) : undefined,
          currency: "INR"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to create proposal");
      } else {
        setMessage("Proposal created.");
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Create Proposal</h1>
          <p className="text-sm text-slate-300">
            Choose a lead, property type, rooms and automation categories.
          </p>
        </div>
        <a href="/control/proposals" className="text-xs text-slate-400 hover:text-white">
          ← Back to proposals
        </a>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
        <div className="space-y-2">
          <label className="block text-xs text-slate-400">Customer</label>
          <select
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
          >
            <option value="">Select lead</option>
            {leads.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name} – {l.home_type} – {l.budget}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-slate-400">Property type</label>
          <input
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            placeholder="Villa / Apartment / Office"
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-slate-400">Rooms</label>
          <div className="flex flex-wrap gap-2">
            {ROOMS.map((room) => {
              const active = rooms.includes(room);
              return (
                <button
                  key={room}
                  type="button"
                  onClick={() => setRooms((prev) => toggle(prev, room))}
                  className={`rounded-full px-3 py-1 text-xs ${
                    active ? "bg-[#FF6A00] text-white" : "bg-white/5 text-slate-300"
                  }`}
                >
                  {room}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-slate-400">Automation categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategories((prev) => toggle(prev, cat))}
                  className={`rounded-full px-3 py-1 text-xs ${
                    active ? "bg-blue-500 text-white" : "bg-white/5 text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Estimated min (₹)</label>
            <input
              value={minCost}
              onChange={(e) => setMinCost(e.target.value)}
              type="number"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Estimated max (₹)</label>
            <input
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
              type="number"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {message && <p className="text-xs text-slate-300">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-full rounded-full bg-[#FF6A00] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create Proposal"}
        </button>
      </form>
    </section>
  );
}

