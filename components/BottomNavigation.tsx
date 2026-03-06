"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/ai-designer", label: "AI Designer" },
  { href: "/profile", label: "Saved" },
  { href: "/profile", label: "Profile" }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                className={`block px-1 py-3 text-center text-xs ${active ? "text-abseco-orange" : "text-slate-300"}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
