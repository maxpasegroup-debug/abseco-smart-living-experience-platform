"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConsultationForm } from "@/components/showroom/ConsultationForm";
import {
  homeTypes,
  roomOptions,
  lifestyleModes,
  getPlanFromConfig
} from "@/features/configurator/data";

const STEPS = 6;

export function BuildConfigurator() {
  const [step, setStep] = useState(1);
  const [homeType, setHomeType] = useState<string | null>(null);
  const [rooms, setRooms] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<string | null>(null);

  const plan =
    step >= 4 && homeType && lifestyle
      ? getPlanFromConfig({
          homeType,
          rooms,
          lifestyle
        })
      : null;

  const toggleRoom = (id: string) => {
    setRooms((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const canNext = () => {
    if (step === 1) return !!homeType;
    if (step === 2) return rooms.length > 0;
    if (step === 3) return !!lifestyle;
    return true;
  };

  return (
    <div className="min-h-[70vh] space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className="text-sm font-medium text-slate-400 hover:text-white"
        >
          ← Back
        </button>
        <span className="text-xs uppercase tracking-wider text-slate-500">
          Step {step} of {STEPS}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-[#FF6A00]"
          initial={false}
          animate={{ width: `${(step / STEPS) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              Choose your home type
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {homeTypes.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setHomeType(item.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl border text-left ${
                    homeType === item.id
                      ? "border-[#FF6A00] ring-2 ring-[#FF6A00]/40"
                      : "border-white/10"
                  }`}
                >
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-display font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-slate-300">{item.subtitle}</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canNext()}
              className="w-full rounded-full bg-[#FF6A00] py-4 font-medium text-white shadow-orange disabled:opacity-50 hover:shadow-orange-hover disabled:hover:shadow-orange"
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              Choose rooms to automate
            </h2>
            <p className="text-sm font-light text-slate-500">Select all that apply.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {roomOptions.map((item) => {
                const selected = rooms.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => toggleRoom(item.id)}
                    whileHover={{ y: -2 }}
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl border ${
                      selected ? "border-[#FF6A00]" : "border-white/10"
                    }`}
                  >
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                    </div>
                    {selected && (
                      <span className="absolute right-2 top-2 rounded-full bg-[#FF6A00] p-1 text-white">
                        ✓
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!canNext()}
              className="w-full rounded-full bg-[#FF6A00] py-4 font-medium text-white shadow-orange disabled:opacity-50 hover:shadow-orange-hover"
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              Choose your lifestyle mode
            </h2>
            <p className="text-sm font-light text-slate-500">
              How do you want to live? We&apos;ll match your plan.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {lifestyleModes.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setLifestyle(item.id)}
                  whileHover={{ y: -4 }}
                  className={`relative aspect-[3/2] overflow-hidden rounded-2xl border text-left ${
                    lifestyle === item.id ? "border-[#FF6A00]" : "border-white/10"
                  }`}
                >
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-display font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-slate-300">{item.subtitle}</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!canNext()}
              className="w-full rounded-full bg-[#FF6A00] py-4 font-medium text-white shadow-orange disabled:opacity-50 hover:shadow-orange-hover"
            >
              See my plan
            </button>
          </motion.div>
        )}

        {step === 4 && plan && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              Your Smart Home Plan
            </h2>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-sm text-slate-500">Estimated investment</p>
                <p className="font-display text-2xl font-semibold text-white">{plan.estimate}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="w-full rounded-full bg-[#FF6A00] py-4 font-medium text-white shadow-orange hover:shadow-orange-hover"
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              Experience it in your room
            </h2>
            <p className="text-sm font-light text-slate-500">
              See your smart home overlaid in your space with your camera.
            </p>
            <Link href="/experience" className="block">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center rounded-full bg-[#FF6A00] py-4 font-medium text-white shadow-orange hover:shadow-orange-hover"
              >
                Experience in my room
              </motion.span>
            </Link>
            <button
              type="button"
              onClick={() => setStep(6)}
              className="w-full rounded-full border border-white/30 py-4 font-medium text-white hover:bg-white/5"
            >
              Skip to book consultation
            </button>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              You&apos;re almost there
            </h2>
            <p className="text-sm font-light text-slate-500">
              Book a free consultation or reserve your installation slot.
            </p>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <ConsultationForm />
            </div>
            <Link
              href="/orders/plan"
              className="block text-center text-sm font-medium text-[#FF6A00] hover:underline"
            >
              Reserve installation slot →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
