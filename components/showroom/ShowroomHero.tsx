"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export function ShowroomHero() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const contentY = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <motion.section
      style={{ opacity: heroOpacity, marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      className="relative min-h-[100vh] w-[100vw] max-w-none overflow-hidden"
    >
      {/* Full-bleed background image with parallax */}
      <motion.div
        style={{
          y: heroY,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1920&q=85)"
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
      />
      {/* Deep gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(2,6,23,0.5) 0%, rgba(15,23,42,0.4) 40%, rgba(2,6,23,0.95) 100%)"
        }}
      />
      {/* Animated ambient glow */}
      <motion.div
        animate={{
          opacity: [0.2, 0.35, 0.2],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,106,0,0.12) 0%, transparent 50%)"
        }}
      />
      <motion.div
        animate={{
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 70% 60%, rgba(59,130,246,0.1) 0%, transparent 50%)"
        }}
      />

      <motion.div
        style={{ y: contentY }}
        className="absolute inset-0 flex flex-col justify-end px-5 pb-28 pt-32 sm:px-8 md:px-12 lg:px-16"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hero-title max-w-4xl"
        >
          Experience Intelligent Luxury Living
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hero-subtitle mt-5 max-w-lg"
        >
          ABSECO Smart Homes Powered by AI
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <Link href="/dream" className="group inline-block">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary-glow inline-block rounded-full bg-[#FF6A00] px-8 py-4 font-display text-sm font-medium tracking-wide text-white"
            >
              Design My Dream Smart Home
            </motion.span>
          </Link>
          <Link href="/ai-designer" className="group inline-block">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary-glow inline-block rounded-full border border-white/30 bg-white/5 px-8 py-4 font-display text-sm font-medium tracking-wide text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/10"
            >
              Discover Your Smart Home
            </motion.span>
          </Link>
          <Link href="/experience" className="group inline-block">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block rounded-full border border-white/25 px-8 py-4 font-display text-sm font-medium tracking-wide text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/5"
            >
              Experience In My Room
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
