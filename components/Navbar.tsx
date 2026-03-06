import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-wide text-white">
          ABSECO <span className="text-abseco-orange">Smart Living</span>
        </Link>
        <div className="text-xs text-slate-300">AI Experience Platform</div>
      </div>
    </header>
  );
}
