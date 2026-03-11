"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@abseco.com");
  const [password, setPassword] = useState("@Abseco#2025");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="glass-card w-full max-w-sm space-y-4 p-6"
      >
        <h1 className="text-lg font-semibold">Admin Login</h1>
        <p className="text-xs text-slate-400">
          Sign in with your ABSECO admin credentials.
        </p>
        <div className="space-y-2">
          <label className="block text-xs text-slate-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/40"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs text-slate-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/40"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-[#FF6A00] py-2.5 text-sm font-medium text-white shadow-[0_0_18px_rgba(255,106,0,0.4)] disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}

