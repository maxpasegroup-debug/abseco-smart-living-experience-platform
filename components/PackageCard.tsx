"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PackageItem } from "@/lib/types";
import { PrimaryButton } from "@/ui/PrimaryButton";

type PackageCardProps = {
  item: PackageItem;
  onExplore: (name: string) => void;
};

export function PackageCard({ item, onExplore }: PackageCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="glass-card overflow-hidden p-0">
      <div className="relative h-40 w-full">
        <Image src={item.image} alt={item.name} fill className="object-cover" loading="lazy" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="mt-2 text-sm text-slate-300">{item.description}</p>
        <p className="mt-2 text-xs text-blue-300">{item.estimatedRange}</p>
        <PrimaryButton className="mt-3 w-full" onClick={() => onExplore(item.name)}>
          Explore
        </PrimaryButton>
      </div>
    </motion.div>
  );
}
