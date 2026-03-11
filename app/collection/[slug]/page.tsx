"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSmartPlan } from "@/lib/context/SmartPlanContext";
import { SuggestionCard } from "@/components/showroom/SuggestionCard";
import {
  collections,
  collectionExperiences,
  defaultCollectionExperiences,
  suggestionPhrases
} from "@/features/showroom/data";

export default function CollectionPage() {
  const params = useParams();
  const slug = String(params?.slug ?? "living-room");
  const { addItem } = useSmartPlan();

  const collection = collections.find((c) => c.slug === slug) ?? collections[0];
  const experiences =
    collectionExperiences[slug as keyof typeof collectionExperiences] ??
    defaultCollectionExperiences;

  return (
    <div className="space-y-12 pb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative aspect-[2/1] overflow-hidden rounded-3xl border border-white/[0.06]"
      >
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 1024px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {collection.title}
          </h1>
          <p className="mt-2 font-light text-slate-300">{collection.subtitle}</p>
        </div>
      </motion.div>

      <section className="space-y-6">
        <h2 className="section-title">Automation setups</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              whileHover={{ y: -2 }}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-card-lift"
            >
              <div className="relative aspect-video">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display font-semibold text-white">{exp.title}</h3>
                  <p className="mt-1.5 text-sm font-light text-slate-400">{exp.description}</p>
                </div>
              </div>
              <div className="flex gap-3 p-4">
                <Link href="/experience" className="flex-1">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center rounded-xl bg-[#FF6A00] py-3 font-medium text-white shadow-orange hover:shadow-orange-hover"
                  >
                    Experience
                  </motion.span>
                </Link>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    addItem({
                      id: exp.id,
                      title: exp.title,
                      description: exp.description,
                      category: exp.type
                    })
                  }
                  className="flex-1 rounded-xl border border-white/20 py-3 font-medium text-slate-300 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white"
                >
                  Add to Plan
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <SuggestionCard
          text={suggestionPhrases[Math.floor(Math.random() * suggestionPhrases.length)]}
        />
      </section>
    </div>
  );
}
