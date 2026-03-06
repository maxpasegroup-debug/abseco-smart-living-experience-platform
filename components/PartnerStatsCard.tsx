import { GlassCard } from "@/ui/GlassCard";

type PartnerStatsCardProps = {
  label: string;
  value: string;
};

export function PartnerStatsCard({ label, value }: PartnerStatsCardProps) {
  return (
    <GlassCard>
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </GlassCard>
  );
}
