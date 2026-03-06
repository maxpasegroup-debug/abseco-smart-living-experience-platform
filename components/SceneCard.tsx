import { AutomationScene } from "@/lib/types";
import { GlassCard } from "@/ui/GlassCard";

type SceneCardProps = {
  scene: AutomationScene;
};

export function SceneCard({ scene }: SceneCardProps) {
  return (
    <GlassCard className="border border-white/15">
      <p className="text-sm font-semibold">{scene.title}</p>
      <p className="mt-1 text-xs text-slate-300">{scene.description}</p>
    </GlassCard>
  );
}
