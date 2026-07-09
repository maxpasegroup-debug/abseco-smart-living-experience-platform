"use client";

import { useRouter } from "next/navigation";
import { HomeTypeCard } from "@/components/HomeTypeCard";
import { PackageCard } from "@/components/PackageCard";
import { homeTypes, smartPackages } from "@/features/dashboard/data";

export default function ExplorePage() {
  const router = useRouter();

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
          <PackageCard key={item.id} item={item} onExplore={() => router.push("/build")} />
        ))}
      </div>
    </section>
  );
}
