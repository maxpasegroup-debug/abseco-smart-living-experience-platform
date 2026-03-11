"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

export function ConsultationForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          location: formData.get("city") || "",
          home_type: "Consultation",
          budget: "TBD",
          interest_level: "warm",
          referral_source: "showroom-consultation"
        })
      });
      setSent(true);
      form.reset();
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center"
      >
        <p className="font-display font-medium text-white">Thank you</p>
        <p className="mt-2 text-sm font-light text-slate-500">
          We will be in touch to schedule your consultation.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        required
        placeholder="Name"
        className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3.5 font-light text-white placeholder:text-slate-500 outline-none transition focus:border-[#FF6A00]/50 focus:ring-1 focus:ring-[#FF6A00]/30"
      />
      <input
        name="phone"
        required
        type="tel"
        placeholder="Phone"
        className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3.5 font-light text-white placeholder:text-slate-500 outline-none transition focus:border-[#FF6A00]/50 focus:ring-1 focus:ring-[#FF6A00]/30"
      />
      <input
        name="city"
        placeholder="City"
        className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3.5 font-light text-white placeholder:text-slate-500 outline-none transition focus:border-[#FF6A00]/50 focus:ring-1 focus:ring-[#FF6A00]/30"
      />
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full rounded-full bg-[#FF6A00] py-4 font-medium text-white shadow-orange transition-shadow hover:shadow-orange-hover disabled:opacity-60"
      >
        {loading ? "Sending..." : "Book Free Consultation"}
      </motion.button>
    </form>
  );
}
