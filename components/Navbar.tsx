"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-lg text-white"
            aria-label="Open menu"
          >
            ☰
          </button>
          <Link href="/" className="text-sm font-semibold tracking-wide text-white">
            abseco <span className="text-abseco-orange">smart living</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              aria-label="Search smart home ideas"
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-base text-white"
            >
              🔍
            </Link>
            <Link
              href="/profile"
              aria-label="Profile login"
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-base text-white"
            >
              👤
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <aside
            className="h-full w-72 border-r border-white/10 bg-slate-950 p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Navigate</p>
              <button className="text-slate-300" onClick={() => setMenuOpen(false)}>
                ✕
              </button>
            </div>
            <nav className="grid gap-3 text-sm">
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-slate-200">
                Home
              </Link>
              <Link href="/explore" onClick={() => setMenuOpen(false)} className="text-slate-200">
                Explore Homes
              </Link>
              <Link href="/ai-designer" onClick={() => setMenuOpen(false)} className="text-slate-200">
                AI Designer
              </Link>
              <Link href="/partner" onClick={() => setMenuOpen(false)} className="text-slate-200">
                Become a Partner
              </Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-slate-200">
                Profile
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
