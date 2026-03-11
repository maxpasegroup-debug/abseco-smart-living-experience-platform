"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Showroom", icon: "◇" },
  { href: "/experience", label: "Experience", icon: "◐" },
  { href: "/orders", label: "Orders", icon: "◆" },
  { href: "/profile", label: "Profile", icon: "○" }
];

export function ShowroomBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-[#020617]/95 backdrop-blur-xl">
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-3 pt-4"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute top-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-[#FF6A00] shadow-[0_0_12px_rgba(255,106,0,0.5)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-[#FF6A00]" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
