"use client";

import { motion } from "framer-motion";
import { PrimaryButton } from "@/ui/PrimaryButton";

type HeroBannerProps = {
  onStart: () => void;
};

export function HeroBanner({ onStart }: HeroBannerProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden p-5"
    >
      <div className="rounded-xl bg-gradient-to-br from-abseco-orange/40 via-blue-500/10 to-slate-950 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-300">ABSECO Experience</p>
        <h1 className="mt-2 text-2xl font-semibold">Experience Smart Living</h1>
        <p className="mt-2 max-w-md text-sm text-slate-300">
          Explore AI Powered Homes by Abseco and preview intelligent automation before
          speaking to a consultant.
        </p>
        <PrimaryButton className="mt-4" onClick={onStart}>
          Start Exploring
        </PrimaryButton>
      </div>
    </motion.section>
  );
}
