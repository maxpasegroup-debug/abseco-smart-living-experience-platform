"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSmartPlan } from "@/lib/context/SmartPlanContext";
import type { FeaturedProduct } from "@/features/showroom/data";

type ProductExperienceCardProps = {
  product: FeaturedProduct;
  index?: number;
};

export function ProductExperienceCard({ product, index = 0 }: ProductExperienceCardProps) {
  const { addItem } = useSmartPlan();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-card-lift backdrop-blur-sm"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, 320px"
            className="object-cover transition-transform duration-600 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-display text-lg font-semibold tracking-tight text-white">
              {product.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-slate-400">
              {product.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <Link href="/experience" className="block">
            <motion.span
              whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(255, 106, 0, 0.45)" }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center rounded-xl bg-[#FF6A00] py-3.5 font-display text-sm font-medium tracking-wide text-white shadow-[0_0_24px_rgba(255,106,0,0.35)] transition-shadow hover:shadow-[0_0_32px_rgba(255,106,0,0.5)]"
            >
              Experience
            </motion.span>
          </Link>
          <motion.button
            type="button"
            onClick={() =>
              addItem({
                id: product.id,
                title: product.title,
                description: product.description,
                category: product.category
              })
            }
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="rounded-xl border border-white/20 py-3 font-medium text-slate-400 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white"
          >
            Add to Plan
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
