"use client";

import { useEffect, useState } from "react";

type PlannerAnalytics = {
  started: number;
  completed: number;
  abandoned: number;
  mostSelectedRooms: { room: string; count: number }[];
  mostSelectedPackages: { packageName: string; count: number }[];
  budgetDistribution: { budget: string; count: number }[];
};

type PlannerSubmission = {
  _id: string;
  status: string;
  conversion_status: string;
  answers: {
    homeType?: string;
    rooms?: string[];
    lifestyles?: string[];
    budget?: string;
  };
  recommendation?: {
    packageName?: string;
    estimatedBudgetRange?: string;
  };
  lead_id?: string;
  proposal_id?: string;
  updated_at: string;
};

export default function ControlPlannerPage() {
  const [analytics, setAnalytics] = useState<PlannerAnalytics | null>(null);
  const [plans, setPlans] = useState<PlannerSubmission[]>([]);

  useEffect(() => {
    fetch("/api/planner/analytics")
      .then((response) => response.json())
      .then((data) => setAnalytics(data))
      .catch(() => setAnalytics(null));
    fetch("/api/planner/plans")
      .then((response) => response.json())
      .then((data) => setPlans(data.plans || []))
      .catch(() => setPlans([]));
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Smart Home Planner</h1>
        <p className="text-sm text-slate-300">
          Unified planner submissions, recommendation summaries, and conversion status.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400">Planner Started</p>
          <p className="mt-1 text-xl font-semibold">{analytics?.started ?? "-"}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400">Planner Completed</p>
          <p className="mt-1 text-xl font-semibold">{analytics?.completed ?? "-"}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400">Planner Abandoned</p>
          <p className="mt-1 text-xl font-semibold">{analytics?.abandoned ?? "-"}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card p-4">
          <p className="text-sm font-semibold">Most Selected Rooms</p>
          <div className="mt-3 space-y-1 text-xs text-slate-300">
            {(analytics?.mostSelectedRooms || []).map((item) => (
              <p key={item.room}>{item.room} - {item.count}</p>
            ))}
          </div>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm font-semibold">Most Selected Packages</p>
          <div className="mt-3 space-y-1 text-xs text-slate-300">
            {(analytics?.mostSelectedPackages || []).map((item) => (
              <p key={item.packageName}>{item.packageName} - {item.count}</p>
            ))}
          </div>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm font-semibold">Budget Distribution</p>
          <div className="mt-3 space-y-1 text-xs text-slate-300">
            {(analytics?.budgetDistribution || []).map((item) => (
              <p key={item.budget}>{item.budget} - {item.count}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <table className="min-w-full text-left text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-2">Updated</th>
              <th className="pb-2">Home</th>
              <th className="pb-2">Rooms</th>
              <th className="pb-2">Package</th>
              <th className="pb-2">Budget</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Linked</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id} className="border-t border-white/10">
                <td className="py-2 text-slate-400">{new Date(plan.updated_at).toLocaleString()}</td>
                <td className="py-2">{plan.answers?.homeType || "-"}</td>
                <td className="py-2">{(plan.answers?.rooms || []).join(", ") || "-"}</td>
                <td className="py-2">{plan.recommendation?.packageName || "-"}</td>
                <td className="py-2">{plan.recommendation?.estimatedBudgetRange || plan.answers?.budget || "-"}</td>
                <td className="py-2">{plan.status} / {plan.conversion_status}</td>
                <td className="py-2 text-slate-400">
                  Lead {plan.lead_id || "-"} | Proposal {plan.proposal_id || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {plans.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No planner submissions yet.</p>}
      </div>
    </section>
  );
}
