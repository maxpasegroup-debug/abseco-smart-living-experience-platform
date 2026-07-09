"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlanner } from "@/lib/context/PlannerContext";
import { useSmartPlan } from "@/lib/context/SmartPlanContext";
import {
  plannerBudgets,
  plannerGoals,
  plannerHomeTypes,
  plannerLifestyles,
  plannerRooms
} from "@/features/planner/options";
import {
  buildStructuredPlan,
  generatePlannerRecommendation
} from "@/features/planner/recommendation";
import { GlassCard } from "@/ui/GlassCard";
import { PrimaryButton } from "@/ui/PrimaryButton";

const TOTAL_STEPS = 7;
const familyOptions: Array<{ key: "children" | "parents" | "pets"; label: string }> = [
  { key: "children", label: "Children" },
  { key: "parents", label: "Parents" },
  { key: "pets", label: "Pets" }
];
const contactMethods = [
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "video", label: "Video" }
] as const;
const buyingTimelines = ["Immediately", "1-3 Months", "3-6 Months", "6+ Months"];

type UnifiedSmartHomePlannerProps = {
  entry?: "build" | "dream" | "ai-designer";
};

function trackPlannerEvent(event_name: string, metadata?: Record<string, unknown>) {
  fetch("/api/journey/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_name, metadata })
  }).catch(() => {});
}

