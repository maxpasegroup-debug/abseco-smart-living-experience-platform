import Link from "next/link";
import { scenes, smartPackages } from "@/features/dashboard/data";
import { PrimaryButton } from "@/ui/PrimaryButton";

export default function PartnerDemoPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Partner Demo Mode</h1>
      <p className="text-sm text-slate-300">
        Use this guided experience at customer sites to explain smart home automation quickly.
      </p>

      <div className="glass-card p-4">
        <p className="text-sm font-semibold">Smart Home Scenes</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {scenes.map((scene) => (
            <div key={scene.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-medium">{scene.title}</p>
              <p className="mt-1 text-xs text-slate-300">{scene.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4">
        <p className="text-sm font-semibold">Automation Packages</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {smartPackages.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-medium">{item.name}</p>
              <p className="mt-1 text-xs text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Link href="/ai-designer" className="block">
        <PrimaryButton className="w-full bg-blue-600 shadow-glow">Open AI Designer for Customer</PrimaryButton>
      </Link>
    </section>
  );
}
