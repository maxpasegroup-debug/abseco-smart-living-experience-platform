"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Profile = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  preferred_language?: string;
  communication_preferences?: { whatsapp?: boolean; email?: boolean; phone?: boolean };
};

const sections = [
  { title: "My Smart Home", href: "/my-smart-home", description: "Planner summary and future upgrades" },
  { title: "My Proposals", href: "/my-proposals", description: "Proposal status and revisions" },
  { title: "My Orders", href: "/orders", description: "Orders, installation readiness and timeline" },
  { title: "My Payments", href: "/payments", description: "Invoices, receipts and payment history" },
  { title: "Documents", href: "/documents", description: "Proposals, invoices and receipts" }
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/customer/profile")
      .then((response) => response.json())
      .then((data) => setProfile(data.profile || {}))
      .catch(() => setProfile({}));
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (key: string) => {
      const raw = form.get(key);
      return typeof raw === "string" && raw.trim() ? raw.trim() : undefined;
    };
    const payload = {
      name: value("name"),
      phone: value("phone"),
      email: value("email"),
      address: value("address"),
      city: value("city"),
      preferred_language: value("preferred_language"),
      communication_preferences: {
        whatsapp: form.get("whatsapp") === "on",
        email: form.get("email_pref") === "on",
        phone: form.get("phone_pref") === "on"
      }
    };
    const response = await fetch("/api/customer/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error?.message || "Unable to save profile.");
      return;
    }
    setProfile(data.profile || {});
    setMessage("Profile saved.");
  }

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-400">Customer details, address, communication preferences, and saved areas.</p>
      </div>

      <form onSubmit={saveProfile} className="glass-card grid gap-3 p-6 sm:grid-cols-2">
        <input name="name" defaultValue={profile.name || ""} placeholder="Name" className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm" />
        <input name="phone" defaultValue={profile.phone || ""} placeholder="Phone" className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm" />
        <input name="email" defaultValue={profile.email || ""} placeholder="Email" className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm" />
        <input name="city" defaultValue={profile.city || ""} placeholder="City" className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm" />
        <input name="address" defaultValue={profile.address || ""} placeholder="Address" className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm sm:col-span-2" />
        <input name="preferred_language" defaultValue={profile.preferred_language || "English"} placeholder="Preferred Language" className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm" />
        <div className="flex flex-wrap gap-3 text-xs text-slate-300">
          <label><input name="whatsapp" type="checkbox" defaultChecked={profile.communication_preferences?.whatsapp !== false} /> WhatsApp</label>
          <label><input name="email_pref" type="checkbox" defaultChecked={profile.communication_preferences?.email !== false} /> Email</label>
          <label><input name="phone_pref" type="checkbox" defaultChecked={profile.communication_preferences?.phone !== false} /> Phone</label>
        </div>
        <button type="submit" className="rounded-full bg-[#FF6A00] px-5 py-2 text-xs font-semibold text-white">Save Profile</button>
        {message && <p className="text-xs text-slate-300">{message}</p>}
      </form>

      <div className="grid gap-3">
        {sections.map((section) => (
          <Link key={section.title} href={section.href} className="block rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.04]">
            <p className="font-display font-medium text-white">{section.title}</p>
            <p className="mt-1.5 text-sm font-light text-slate-500">{section.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
