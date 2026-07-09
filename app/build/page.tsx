import { UnifiedSmartHomePlanner } from "@/components/planner/UnifiedSmartHomePlanner";

export default function BuildPage() {
  return (
    <div className="space-y-6 pb-24">
      <UnifiedSmartHomePlanner entry="build" />
    </div>
  );
}
