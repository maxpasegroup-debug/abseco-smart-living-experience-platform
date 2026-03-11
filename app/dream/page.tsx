"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type HomeType = "Luxury Villa" | "Modern Apartment" | "Independent House" | "Office";
type HomeStyle = "Minimal Modern" | "Luxury Interior" | "Nature Inspired" | "Futuristic Smart Home";
type Preference = "Luxury Lighting" | "Entertainment" | "Security" | "Full Automation";

const HOME_TYPES: HomeType[] = ["Luxury Villa", "Modern Apartment", "Independent House", "Office"];
const HOME_STYLES: HomeStyle[] = ["Minimal Modern", "Luxury Interior", "Nature Inspired", "Futuristic Smart Home"];
const PREFERENCES: Preference[] = ["Luxury Lighting", "Entertainment", "Security", "Full Automation"];

export default function DreamSmartHomePage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [homeType, setHomeType] = useState<HomeType | null>(null);
  const [homeStyle, setHomeStyle] = useState<HomeStyle | null>(null);
  const [preference, setPreference] = useState<Preference | null>(null);

  const canNext =
    (step === 1 && homeType) ||
    (step === 2 && homeStyle) ||
    (step === 3 && preference) ||
    step === 4;

  const plan = useMemo(() => {
    if (!homeType || !homeStyle || !preference) return null;
    const systems = new Set<string>();

    if (preference === "Luxury Lighting" || preference === "Full Automation") {
      systems.add("Smart Lighting");
      systems.add("Smart Curtains");
      systems.add("Scene Automation");
    }
    if (preference === "Entertainment" || preference === "Full Automation") {
      systems.add("Cinema Mode");
      systems.add("Multi-room Audio");
    }
    if (preference === "Security" || preference === "Full Automation") {
      systems.add("Security Cameras");
      systems.add("Door & Gate Control");
    }
    systems.add("Voice Assistant");

    let min = 150000;
    let max = 300000;
    if (homeType === "Luxury Villa") {
      min = 300000;
      max = 600000;
    } else if (homeType === "Modern Apartment") {
      min = 200000;
      max = 400000;
    } else if (homeType === "Office") {
      min = 250000;
      max = 500000;
    }

    if (preference === "Full Automation") {
      min *= 1.3;
      max *= 1.5;
    }

    return {
      systems: Array.from(systems),
      rangeText: `₹${(min / 100000).toFixed(1)}L – ₹${(max / 100000).toFixed(1)}L`
    };
  }, [homeType, homeStyle, preference]);

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.origin + "/dream" : "https://abseco.com/dream";
    const text =
      "I just designed my dream smart home with ABSECO.\n\n" +
      "Check out yours here:\n" +
      url;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ title: "My Dream Smart Home", text, url })
        .catch(() => {
          // ignore
        });
    } else {
      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/?text=${encoded}`, "_blank");
    }
  }

  return (
    <section className="space-y-8 pb-16">
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Design Your Dream Smart Home
        </h1>
        <p className="max-w-md text-sm font-light text-slate-400">
          Answer three simple questions and share your dream smart home with friends and family.
        </p>
      </div>

      <div className="glass-card space-y-6 p-6 sm:p-8">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <p>
            Step {step} of 3{" "}
            <span className="ml-1 hidden sm:inline">
              · Guided journey: home type, style, and smart living preference
            </span>
          </p>
        </div>
        <div className="mt-1 h-1 rounded-full bg-white/10">
          <div
            className="h-1 rounded-full bg-[#FF6A00] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-white">What type of home are you building?</h2>
            <p className="text-sm text-slate-400">This helps us imagine the right scale of automation.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {HOME_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setHomeType(type)}
                  className={`rounded-2xl border p-4 text-left text-sm ${
                    homeType === type ? "border-[#FF6A00] bg-[#FF6A00]/15" : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="font-medium text-white">{type}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {type === "Luxury Villa" && "Perfect for full-home luxury automation."}
                    {type === "Modern Apartment" && "Smart living for modern city homes."}
                    {type === "Independent House" && "Flexible automation for every floor."}
                    {type === "Office" && "Intelligent spaces for teams and clients."}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-white">What is your interior style?</h2>
            <p className="text-sm text-slate-400">We shape the mood of your smart home around this.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {HOME_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setHomeStyle(style)}
                  className={`rounded-2xl border p-4 text-left text-sm ${
                    homeStyle === style ? "border-[#FF6A00] bg-[#FF6A00]/15" : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="font-medium text-white">{style}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-white">
              What matters most in your smart home?
            </h2>
            <p className="text-sm text-slate-400">Choose the lifestyle that feels most like you.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {PREFERENCES.map((pref) => (
                <button
                  key={pref}
                  onClick={() => setPreference(pref)}
                  className={`rounded-2xl border p-4 text-left text-sm ${
                    preference === pref ? "border-[#FF6A00] bg-[#FF6A00]/15" : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="font-medium text-white">{pref}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {pref === "Luxury Lighting" && "Atmosphere, mood, and ambience in every room."}
                    {pref === "Entertainment" && "Home theatre, music, and cinematic evenings."}
                    {pref === "Security" && "Peace of mind with cameras and alerts."}
                    {pref === "Full Automation" && "Lighting, curtains, climate, and more—working together."}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev))}
            className="text-xs font-medium text-slate-400 hover:text-white"
          >
            {step === 1 ? "Back to Showroom" : "← Back"}
          </button>
          {step < 3 && (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setStep((prev) => ((prev + 1) as 1 | 2 | 3 | 4))}
              className="rounded-full bg-white/10 px-5 py-2 text-xs font-medium text-white disabled:opacity-40"
            >
              Next →
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setStep(4)}
              className="rounded-full bg-[#FF6A00] px-5 py-2 text-xs font-medium text-white shadow-[0_0_18px_rgba(255,106,0,0.5)] disabled:opacity-40"
            >
              Generate Dream Smart Home
            </button>
          )}
        </div>
      </div>

      {step === 4 && plan && (
        <div className="space-y-6">
          <div className="glass-card space-y-4 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
              Your Dream Smart Home
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              {homeStyle} · {homeType}
            </h2>
            <p className="mt-2 text-sm font-light text-slate-400">
              Tailored around <span className="font-medium text-slate-100">{preference}</span> — powered by ABSECO
              Smart Living.
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-100 sm:grid-cols-2">
              {plan.systems.map((system) => (
                <div
                  key={system}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 backdrop-blur-sm"
                >
                  {system}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-[#FF6A00]/25 bg-[#FF6A00]/10 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-300">
                Estimated project range
              </p>
              <p className="mt-2 font-display text-xl font-semibold text-white">{plan.rangeText}</p>
              <p className="mt-1 text-xs text-slate-400">Non-binding estimate. Final value depends on exact scope.</p>
            </div>
          </div>

          <div className="glass-card space-y-4 p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-white">Share your smart home</h3>
            <p className="text-sm font-light text-slate-400">
              Kerala loves sharing home projects. Send this to your WhatsApp groups or Instagram stories.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-[#25D366] px-6 py-3 text-xs font-semibold text-white shadow-[0_0_18px_rgba(37,211,102,0.35)]"
              >
                Share via WhatsApp
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full border border-white/20 px-6 py-3 text-xs font-semibold text-slate-200 hover:border-white/50 hover:bg-white/5"
              >
                Copy & share link
              </button>
            </div>
            <div className="mt-5 rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900/80 via-slate-900 to-[#FF6A00]/20 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                My Smart Living Plan
              </p>
              <p className="mt-2 font-display text-lg text-white">Powered by ABSECO</p>
              <p className="mt-2 text-xs text-slate-400">
                Tip: screenshot this card or long-press to save and share it anywhere.
              </p>
            </div>
          </div>

          <div className="glass-card flex flex-wrap items-center justify-between gap-3 p-6 sm:p-8">
            <div>
              <p className="font-display text-sm font-semibold text-white">Turn this dream into reality</p>
              <p className="mt-1 text-xs text-slate-400">
                Book a free smart home consultation or see it live in your room.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/experience">
                <span className="inline-block rounded-full border border-white/25 px-5 py-2 text-xs font-semibold text-slate-200 hover:border-white/50 hover:bg-white/5">
                  Experience In My Room
                </span>
              </Link>
              <Link href="/#consultation">
                <span className="inline-block rounded-full bg-[#FF6A00] px-5 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(255,106,0,0.5)]">
                  Book Free Consultation
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

