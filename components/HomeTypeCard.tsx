"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HomeType } from "@/lib/types";

type HomeTypeCardProps = {
  type: HomeType;
};

export function HomeTypeCard({ type }: HomeTypeCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="min-w-[150px]">
      <Link
        href={`/explore?type=${encodeURIComponent(type)}`}
        className="glass-card block rounded-xl2 border border-blue-400/20 p-4"
      >
        <p className="text-sm text-slate-300">Explore</p>
        <p className="mt-1 font-semibold">{type}</p>
      </Link>
    </motion.div>
  );
}
