"use client";

import { FormEvent, useState } from "react";

export default function ConsultationBookingPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      city: data.get("city"),
      property_type: data.get("property_type"),
      construction_stage: data.get("construction_stage"),
      consultation_type: data.get("consultation_type"),
      date: data.get("date"),
      time: data.get("time")
    };
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || "Failed to book consultation");
      } else {
        setMessage("Consultation booked. Our team will contact you.");
        form.reset();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6 pb-16">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
          Book Smart Home Consultation
        </h1>
        <p className="text-sm text-slate-400">
          Choose a time for an online consultation or a site visit by an ABSECO engineer.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card space-y-3 p-6 sm:p-8"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Name</label>
            <input
              name="name"
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Phone</label>
            <input
              name="phone"
              required
              type="tel"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">City</label>
            <input
              name="city"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Property Type</label>
            <input
              name="property_type"
              placeholder="Villa / Apartment / Office"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Construction Stage</label>
            <input
              name="construction_stage"
              placeholder="Planning / Under construction / Ready"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-slate-400">Consultation Type</label>
          <select
            name="consultation_type"
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
          >
            <option value="online">Online Consultation</option>
            <option value="site_visit">Site Visit</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Preferred Date</label>
            <input
              type="date"
              name="date"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Preferred Time</label>
            <input
              type="time"
              name="time"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {message && <p className="text-xs text-slate-300">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-[#FF6A00] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Booking..." : "Book Consultation"}
        </button>
      </form>
    </section>
  );
}

