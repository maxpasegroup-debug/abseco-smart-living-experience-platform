"use client";

import { motion } from "framer-motion";
import { BuildConfigurator } from "@/components/configurator/BuildConfigurator";

export default function BuildPage() {
  return (
    <div className="space-y-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Build my smart home
        </h1>
        <p className="mt-3 font-light text-slate-500">
          Design your dream home in a few steps.
        </p>
      </motion.div>
      <BuildConfigurator />
    </div>
  );
}
