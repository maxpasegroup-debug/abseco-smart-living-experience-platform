"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HeroBanner } from "@/components/HeroBanner";
import { SearchBar } from "@/components/SearchBar";
import { HomeTypeCard } from "@/components/HomeTypeCard";
import { PackageCard } from "@/components/PackageCard";
import { SceneCard } from "@/components/SceneCard";
import { AuthGateModal } from "@/components/AuthGateModal";
import { PageTransition } from "@/components/PageTransition";
import { homeTypes, scenes, smartPackages } from "@/features/dashboard/data";
import { PrimaryButton } from "@/ui/PrimaryButton";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [authAction, setAuthAction] = useState<"" | "save this package">("");

  const filteredPackages = useMemo(() => {
    if (!query.trim()) return smartPackages;
    const search = query.toLowerCase();
    return smartPackages.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.features.some((feature) => feature.toLowerCase().includes(search))
    );
  }, [query]);

  return (
    <PageTransition>
      <section className="space-y-6 pb-8">
        <HeroBanner onStart={() => document.getElementById("explore-section")?.scrollIntoView()} />

        <div id="explore-section" className="space-y-3">
          <p className="section-title">Search</p>
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="space-y-3">
          <p className="section-title">Explore Home Types</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {homeTypes.map((type) => (
              <HomeTypeCard key={type} type={type} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="section-title">Smart Home Packages</p>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPackages.map((item) => (
              <PackageCard key={item.id} item={item} onExplore={() => setAuthAction("save this package")} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="section-title">Smart Scenes</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {scenes.map((scene) => (
              <SceneCard key={scene.id} scene={scene} />
            ))}
          </div>
        </div>

        <div className="glass-card flex items-center justify-between gap-3 p-4">
          <div>
            <p className="section-title">AI Smart Home Designer</p>
            <p className="text-sm text-slate-300">Build a personalized automation plan instantly.</p>
          </div>
          <Link href="/ai-designer">
            <PrimaryButton>Design My Smart Home</PrimaryButton>
          </Link>
        </div>

        <div className="space-y-3">
          <p className="section-title">Real Installations</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {["Palm Jumeirah Villa", "Downtown Apartment", "Smart Office Hub", "Luxury Penthouse"].map(
              (item) => (
                <div key={item} className="glass-card min-h-[96px] p-3 text-sm text-slate-300">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>
      <AuthGateModal isOpen={authAction !== ""} actionLabel={authAction} onClose={() => setAuthAction("")} />
    </PageTransition>
  );
}
