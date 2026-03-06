"use client";

import { useMemo, useState } from "react";
import { DesignerInput, HomeType, Priority } from "@/lib/types";
import { formatCurrencyRange } from "@/lib/utils/format";
import { GlassCard } from "@/ui/GlassCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { AuthGateModal } from "./AuthGateModal";
import { generateRecommendation } from "@/features/ai-designer/recommendation";

const homeTypes: HomeType[] = ["Villa", "Apartment", "Office"];
const priorities: Priority[] = ["Luxury", "Security", "Energy saving", "Entertainment"];

export function AIWizard() {
  const [form, setForm] = useState<DesignerInput>({
    homeType: "Villa",
    rooms: 5,
    budget: 60000,
    priority: "Luxury"
  });
  const [authAction, setAuthAction] = useState<"" | "save your plan" | "request a proposal">("");

  const recommendation = useMemo(() => generateRecommendation(form), [form]);

  return (
    <>
      <GlassCard>
        <h1 className="text-xl font-semibold">AI Smart Home Designer</h1>
        <p className="mt-2 text-sm text-slate-300">
          Answer a few questions and get an instant automation recommendation.
        </p>
        <div className="mt-5 space-y-4">
          <label className="block text-sm">
            Home Type
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-2"
              value={form.homeType}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, homeType: event.target.value as HomeType }))
              }
            >
              {homeTypes.map((type) => (
                <option key={type} value={type} className="bg-slate-900">
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            Number of Rooms
            <input
              type="number"
              min={1}
              max={20}
              value={form.rooms}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, rooms: Number(event.target.value) || 1 }))
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-2"
            />
          </label>

          <label className="block text-sm">
            Budget Range (AED)
            <input
              type="range"
              min={18000}
              max={250000}
              step={1000}
              value={form.budget}
              onChange={(event) => setForm((prev) => ({ ...prev, budget: Number(event.target.value) }))}
              className="mt-2 w-full accent-abseco-orange"
            />
            <p className="text-xs text-slate-300">{formatCurrencyRange(form.budget)}</p>
          </label>

          <label className="block text-sm">
            Priority
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-2"
              value={form.priority}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, priority: event.target.value as Priority }))
              }
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority} className="bg-slate-900">
                  {priority}
                </option>
              ))}
            </select>
          </label>
        </div>
      </GlassCard>

      <GlassCard className="mt-4 border border-abseco-orange/30">
        <p className="text-xs uppercase tracking-[0.14em] text-abseco-orange">AI Recommendation</p>
        <h2 className="mt-2 text-lg font-semibold">{recommendation.packageName}</h2>
        <p className="mt-2 text-sm text-slate-300">
          Designed for {form.rooms} rooms in a {form.homeType.toLowerCase()} with focus on{" "}
          {form.priority.toLowerCase()}.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          {recommendation.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
          <li>Estimated range: {recommendation.estimatedRange}</li>
        </ul>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <PrimaryButton onClick={() => setAuthAction("save your plan")}>Save Plan</PrimaryButton>
          <PrimaryButton className="bg-blue-600 shadow-glow" onClick={() => setAuthAction("request a proposal")}>
            Request Proposal
          </PrimaryButton>
        </div>
      </GlassCard>

      <AuthGateModal isOpen={authAction !== ""} actionLabel={authAction} onClose={() => setAuthAction("")} />
    </>
  );
}
