"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSmartPlan } from "@/lib/context/SmartPlanContext";

export function SmartPlanCart() {
  const { items, removeItem } = useSmartPlan();

  const estimatedRange =
    items.length === 0
      ? "—"
      : items.length <= 2
        ? "₹1.5L – ₹3L"
        : items.length <= 4
          ? "₹3L – ₹6L"
          : "₹6L – ₹12L";

  return (
    <div className="space-y-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
        My Smart Home Plan
      </h2>
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-16 text-center"
        >
          <p className="font-light text-slate-500">Your plan is empty.</p>
          <Link href="/" className="mt-8 inline-block">
            <motion.span
              whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(255, 106, 0, 0.45)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-block rounded-full bg-[#FF6A00] px-8 py-4 font-display text-sm font-medium text-white shadow-[0_0_24px_rgba(255,106,0,0.35)]"
            >
              Explore Showroom
            </motion.span>
          </Link>
        </motion.div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display font-medium text-white">{item.title}</p>
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm font-light text-slate-500">
                        {item.description}
                      </p>
                    )}
                    {item.category && (
                      <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">
                        {item.category}
                      </p>
                    )}
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="shrink-0 text-sm font-light text-slate-500 transition-colors hover:text-white"
                  >
                    Remove
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
          <div className="rounded-2xl border border-[#FF6A00]/20 bg-[#FF6A00]/5 px-6 py-6 shadow-[inset_0_0_60px_rgba(255,106,0,0.06)]">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Estimated investment
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-white">
              {estimatedRange}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                className="w-full rounded-full bg-[#FF6A00] py-4 font-display text-sm font-medium text-white shadow-[0_0_24px_rgba(255,106,0,0.35)] transition-shadow hover:shadow-[0_0_32px_rgba(255,106,0,0.5)]"
              >
                Request Quotation
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                className="w-full rounded-full border border-white/30 bg-white/5 py-4 font-display text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(59,130,246,0.25)]"
              >
                Book Site Visit
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                className="w-full rounded-full border border-white/20 py-4 font-display text-sm font-medium text-slate-400 transition-colors hover:border-white/40 hover:text-white"
              >
                Reserve Installation Slot
              </button>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
