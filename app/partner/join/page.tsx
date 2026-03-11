"use client";

import { FormEvent, useState } from "react";
import { GlassCard } from "@/ui/GlassCard";
import { PrimaryButton } from "@/ui/PrimaryButton";

const professions = [
  "Electrician",
  "Interior Designer",
  "Builder",
  "Architect",
  "CCTV Installer",
  "Solar Installer",
  "Smart Appliance Dealer"
];

export default function PartnerJoinPage() {
  const [submitted, setSubmitted] = useState<null | {
    partner_id: string;
    referral_link: string;
    dashboard: string;
  }>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const response = await fetch("/api/partner/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          profession: formData.get("profession"),
          city: formData.get("city"),
          years_experience: Number(formData.get("years_experience")),
          company_name: formData.get("company_name")
        })
      });
      const result = await response.json();
      if (result.ok) {
        setSubmitted(result.partner);
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="space-y-4">
        <GlassCard className="space-y-3">
          <h1 className="text-xl font-semibold">Partner Approved</h1>
          <p className="text-sm text-slate-300">Welcome to the ABSECO Partner Growth Engine.</p>
          <p className="text-sm">Partner ID: {submitted.partner_id}</p>
          <p className="break-all text-sm text-blue-300">{submitted.referral_link}</p>
          <a href={submitted.dashboard}>
            <PrimaryButton className="w-full">Open Partner Dashboard</PrimaryButton>
          </a>
        </GlassCard>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Join as Referral Partner</h1>
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            required
            placeholder="Name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          />
          <input
            name="phone"
            required
            placeholder="Phone"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          />
          <select
            name="profession"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            defaultValue=""
          >
            <option value="" disabled className="bg-slate-900">
              Profession
            </option>
            {professions.map((profession) => (
              <option key={profession} value={profession} className="bg-slate-900">
                {profession}
              </option>
            ))}
          </select>
          <input
            name="city"
            required
            placeholder="City"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          />
          <input
            name="years_experience"
            required
            type="number"
            min={0}
            placeholder="Years of experience"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          />
          <input
            name="company_name"
            placeholder="Company name (optional)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          />
          <PrimaryButton className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Join Partner Network"}
          </PrimaryButton>
        </form>
      </GlassCard>
    </section>
  );
}
