"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@/ui/GlassCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import type { HomeType } from "@/lib/types";

type RoomBand = "1-2 Rooms" | "3-4 Rooms" | "5-6 Rooms" | "Full Home Automation";
type BudgetBand = "₹1L – ₹2L" | "₹2L – ₹5L" | "₹5L – ₹10L" | "₹10L+";
type PriorityOption =
  | "Luxury Living"
  | "Advanced Security"
  | "Energy Saving"
  | "Entertainment"
  | "Voice Control"
  | "Remote Access";

const homeTypeChoices: { type: HomeType; icon: string; description: string }[] = [
  { type: "Villa", icon: "🏡", description: "Perfect for luxury automation" },
  { type: "Apartment", icon: "🏢", description: "Optimized for compact smart living" },
  { type: "Office", icon: "🏬", description: "Intelligent workspace automation" },
  { type: "Under Construction", icon: "🏗️", description: "Plan automation before handover" }
];

const roomChoices: RoomBand[] = ["1-2 Rooms", "3-4 Rooms", "5-6 Rooms", "Full Home Automation"];
const budgetChoices: { label: BudgetBand; title: string; recommended?: boolean }[] = [
  { title: "Basic Smart Home", label: "₹1L – ₹2L" },
  { title: "Premium Smart Home", label: "₹2L – ₹5L", recommended: true },
  { title: "Luxury Smart Home", label: "₹5L – ₹10L" },
  { title: "AI Luxury Villa", label: "₹10L+" }
];
const priorityChoices: PriorityOption[] = [
  "Luxury Living",
  "Advanced Security",
  "Energy Saving",
  "Entertainment",
  "Voice Control",
  "Remote Access"
];

type DesignerState = {
  homeType: HomeType | null;
  rooms: RoomBand | null;
  budget: BudgetBand | null;
  priorities: PriorityOption[];
};

const totalQuestionSteps = 4;
const previewFeatures = ["Lighting", "Curtains", "Security", "Voice", "Scenes", "Entertainment"] as const;
type PreviewFeature = (typeof previewFeatures)[number];

