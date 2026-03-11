"use client";

import { motion } from "framer-motion";

const steps = [
  { id: "1", label: "Consultation Booked", done: true },
  { id: "2", label: "Design Planning", done: true },
  { id: "3", label: "Installation Scheduled", done: false },
  { id: "4", label: "Completed", done: false },
  { id: "5", label: "Warranty Active", done: false }
];

export function OrderTimeline() {
  return (
    <div className="space-y-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
        Your Journey
      </h2>
      <div className="relative">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex gap-6 pb-12 last:pb-0"
          >
            {index < steps.length - 1 && (
              <div className="absolute left-[15px] top-12 bottom-0 w-px bg-white/[0.08]" />
            )}
            <motion.div
              animate={{
                boxShadow: step.done
                  ? "0 0 20px rgba(255, 106, 0, 0.5), 0 0 40px rgba(255, 106, 0, 0.2)"
                  : "0 0 0 2px rgba(255,255,255,0.08)",
                scale: step.done ? 1 : 0.98
              }}
              transition={{ duration: 0.35 }}
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-transparent"
              style={{
                borderColor: step.done ? "rgba(255, 106, 0, 0.8)" : undefined,
                backgroundColor: step.done ? "rgba(255, 106, 0, 0.2)" : undefined
              }}
            >
              {step.done && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="text-sm font-bold text-white"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
            <div className="pt-1.5">
              <p
                className={`font-display text-sm font-medium ${
                  step.done ? "text-white" : "text-slate-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
