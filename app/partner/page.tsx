import { PartnerStatsCard } from "@/components/PartnerStatsCard";

export default function PartnerPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Partner Referral Dashboard</h1>
      <div className="glass-card p-4">
        <p className="text-xs text-slate-400">Referral Link</p>
        <p className="mt-1 font-medium text-blue-300">abseco.ai/r/partnername</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <PartnerStatsCard label="Leads generated" value="48" />
        <PartnerStatsCard label="Conversions" value="16" />
        <PartnerStatsCard label="Commission earned" value="AED 37,500" />
      </div>
      <p className="text-xs text-slate-400">
        Partner-only view. Commission data is hidden from customer-facing screens.
      </p>
    </section>
  );
}
