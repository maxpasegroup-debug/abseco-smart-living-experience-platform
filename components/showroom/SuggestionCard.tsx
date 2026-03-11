"use client";

import { motion } from "framer-motion";

type SuggestionCardProps = {
  text: string;
  index?: number;
};

export function SuggestionCard({ text, index = 0 }: SuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 backdrop-blur-sm"
    >
      <p className="text-sm font-light leading-relaxed text-slate-500">{text}</p>
    </motion.div>
  );
}
