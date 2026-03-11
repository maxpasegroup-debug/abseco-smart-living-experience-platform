"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { CollectionItem } from "@/features/showroom/data";

type CollectionCardProps = {
  collection: CollectionItem;
  index?: number;
};

export function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-w-[280px] max-w-[360px] sm:min-w-[300px]"
    >
      <Link href={`/collection/${collection.slug}`} className="group block">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] shadow-card-lift"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={collection.image}
              alt={collection.title}
              fill
              sizes="(max-width: 640px) 280px, 360px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            {/* Gradient overlay: stronger at bottom for title */}
            <div
              className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
              style={{
                background: `linear-gradient(to top, ${collection.accent || "#020617"} 0%, ${collection.accent || "#020617"}30 35%, transparent 65%)`
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-white drop-shadow-sm">
                {collection.title}
              </h3>
              <p className="mt-1 text-sm font-light text-slate-300/90">
                {collection.subtitle}
              </p>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
