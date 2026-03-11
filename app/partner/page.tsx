"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { PartnerStatsCard } from "@/components/PartnerStatsCard";
import { PrimaryButton } from "@/ui/PrimaryButton";

export default function PartnerPage() {
  const [copied, setCopied] = useState(false);

  const referralLink = "https://abseco.ai/r/raj-electrician";
  const qrCodeUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(referralLink)}`,
    [referralLink]
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: "Design your smart home",
        text: "Scan or open this Abseco link to design your smart home.",
        url: referralLink
      });
      return;
    }
    const waText = encodeURIComponent(`Design your smart home with ABSECO: ${referralLink}`);
    window.open(`https://wa.me/?text=${waText}`, "_blank");
  }

  return (
    <section className="space-y-5">
      <h1 className="text-xl font-semibold">Partner Growth Dashboard</h1>
      <p className="text-sm text-slate-300">
        Build recurring smart home referrals across Kerala with your unique link and demo tools.
      </p>

      <div className="glass-card p-4">
        <p className="text-xs text-slate-400">Share your link</p>
        <p className="mt-1 break-all font-medium text-blue-300">{referralLink.replace("https://", "")}</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <PrimaryButton onClick={handleCopy}>{copied ? "Copied" : "Copy"}</PrimaryButton>
          <PrimaryButton className="bg-emerald-600" onClick={handleShare}>
            Share on WhatsApp
          </PrimaryButton>
          <PrimaryButton className="bg-slate-700">Generate QR Code</PrimaryButton>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-5">
        <PartnerStatsCard label="Total Leads" value="12" />
        <PartnerStatsCard label="Proposals Sent" value="5" />
        <PartnerStatsCard label="Projects Confirmed" value="3" />
        <PartnerStatsCard label="Commission Earned" value="₹45,000" />
        <PartnerStatsCard label="Pending Commission" value="₹18,000" />
      </div>

      <div className="glass-card p-4">
        <p className="text-sm font-semibold">Leads List</p>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>Rahul - Kochi - Exploring</p>
          <p>Anil - Trivandrum - Proposal Sent</p>
          <p>Maya - Calicut - Site Visit Booked</p>
        </div>
      </div>

      <div className="glass-card p-4">
        <p className="text-sm font-semibold">Top Partners</p>
        <ol className="mt-2 space-y-1 text-sm text-slate-300">
          <li>1. Raj Electrician</li>
          <li>2. Smart Build Kochi</li>
          <li>3. HomeStyle Interiors</li>
        </ol>
      </div>

      <div className="glass-card p-4">
        <p className="text-sm font-semibold">Learn Smart Home Automation</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {["Smart Lighting", "Security Automation", "Voice Control", "Scene Automation"].map((video) => (
            <div key={video} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
              {video} - Training video
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4">
        <p className="text-sm font-semibold">QR Referral</p>
        <p className="mt-1 text-xs text-slate-400">Scan to design your smart home</p>
        <Image
          src={qrCodeUrl}
          alt="Partner referral QR code"
          width={176}
          height={176}
          className="mt-3 rounded-lg bg-white p-2"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Link href="/partner/demo" className="block">
          <PrimaryButton className="w-full bg-blue-600 shadow-glow">Open Partner Demo Mode</PrimaryButton>
        </Link>
        <Link href="/admin/partners" className="block">
          <PrimaryButton className="w-full bg-slate-700">Open Admin Partner Engine</PrimaryButton>
        </Link>
      </div>
    </section>
  );
}
