"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { OrderTimeline } from "@/components/showroom/OrderTimeline";

export default function OrdersPage() {
  return (
    <div className="space-y-12 pb-16">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl font-semibold tracking-tight text-white"
      >
        Orders
      </motion.h1>
      <OrderTimeline />
      <Link href="/orders/plan" className="block">
        <motion.span
          whileHover={{ scale: 1.01, boxShadow: "0 0 24px rgba(59, 130, 246, 0.25)" }}
          whileTap={{ scale: 0.99 }}
          className="inline-block w-full rounded-full border border-white/20 bg-white/5 py-4 text-center font-display text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
        >
          View My Smart Home Plan
        </motion.span>
      </Link>
    </div>
  );
}
