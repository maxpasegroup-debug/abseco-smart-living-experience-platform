"use client";

import Link from "next/link";
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
      className="glass-card overflow-hidden p-0"
    >
      <div className="relative min-h-[390px] overflow-hidden rounded-xl p-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1616594039964-3be75c27176d?auto=format&fit=crop&w=1600&q=80)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/70 to-abseco-orange/25" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">ABSECO Experience</p>
          <h1 className="mt-2 text-3xl font-semibold">Experience Smart Living</h1>
          <p className="mt-2 max-w-md text-sm text-slate-200">Explore AI Powered Homes by Abseco</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <PrimaryButton onClick={onStart}>Start Exploring</PrimaryButton>
            <Link href="/ai-designer">
              <PrimaryButton className="bg-blue-600 shadow-glow">Design My Smart Home</PrimaryButton>
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-xs text-slate-200">
            <span className="rounded-full bg-white/10 px-3 py-1">AI Villa</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Smart Apartment</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Smart Office</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
