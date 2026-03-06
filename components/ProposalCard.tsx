import { GlassCard } from "@/ui/GlassCard";
import { PrimaryButton } from "@/ui/PrimaryButton";

type ProposalCardProps = {
  title: string;
  packageName: string;
  estimatedRange: string;
  onRequestVisit?: () => void;
  onSpeakConsultant?: () => void;
};

export function ProposalCard({
  title,
  packageName,
  estimatedRange,
  onRequestVisit,
  onSpeakConsultant
}: ProposalCardProps) {
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-300">Recommended Plan: {packageName}</p>
      <p className="mt-1 text-sm text-blue-300">Estimated Cost: {estimatedRange}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <PrimaryButton onClick={onRequestVisit}>Request site visit</PrimaryButton>
        <PrimaryButton onClick={onSpeakConsultant} className="bg-blue-600 shadow-glow">
          Speak with consultant
        </PrimaryButton>
      </div>
    </GlassCard>
  );
}
