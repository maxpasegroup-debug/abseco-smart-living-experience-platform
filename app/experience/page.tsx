"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CameraExperiencePanel } from "@/components/showroom/CameraExperiencePanel";

export default function ExperiencePage() {
  return (
    <div className="space-y-10 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Experience in your room
        </h1>
        <p className="mt-4 max-w-md font-light text-slate-500">
          See smart devices in your space. Tap ON / OFF to bring your room to life.
        </p>
      </motion.div>
      <CameraExperiencePanel />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10"
      >
        <h2 className="font-display text-xl font-semibold tracking-tight text-white">
          Discover Your Smart Home
        </h2>
        <p className="mt-2 text-sm font-light text-slate-500">
          Turn this experience into a personalized smart living plan in three steps.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/ai-designer" className="inline-block">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block rounded-full bg-[#FF6A00] px-7 py-3.5 font-display text-sm font-medium text-white shadow-[0_0_24px_rgba(255,106,0,0.35)]"
            >
              Start Discovery Journey
            </motion.span>
          </Link>
          <Link href="/#consultation" className="inline-block">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block rounded-full border border-white/25 px-7 py-3.5 font-display text-sm font-medium text-slate-200 hover:border-white/50 hover:bg-white/5"
            >
              Book Free Consultation
            </motion.span>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
