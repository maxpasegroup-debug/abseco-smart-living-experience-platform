"use client";

import { useState } from "react";
import { HomeTypeCard } from "@/components/HomeTypeCard";
import { PackageCard } from "@/components/PackageCard";
import { AuthGateModal } from "@/components/AuthGateModal";
import { homeTypes, smartPackages } from "@/features/dashboard/data";

export default function ExplorePage() {
  const [authAction, setAuthAction] = useState<"" | "save this package">("");

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Explore Smart Living</h1>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {homeTypes.map((type) => (
          <HomeTypeCard key={type} type={type} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {smartPackages.map((item) => (
          <PackageCard key={item.id} item={item} onExplore={() => setAuthAction("save this package")} />
        ))}
      </div>
      <AuthGateModal isOpen={authAction !== ""} actionLabel={authAction} onClose={() => setAuthAction("")} />
    </section>
  );
}
