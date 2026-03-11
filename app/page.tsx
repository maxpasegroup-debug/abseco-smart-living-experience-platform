"use client";

import Link from "next/link";
import { ShowroomHero } from "@/components/showroom/ShowroomHero";
import { CollectionCard } from "@/components/showroom/CollectionCard";
import { ProductExperienceCard } from "@/components/showroom/ProductExperienceCard";
import { ConsultationForm } from "@/components/showroom/ConsultationForm";
import { SuggestionCard } from "@/components/showroom/SuggestionCard";
import { motion } from "framer-motion";
import {
  collections,
  featuredProducts,
  suggestionPhrases
} from "@/features/showroom/data";

export default function ShowroomPage() {
  return (
    <div className="space-y-28 pb-20">
      <div className="mb-4 text-xs font-mono uppercase tracking-[0.3em] text-[#FF6A00]">
        ABSECO SHOWROOM BUILD V2
      </div>
      <ShowroomHero />

      <motion.section
        id="collections"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="space-y-8"
      >
        <h2 className="section-title">Collections</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {collections.map((c, i) => (
            <CollectionCard key={c.id} collection={c} index={i} />
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-[#FF6A00]/15 bg-[#FF6A00]/5 py-12 text-center"
      >
        <h2 className="font-display text-xl font-semibold tracking-tight text-white">
          Discover Your Smart Home
        </h2>
        <p className="mt-3 text-sm font-light text-slate-500">
          3 guided steps: home type, rooms, and lifestyle—before you see products.
        </p>
        <Link href="/ai-designer" className="mt-8 inline-block">
          <motion.span
            whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(255, 106, 0, 0.45)" }}
            whileTap={{ scale: 0.98 }}
            className="inline-block rounded-full bg-[#FF6A00] px-8 py-4 font-display text-sm font-medium text-white shadow-[0_0_24px_rgba(255,106,0,0.35)]"
          >
            Start Discovery Journey
          </motion.span>
        </Link>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="space-y-8"
      >
        <h2 className="section-title">Featured</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {featuredProducts.map((p, i) => (
            <ProductExperienceCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <Link href="/dream">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-8 py-4 font-display text-sm font-medium text-[#FF6A00] hover:bg-[#FF6A00]/20"
            >
              Design My Dream Smart Home
            </motion.span>
          </Link>
          <Link href="/ai-designer">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block rounded-full border border-white/20 bg-white/5 px-8 py-4 font-display text-sm font-medium text-slate-200 hover:border-white/40 hover:bg-white/10"
            >
              Refine My Smart Plan
            </motion.span>
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        {suggestionPhrases.slice(0, 2).map((text, i) => (
          <SuggestionCard key={text} text={text} index={i} />
        ))}
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-10 sm:p-12"
      >
        <h2 className="font-display text-xl font-semibold tracking-tight text-white">
          See it in your space
        </h2>
        <p className="mt-4 max-w-md text-sm font-light text-slate-500">
          Create the perfect mood with intelligent lighting—right where you live.
        </p>
        <Link href="/experience" className="mt-8 inline-block">
          <motion.span
            whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(255, 106, 0, 0.45)" }}
            whileTap={{ scale: 0.98 }}
            className="inline-block rounded-full bg-[#FF6A00] px-8 py-4 font-display text-sm font-medium text-white shadow-[0_0_24px_rgba(255,106,0,0.35)]"
          >
            Experience In My Room
          </motion.span>
        </Link>
      </motion.section>

      <motion.section
        id="consultation"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-10 sm:p-12"
      >
        <h2 className="font-display text-xl font-semibold tracking-tight text-white">
          Plan your smart home
        </h2>
        <p className="mt-4 text-sm font-light text-slate-500">
          Book a free consultation. No obligation.
        </p>
        <div className="mt-8 max-w-sm">
          <ConsultationForm />
        </div>
      </motion.section>
    </div>
  );
}
