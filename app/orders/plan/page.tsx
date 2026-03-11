"use client";

import { motion } from "framer-motion";
import { SmartPlanCart } from "@/components/showroom/SmartPlanCart";

export default function PlanPage() {
  return (
    <div className="space-y-8 pb-12">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold tracking-tight text-white"
      >
        My Smart Home Plan
      </motion.h1>
      <SmartPlanCart />
    </div>
  );
}
