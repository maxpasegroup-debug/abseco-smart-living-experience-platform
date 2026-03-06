"use client";

import { useState } from "react";
import { ProposalCard } from "@/components/ProposalCard";
import { AuthGateModal } from "@/components/AuthGateModal";

export default function ProposalPage() {
  const [authAction, setAuthAction] = useState<"" | "request a site visit" | "speak with a consultant">("");

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Proposal Overview</h1>
      <ProposalCard
        title="Selected Automation Plan"
        packageName="AI Villa"
        estimatedRange="AED 95,000 - 220,000"
        onRequestVisit={() => setAuthAction("request a site visit")}
        onSpeakConsultant={() => setAuthAction("speak with a consultant")}
      />
      <div className="glass-card p-4">
        <p className="text-sm font-semibold">Rooms Automation Map</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>Living Room: climate, media, ambient scenes</li>
          <li>Master Bedroom: circadian lighting + privacy mode</li>
          <li>Kitchen: energy optimization + voice workflows</li>
          <li>Perimeter: AI security and occupancy simulation</li>
        </ul>
      </div>
      <AuthGateModal isOpen={authAction !== ""} actionLabel={authAction} onClose={() => setAuthAction("")} />
    </section>
  );
}
