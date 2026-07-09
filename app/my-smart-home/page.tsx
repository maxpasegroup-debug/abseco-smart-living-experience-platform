"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Plan = {
  _id: string;
  status: string;
  answers?: { homeType?: string; rooms?: string[]; lifestyles?: string[]; goals?: string[] };
  recommendation?: { packageName?: string; estimatedBudgetRange?: string; futureUpgrades?: string[] };
  structured_plan?: { selectedRooms?: string[]; experiences?: string[]; futureUpgradeSuggestions?: string[] };
};

export default function MySmartHomePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/customer/planner")
      .then((response) => response.json())
      .then((data) => setPlans(data.plans || []))
      .catch(() => setPlans([]));
  }, []);

  async function duplicatePlan(planId: string) {
    const response = await fetch("/api/customer/planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate", plan_id: planId })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error?.message || "Unable to duplicate plan.");
      return;
    }
    setPlans((current) => [data.plan, ...current]);
    setMessage("Plan duplicated.");
  }

  const current = plans[0];

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">My Smart Home</h1>
        <p className="mt-1 text-sm text-slate-400">Your home type, rooms, lifestyle, package, and upgrade path.</p>
      </div>

      <div className="glass-card space-y-4 p-6">
        <h2 className="text-lg font-semibold text-white">{current?.recommendation?.packageName || "No active plan yet"}</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p><span className="text-slate-500">Home Type</span><br />{current?.answers?.homeType || "-"}</p>
          <p><span className="text-slate-500">Budget</span><br />{current?.recommendation?.estimatedBudgetRange || "-"}</p>
          <p><span className="text-slate-500">Rooms</span><br />{(current?.structured_plan?.selectedRooms || current?.answers?.rooms || []).join(", ") || "-"}</p>
          <p><span className="text-slate-500">Lifestyle</span><br />{(current?.answers?.lifestyles || []).join(", ") || "-"}</p>
          <p><span className="text-slate-500">Experiences</span><br />{(current?.structured_plan?.experiences || []).join(", ") || "-"}</p>
          <p><span className="text-slate-500">Future Upgrades</span><br />{(current?.structured_plan?.futureUpgradeSuggestions || current?.recommendation?.futureUpgrades || []).join(", ") || "-"}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <Link href="/build" className="rounded-full bg-[#FF6A00] px-5 py-2 font-semibold text-white">Edit Plan</Link>
          {current && (
            <button onClick={() => duplicatePlan(current._id)} className="rounded-full border border-white/20 px-5 py-2 font-semibold text-slate-200">
              Duplicate Plan
            </button>
          )}
          <button onClick={() => window.print()} className="rounded-full border border-white/20 px-5 py-2 font-semibold text-slate-200">
            Download Summary
          </button>
        </div>
        {message && <p className="text-xs text-slate-300">{message}</p>}
      </div>
    </section>
  );
}