export function AIWizard() {
  const [screen, setScreen] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [referralSource, setReferralSource] = useState("ai-designer-funnel");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [form, setForm] = useState<DesignerState>({
    homeType: null,
    rooms: null,
    budget: null,
    priorities: []
  });

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("ref");
    const fromCookie = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("abseco_referral_source="))
      ?.split("=")[1];
    const partnerCookie = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("abseco_partner_id="))
      ?.split("=")[1];

    const source = fromQuery || fromCookie;
    if (source) {
      setReferralSource(decodeURIComponent(source));
      setPartnerId(partnerCookie ? decodeURIComponent(partnerCookie) : decodeURIComponent(source).toUpperCase());
    }
  }, []);

  useEffect(() => {
    if (screen !== 5) return;
    const timer = window.setTimeout(() => setScreen(6), 2000);
    return () => window.clearTimeout(timer);
  }, [screen]);

  const questionStep = useMemo(() => {
    if (screen <= 1) return 1;
    if (screen === 2) return 2;
    if (screen === 3) return 3;
    if (screen === 4) return 4;
    return 4;
  }, [screen]);

  const activePreviewFeatures = useMemo<PreviewFeature[]>(() => {
    const set = new Set<PreviewFeature>();

    if (form.rooms === "1-2 Rooms") set.add("Lighting");
    if (form.rooms === "3-4 Rooms") {
      set.add("Lighting");
      set.add("Security");
    }
    if (form.rooms === "5-6 Rooms" || form.rooms === "Full Home Automation") {
      set.add("Lighting");
      set.add("Curtains");
      set.add("Security");
      set.add("Scenes");
    }

    if (form.budget === "₹5L – ₹10L" || form.budget === "₹10L+") {
      set.add("Voice");
      set.add("Entertainment");
      set.add("Lighting");
    }

    form.priorities.forEach((priority) => {
      if (priority === "Luxury Living") {
        set.add("Lighting");
        set.add("Curtains");
        set.add("Scenes");
      }
      if (priority === "Advanced Security") set.add("Security");
      if (priority === "Entertainment") {
        set.add("Entertainment");
        set.add("Voice");
      }
      if (priority === "Voice Control") set.add("Voice");
      if (priority === "Remote Access") set.add("Security");
      if (priority === "Energy Saving") set.add("Scenes");
    });

    return Array.from(set);
  }, [form]);

  const progressBlocks = useMemo(() => {
    const filled = Math.round((questionStep / totalQuestionSteps) * 10);
    return `${"█".repeat(filled)}${"░".repeat(10 - filled)}`;
  }, [questionStep]);

  const recommendation = useMemo(() => {
    const highBudget = form.budget === "₹5L – ₹10L" || form.budget === "₹10L+";
    const villaHigh = form.homeType === "Villa" && highBudget;
    const securityFocused = form.priorities.includes("Advanced Security");
    const luxuryFocused = form.priorities.includes("Luxury Living");

    const packageName = villaHigh ? "AI Luxury Villa Package" : highBudget || luxuryFocused ? "Luxury Smart Home Package" : securityFocused ? "Security Smart Home Package" : "Premium Smart Home Package";

    const estimate =
      form.budget === "₹10L+"
        ? "₹10L+"
        : form.budget === "₹5L – ₹10L"
          ? "₹5.4L – ₹8.8L"
          : form.budget === "₹2L – ₹5L"
            ? "₹3.2L – ₹4.8L"
            : "₹1.2L – ₹2.1L";

    const leadScore = calculateLeadScore(form);

    return {
      packageName,
      estimate,
      leadScore,
      around:
        estimate === "₹10L+"
          ? "₹11.2L"
          : estimate === "₹5.4L – ₹8.8L"
            ? "₹7.1L"
            : estimate === "₹3.2L – ₹4.8L"
              ? "₹3.8L"
              : "₹1.7L",
      features: [
        "Smart Lighting",
        "Smart Curtains",
        "Voice Control",
        "Smart Security",
        "Scene Automation",
        "Mobile App Control"
      ]
    };
  }, [form]);

  function calculateLeadScore(values: DesignerState): number {
    let score = 30;
    if (values.homeType === "Villa") score += 20;
    if (values.budget === "₹10L+") score += 35;
    else if (values.budget === "₹5L – ₹10L") score += 25;
    else if (values.budget === "₹2L – ₹5L") score += 15;
    if (values.rooms === "Full Home Automation") score += 15;
    score += Math.min(values.priorities.length * 4, 20);
    return Math.min(score, 100);
  }

  function isCurrentStepValid() {
    if (screen === 1) return Boolean(form.homeType);
    if (screen === 2) return Boolean(form.rooms);
    if (screen === 3) return Boolean(form.budget);
    if (screen === 4) return form.priorities.length > 0;
    return true;
  }

  async function handleLogin(method: "Phone OTP" | "Google" | "WhatsApp") {
    setSavingLead(true);
    try {
      const payload = {
        name: `AI Designer ${method}`,
        phone: "pending-login",
        location: "Unknown",
        home_type: form.homeType || "Unknown",
        budget: form.budget || "Unknown",
        interest_level: recommendation.leadScore >= 75 ? "hot" : recommendation.leadScore >= 55 ? "warm" : "cold",
        referral_source: referralSource,
        partner_id: partnerId,
        rooms: form.rooms,
        priority: form.priorities.join(", "),
        lead_score: recommendation.leadScore
      };
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setIsLoggedIn(true);
      setScreen(8);
    } finally {
      setSavingLead(false);
    }
  }

  return (
    <section className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <button
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm"
          onClick={() => (screen === 0 ? window.history.back() : setScreen((prev) => Math.max(0, prev - 1)))}
        >
          ← Back
        </button>
        <p className="text-sm font-semibold">AI Smart Home Designer</p>
        <div className="w-[62px]" />
      </div>

      {screen <= 4 && (
        <GlassCard>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <p>Step {questionStep} of {totalQuestionSteps}</p>
            <p>{Math.round((questionStep / totalQuestionSteps) * 100)}%</p>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-abseco-orange transition-all duration-300"
              style={{ width: `${(questionStep / totalQuestionSteps) * 100}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-xs tracking-wider text-slate-300">{progressBlocks}</p>
        </GlassCard>
      )}

      {screen <= 6 && (
        <GlassCard className="overflow-hidden p-0">
          <div className="relative h-56 w-full">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=80)"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/50 to-abseco-orange/20" />
            <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white">
              Smart Home Preview: {form.homeType || "Select Home Type"}
            </div>

            <AnimatePresence>
              {activePreviewFeatures.includes("Lighting") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="absolute left-4 top-16 rounded-full bg-amber-400/25 px-3 py-1 text-xs text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.45)]"
                >
                  💡 Ambient Lighting
                </motion.div>
              )}
              {activePreviewFeatures.includes("Curtains") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="absolute right-4 top-20 rounded-full bg-indigo-400/25 px-3 py-1 text-xs text-indigo-100"
                >
                  🪟 Smart Curtains
                </motion.div>
              )}
              {activePreviewFeatures.includes("Security") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="absolute left-6 bottom-16 rounded-full bg-red-500/25 px-3 py-1 text-xs text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.4)]"
                >
                  📷 Security Active
                </motion.div>
              )}
              {activePreviewFeatures.includes("Voice") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="absolute right-6 bottom-16 rounded-full bg-blue-500/25 px-3 py-1 text-xs text-blue-100"
                >
                  🎙️ Voice Assistant
                </motion.div>
              )}
              {activePreviewFeatures.includes("Entertainment") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="absolute right-8 top-36 rounded-full bg-purple-500/25 px-3 py-1 text-xs text-purple-100"
                >
                  📺 Cinema Scene
                </motion.div>
              )}
              {activePreviewFeatures.includes("Scenes") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="absolute left-8 top-36 rounded-full bg-emerald-500/25 px-3 py-1 text-xs text-emerald-100"
                >
                  ⚙️ Scene Automation
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            {previewFeatures.map((feature) => {
              const active = activePreviewFeatures.includes(feature);
              return (
                <div
                  key={feature}
                  className={`rounded-lg px-2 py-1 text-center text-xs ${
                    active
                      ? "border border-abseco-orange/40 bg-abseco-orange/20 text-abseco-orange shadow-orange"
                      : "border border-white/10 bg-white/5 text-slate-400"
                  }`}
                >
                  {feature}
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {screen === 0 && (
            <GlassCard className="space-y-4">
              <h1 className="text-2xl font-semibold">Design Your Smart Home</h1>
              <p className="text-sm text-slate-300">
                Tell us about your home and our AI will create a personalized automation plan for you.
              </p>
              <div className="rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 via-slate-900 to-abseco-orange/20 p-6 text-center shadow-glow">
                <p className="text-5xl">🏠</p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-blue-300">
                  Glowing Smart Home Blueprint
                </p>
              </div>
              <PrimaryButton className="w-full" onClick={() => setScreen(1)}>
                Start Designing
              </PrimaryButton>
              <p className="text-xs text-slate-400">Step 1 of 4</p>
            </GlassCard>
          )}

          {screen === 1 && (
            <GlassCard className="space-y-4">
              <h2 className="text-xl font-semibold">What type of home are you automating?</h2>
              <div className="grid gap-3">
                {homeTypeChoices.map((item) => {
                  const active = form.homeType === item.type;
                  return (
                    <button
                      key={item.type}
                      onClick={() => setForm((prev) => ({ ...prev, homeType: item.type }))}
                      className={`rounded-xl border p-4 text-left ${active ? "border-abseco-orange bg-abseco-orange/15" : "border-white/10 bg-white/5"}`}
                    >
                      <p className="text-lg">{item.icon}</p>
                      <p className="mt-1 font-semibold">{item.type}</p>
                      <p className="mt-1 text-xs text-slate-300">{item.description}</p>
                    </button>
                  );
                })}
              </div>
              <PrimaryButton className="w-full" disabled={!isCurrentStepValid()} onClick={() => setScreen(2)}>
                Next →
              </PrimaryButton>
            </GlassCard>
          )}

          {screen === 2 && (
            <GlassCard className="space-y-4">
              <h2 className="text-xl font-semibold">How many rooms should be automated?</h2>
              <p className="text-xs text-slate-400">🏠 House automation map preview</p>
              <div className="grid gap-3">
                {roomChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => setForm((prev) => ({ ...prev, rooms: choice }))}
                    className={`rounded-xl border p-4 text-left ${form.rooms === choice ? "border-abseco-orange bg-abseco-orange/15" : "border-white/10 bg-white/5"}`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-xl border border-white/10 bg-white/5 py-3 text-sm" onClick={() => setScreen(1)}>
                  ← Back
                </button>
                <PrimaryButton disabled={!isCurrentStepValid()} onClick={() => setScreen(3)}>
                  Next →
                </PrimaryButton>
              </div>
            </GlassCard>
          )}

          {screen === 3 && (
            <GlassCard className="space-y-4">
              <h2 className="text-xl font-semibold">What is your estimated automation budget?</h2>
              <div className="grid gap-3">
                {budgetChoices.map((choice) => {
                  const active = form.budget === choice.label;
                  return (
                    <button
                      key={choice.label}
                      onClick={() => setForm((prev) => ({ ...prev, budget: choice.label }))}
                      className={`rounded-xl border p-4 text-left ${active ? "border-abseco-orange bg-abseco-orange/15" : "border-white/10 bg-white/5"}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{choice.title}</p>
                        {choice.recommended && (
                          <span className="rounded-full bg-blue-500/20 px-2 py-1 text-[10px] text-blue-300">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-300">{choice.label}</p>
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-xl border border-white/10 bg-white/5 py-3 text-sm" onClick={() => setScreen(2)}>
                  ← Back
                </button>
                <PrimaryButton disabled={!isCurrentStepValid()} onClick={() => setScreen(4)}>
                  Next →
                </PrimaryButton>
              </div>
            </GlassCard>
          )}

          {screen === 4 && (
            <GlassCard className="space-y-4">
              <h2 className="text-xl font-semibold">What matters most to you?</h2>
              <p className="text-sm text-slate-300">Select one or more options.</p>
              <div className="grid grid-cols-2 gap-2">
                {priorityChoices.map((choice) => {
                  const active = form.priorities.includes(choice);
                  return (
                    <button
                      key={choice}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          priorities: active
                            ? prev.priorities.filter((item) => item !== choice)
                            : [...prev.priorities, choice]
                        }))
                      }
                      className={`rounded-xl border p-3 text-left text-sm ${active ? "border-abseco-orange bg-abseco-orange/15" : "border-white/10 bg-white/5"}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-xl border border-white/10 bg-white/5 py-3 text-sm" onClick={() => setScreen(3)}>
                  ← Back
                </button>
                <PrimaryButton disabled={!isCurrentStepValid()} onClick={() => setScreen(5)}>
                  Generate Plan
                </PrimaryButton>
              </div>
            </GlassCard>
          )}

          {screen === 5 && (
            <GlassCard className="space-y-4 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="mx-auto h-20 w-20 rounded-full border-4 border-blue-400/30 border-t-abseco-orange"
              />
              <h2 className="text-xl font-semibold">Designing your smart home...</h2>
              <div className="space-y-1 text-sm text-slate-300">
                <p>Analyzing your preferences</p>
                <p>Selecting optimal automation setup</p>
                <p>Estimating cost</p>
              </div>
            </GlassCard>
          )}

          {screen === 6 && (
            <GlassCard className="space-y-4">
              <h2 className="text-xl font-semibold">Your Smart Home Plan</h2>
              <div className="rounded-xl border border-abseco-orange/30 bg-abseco-orange/10 p-4">
                <p className="font-semibold">{recommendation.packageName}</p>
                <ul className="mt-2 grid gap-1 text-sm text-slate-200">
                  {recommendation.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm font-medium text-blue-300">
                  Estimated investment: {recommendation.estimate}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                Homes like yours cost around <span className="font-semibold">{recommendation.around}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">Rooms automation map</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <p className="rounded-lg bg-white/5 p-2">Living Room 💡🔊</p>
                  <p className="rounded-lg bg-white/5 p-2">Bedroom 🌙🛏️</p>
                  <p className="rounded-lg bg-white/5 p-2">Kitchen 🍳⚡</p>
                  <p className="rounded-lg bg-white/5 p-2">Outdoor 🛡️📷</p>
                </div>
              </div>
              <PrimaryButton className="w-full" onClick={() => setScreen(7)}>
                Save your smart home plan
              </PrimaryButton>
            </GlassCard>
          )}

          {screen === 7 && (
            <GlassCard className="space-y-4">
              <h2 className="text-xl font-semibold">Save your smart home plan</h2>
              <p className="text-sm text-slate-300">
                Continue with your preferred login to store this AI plan inside BGOS.
              </p>
              <div className="grid gap-2">
                <PrimaryButton disabled={savingLead} className="w-full" onClick={() => handleLogin("Phone OTP")}>
                  Continue with Phone OTP
                </PrimaryButton>
                <PrimaryButton
                  disabled={savingLead}
                  className="w-full bg-blue-600 shadow-glow"
                  onClick={() => handleLogin("Google")}
                >
                  Continue with Google
                </PrimaryButton>
                <PrimaryButton
                  disabled={savingLead}
                  className="w-full bg-emerald-600"
                  onClick={() => handleLogin("WhatsApp")}
                >
                  Continue with WhatsApp
                </PrimaryButton>
              </div>
              <p className="text-xs text-slate-400">
                Stored lead fields: home type, rooms, budget, priorities, source, lead score.
              </p>
            </GlassCard>
          )}

          {screen === 8 && (
            <GlassCard className="space-y-4">
              <h2 className="text-xl font-semibold">Your plan is saved</h2>
              <p className="text-sm text-slate-300">
                You are now ready for the next step. Our sales team will prioritize higher-quality leads.
              </p>
              <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-3 text-sm">
                Lead Score: <span className="font-semibold">{recommendation.leadScore}/100</span>
              </div>
              <div className="grid gap-2">
                <Link href="/proposal" className="block">
                  <PrimaryButton className="w-full">Request Proposal</PrimaryButton>
                </Link>
                <PrimaryButton className="w-full bg-blue-600 shadow-glow">Book Site Visit</PrimaryButton>
                <PrimaryButton className="w-full bg-slate-700">Talk to Expert</PrimaryButton>
              </div>
              <p className="text-xs text-slate-400">
                {isLoggedIn ? "Logged in successfully with progressive signup." : ""}
              </p>
            </GlassCard>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
