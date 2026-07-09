"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
  { href: "/explore", label: "Solutions" },
  { href: "/experience", label: "Experience" },
  { href: "/collection/luxury", label: "Products" },
  { href: "/control/projects", label: "Projects" },
  { href: "/proposal", label: "Pricing" },
  { href: "/partner", label: "About" },
  { href: "/consultation", label: "Contact" }
];

export function ShowroomNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#02050d]/88 shadow-[0_20px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
    >
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1500px] items-center justify-between gap-5 px-5 py-3 lg:px-10">
        <Link href="/" className="shrink-0 leading-none" aria-label="ABSECO Smart Living home">
          <span className="block font-display text-[1.7rem] font-black tracking-[-0.04em] text-white sm:text-[2rem]">
            ABSECO
          </span>
          <span className="block font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#ff7a18]">
            Smart Living
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-[0.92rem] font-semibold text-white lg:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition-colors hover:text-[#ff7a18]">
              {item.label}
              {["Solutions", "Experience", "Products"].includes(item.label) && (
                <span className="ml-1 text-[#ff7a18]">v</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href="tel:+919072001234" className="flex items-center gap-3 text-right">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ff6a00]/10 text-[#ff7a18] shadow-[0_0_22px_rgba(255,106,0,0.22)]">
              PH
            </span>
            <span>
              <span className="block text-sm font-bold text-white">+91 9072 00 1234</span>
              <span className="block text-xs text-[#d28b55]">Talk to an Expert</span>
            </span>
          </a>
          <Link
            href="/build"
            className="rounded-xl bg-gradient-to-br from-[#ff9b2f] to-[#ff5a00] px-6 py-4 text-sm font-bold text-white shadow-[0_16px_38px_rgba(255,106,0,0.38)] transition-transform hover:scale-[1.02]"
          >
            Design My Home <span className="ml-3">-&gt;</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/consultation"
            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white"
          >
            Call
          </Link>
          <Link
            href="/build"
            className="rounded-full bg-[#ff6a00] px-4 py-2 text-xs font-bold text-white shadow-[0_0_24px_rgba(255,106,0,0.38)]"
          >
            Design
          </Link>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1500px] gap-2 overflow-x-auto px-5 pb-3 text-xs font-semibold text-slate-300 scrollbar-hide lg:hidden">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            {item.label}
          </Link>
        ))}
      </div>
    </motion.header>
  );
}