export function UnifiedSmartHomePlanner({ entry = "build" }: UnifiedSmartHomePlannerProps) {
  const {
    plan,
    setStep,
    updateAnswers,
    updateFamily,
    toggleListValue,
    completePlan,
    saveDraft
  } = usePlanner();
  const { addItem } = useSmartPlan();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    trackPlannerEvent("planner_started", { entry });
  }, [entry]);

  useEffect(() => {
    function handleBeforeUnload() {
      if (plan.status === "completed") return;
      const payload = JSON.stringify({
        event_name: "planner_abandoned",
        metadata: { entry, step: plan.currentStep }
      });
      navigator.sendBeacon?.("/api/journey/event", new Blob([payload], { type: "application/json" }));
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [entry, plan.currentStep, plan.status]);

  const recommendation = useMemo(
    () => plan.recommendation || generatePlannerRecommendation(plan.answers),
    [plan.answers, plan.recommendation]
  );
  const structuredPlan = useMemo(
    () => plan.structuredPlan || buildStructuredPlan(plan.answers, recommendation),
    [plan.answers, plan.structuredPlan, recommendation]
  );

  const progress = Math.round((plan.currentStep / TOTAL_STEPS) * 100);

  const canNext =
    (plan.currentStep === 1 && Boolean(plan.answers.homeType)) ||
    (plan.currentStep === 2 && plan.answers.rooms.length > 0) ||
    (plan.currentStep === 3 && plan.answers.lifestyles.length > 0) ||
    (plan.currentStep === 4 && Boolean(plan.answers.family.members)) ||
    (plan.currentStep === 5 && Boolean(plan.answers.budget)) ||
    (plan.currentStep === 6 && plan.answers.goals.length > 0) ||
    plan.currentStep === 7;

  async function handleSaveDraft() {
    await saveDraft();
    trackPlannerEvent("planner_draft_saved", { step: plan.currentStep, entry });
    setMessage("Draft saved. You can resume this planner later.");
  }

  async function handleComplete() {
    const completed = completePlan();
    completed.recommendation?.recommendedExperiences.forEach((experience) => {
      addItem({
        id: `planner-${experience.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        title: experience,
        category: "Planner Recommendation",
        estimatedRange: completed.recommendation?.estimatedBudgetRange
      });
    });
    const session = await fetch("/api/auth/session").then((r) => (r.ok ? r.json() : null)).catch(() => null);
    if (session?.user) {
      const result = await fetch("/api/planner/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completed)
      }).then((response) => (response.ok ? response.json() : null)).catch(() => null);
      if (result?.plan?._id) completed.id = result.plan._id;
    }
    trackPlannerEvent("planner_completed", {
      entry,
      packageName: recommendation.packageName,
      rooms: plan.answers.rooms,
      budget: plan.answers.budget
    });
    setMessage("Plan completed and saved locally.");
  }

  function handleShare() {
    const text =
      `My ABSECO Smart Home Plan\n\n` +
      `Package: ${recommendation.packageName}\n` +
      `Rooms: ${plan.answers.rooms.join(", ")}\n` +
      `Budget: ${recommendation.estimatedBudgetRange}`;
    if (navigator.share) {
      navigator.share({ title: "ABSECO Smart Home Plan", text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  }

  function recordConversion(conversionStatus: "proposal_requested" | "consultation_booked") {
    const payload = {
      ...plan,
      status: "completed",
      conversionStatus,
      recommendation,
      structuredPlan
    };
    fetch("/api/planner/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  }

  return (
    <section className="space-y-6 pb-16">
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Build My Smart Home
        </h1>
        <p className="max-w-md text-sm font-light text-slate-400">
          One guided planner for your home, lifestyle, budget, and smart living goals.
        </p>
      </div>

      <GlassCard className="space-y-3 p-6">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Step {plan.currentStep} of {TOTAL_STEPS}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#FF6A00] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        <motion.div
          key={plan.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="glass-card space-y-6 p-6 sm:p-8"
        >
          {plan.currentStep === 1 && (
            <>
              <h2 className="font-display text-xl font-semibold text-white">Tell us about your home</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {plannerHomeTypes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateAnswers({ homeType: item.id })}
                    className={`rounded-2xl border p-4 text-left text-sm ${
                      plan.answers.homeType === item.id ? "border-[#FF6A00] bg-[#FF6A00]/15" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.subtitle}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {plan.currentStep === 2 && (
            <>
              <h2 className="font-display text-xl font-semibold text-white">Rooms</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {plannerRooms.map((room) => (
                  <button
                    key={room}
                    type="button"
                    onClick={() => toggleListValue("rooms", room)}
                    className={`rounded-2xl border p-4 text-left text-sm ${
                      plan.answers.rooms.includes(room) ? "border-[#FF6A00] bg-[#FF6A00]/15" : "border-white/10 bg-white/5"
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </>
          )}

          {plan.currentStep === 3 && (
            <>
              <h2 className="font-display text-xl font-semibold text-white">Lifestyle</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {plannerLifestyles.map((lifestyle) => (
                  <button
                    key={lifestyle}
                    type="button"
                    onClick={() => toggleListValue("lifestyles", lifestyle)}
                    className={`rounded-2xl border p-4 text-left text-sm ${
                      plan.answers.lifestyles.includes(lifestyle) ? "border-[#FF6A00] bg-[#FF6A00]/15" : "border-white/10 bg-white/5"
                    }`}
                  >
                    {lifestyle}
                  </button>
                ))}
              </div>
            </>
          )}

          {plan.currentStep === 4 && (
            <>
              <h2 className="font-display text-xl font-semibold text-white">Family</h2>
              <div className="space-y-4">
                <label className="block text-sm text-slate-400">
                  Number of members
                  <input
                    type="number"
                    min={1}
                    value={plan.answers.family.members || ""}
                    onChange={(event) => updateFamily({ members: Number(event.target.value) || undefined })}
                    className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-sm text-white"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {familyOptions.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        updateFamily({ [key]: !plan.answers.family[key] })
                      }
                      className={`rounded-2xl border p-4 text-left text-sm ${
                        plan.answers.family[key]
                          ? "border-[#FF6A00] bg-[#FF6A00]/15"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {plan.currentStep === 5 && (
            <>
              <h2 className="font-display text-xl font-semibold text-white">Budget</h2>
              <p className="text-sm text-slate-400">No pricing calculation yet. This only helps us understand intent.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {plannerBudgets.map((budget) => (
                  <button
                    key={budget}
                    type="button"
                    onClick={() => updateAnswers({ budget })}
                    className={`rounded-2xl border p-4 text-left text-sm ${
                      plan.answers.budget === budget ? "border-[#FF6A00] bg-[#FF6A00]/15" : "border-white/10 bg-white/5"
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </>
          )}

          {plan.currentStep === 6 && (
            <>
              <h2 className="font-display text-xl font-semibold text-white">Smart Living Goals</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {plannerGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleListValue("goals", goal)}
                    className={`rounded-2xl border p-4 text-left text-sm ${
                      plan.answers.goals.includes(goal) ? "border-[#FF6A00] bg-[#FF6A00]/15" : "border-white/10 bg-white/5"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </>
          )}

          {plan.currentStep === 7 && (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">Summary</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                    {recommendation.packageName}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleComplete}
                  className="rounded-full bg-[#FF6A00] px-5 py-2 text-xs font-semibold text-white"
                >
                  Save Plan
                </button>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Home", structuredPlan.homeSummary, 1],
                  ["Lifestyle", structuredPlan.lifestyleSummary, 3],
                  ["Rooms", structuredPlan.selectedRooms.join(", ") || "Not selected", 2],
                  ["Goals", plan.answers.goals.join(", ") || "Not selected", 6],
                  ["Budget", recommendation.estimatedBudgetRange, 5],
                  ["Experiences", structuredPlan.experiences.join(", "), 6]
                ].map(([label, value, editStep]) => (
                  <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                      <button type="button" onClick={() => setStep(Number(editStep))} className="text-xs text-[#FF6A00]">
                        Edit
                      </button>
                    </div>
                    <p className="mt-2 text-slate-200">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#FF6A00]/25 bg-[#FF6A00]/10 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Suggested add-ons</p>
                <p className="mt-2 text-sm text-slate-100">
                  {(recommendation.suggestedAddOns.length ? recommendation.suggestedAddOns : ["Scene Automation"]).join(", ")}
                </p>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Preferred contact</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contactMethods.map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => updateAnswers({ preferredContactMethod: method.value })}
                        className={`rounded-full border px-3 py-1.5 text-xs ${
                          plan.answers.preferredContactMethod === method.value
                            ? "border-[#FF6A00] bg-[#FF6A00]/15 text-white"
                            : "border-white/10 bg-white/5 text-slate-300"
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Buying timeline</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {buyingTimelines.map((timeline) => (
                      <button
                        key={timeline}
                        type="button"
                        onClick={() => updateAnswers({ buyingTimeline: timeline })}
                        className={`rounded-full border px-3 py-1.5 text-xs ${
                          plan.answers.buyingTimeline === timeline
                            ? "border-[#FF6A00] bg-[#FF6A00]/15 text-white"
                            : "border-white/10 bg-white/5 text-slate-300"
                        }`}
                      >
                        {timeline}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-5">
                <Link href="/experience" className="block">
                  <PrimaryButton className="w-full">Experience My Home</PrimaryButton>
                </Link>
                <Link
                  href="/proposal"
                  className="block"
                  onClick={() => {
                    recordConversion("proposal_requested");
                    trackPlannerEvent("planner_proposal_requested", { entry, packageName: recommendation.packageName });
                  }}
                >
                  <PrimaryButton className="w-full bg-blue-600 shadow-glow">Request Proposal</PrimaryButton>
                </Link>
                <Link
                  href="/consultation"
                  className="block"
                  onClick={() => {
                    recordConversion("consultation_booked");
                    trackPlannerEvent("planner_consultation_requested", { entry, packageName: recommendation.packageName });
                  }}
                >
                  <PrimaryButton className="w-full bg-emerald-600">Book Consultation</PrimaryButton>
                </Link>
                <Link
                  href="/consultation?type=site_visit"
                  className="block"
                  onClick={() => {
                    recordConversion("consultation_booked");
                    trackPlannerEvent("planner_site_visit_requested", { entry, packageName: recommendation.packageName });
                  }}
                >
                  <PrimaryButton className="w-full bg-cyan-700">Site Visit</PrimaryButton>
                </Link>
                <PrimaryButton className="w-full bg-slate-700" onClick={handleShare}>
                  Share Plan
                </PrimaryButton>
              </div>
            </>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => {
                if (plan.currentStep === 1) {
                  trackPlannerEvent("planner_abandoned", { entry, step: plan.currentStep });
                  window.history.back();
                } else {
                  setStep(plan.currentStep - 1);
                }
              }}
              className="text-xs font-medium text-slate-400 hover:text-white"
            >
              {plan.currentStep === 1 ? "Exit" : "Back"}
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-slate-200 hover:border-white/40 hover:bg-white/5"
              >
                Save for Later
              </button>
              {plan.currentStep < TOTAL_STEPS && (
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setStep(plan.currentStep + 1)}
                  className="rounded-full bg-[#FF6A00] px-5 py-2 text-xs font-semibold text-white disabled:opacity-40"
                >
                  Next
                </button>
              )}
            </div>
          </div>
          {message && <p className="text-xs text-slate-400">{message}</p>}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
