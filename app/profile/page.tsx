"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const sections = [
  { title: "My Orders", href: "/orders", description: "Track consultations and installations" },
  { title: "My Smart Home Plan", href: "/orders/plan", description: "Items you've added" },
  { title: "Design with AI", href: "/ai-designer", description: "Get a personalised automation plan" },
  { title: "Warranty", href: "#", description: "Product warranty and support" },
  { title: "Support", href: "#", description: "Get help and contact us" }
];

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-12">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold tracking-tight text-white"
      >
        Profile
      </motion.h1>
      <div className="space-y-3">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={s.href}
              className="block rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <p className="font-display font-medium text-white">{s.title}</p>
              <p className="mt-1.5 text-sm font-light text-slate-500">{s.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
