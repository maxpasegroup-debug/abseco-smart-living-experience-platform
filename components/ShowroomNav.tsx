"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function ShowroomNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#020617]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-4">
        <Link
          href="/"
          className="font-display text-sm font-medium tracking-[0.2em] text-white transition-opacity hover:opacity-90"
        >
          ABSECO <span className="text-[#FF6A00]">Smart Living</span>
        </Link>
      </div>
    </motion.header>
  );
}
