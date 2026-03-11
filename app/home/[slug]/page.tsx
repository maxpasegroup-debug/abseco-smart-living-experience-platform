"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Ambassador = {
  _id: string;
  code: string;
  showcase_slug: string;
  city?: string;
};

type Lead = { name: string; location: string; home_type: string };

export default function HomeShowcasePage() {
  const params = useParams<{ slug: string }>();
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`/api/ambassadors/${params.slug}`)
      .then((r) => r.json())
      .then((d) => {
        setAmbassador(d.ambassador || null);
        setLead(d.lead || null);
      })
      .catch(() => {
        setAmbassador(null);
        setLead(null);
      });
  }, [params?.slug]);

  if (!ambassador || !lead) {
    return (
      <section className="space-y-4">
        <h1 className="text-xl font-semibold">Smart Living Showcase</h1>
        <p className="text-sm text-slate-400">Loading this smart home...</p>
      </section>
    );
  }

  const refCode = `amb_${ambassador.code}`;
  const showroomUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/dream?ref=${encodeURIComponent(refCode)}`
      : `/dream?ref=${encodeURIComponent(refCode)}`;

  return (
    <section className="space-y-6 pb-16">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Smart Living Showcase
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
          {lead.name}&apos;s Smart Home · {lead.location || ambassador.city}
        </h1>
        <p className="text-sm text-slate-400">
          Powered by ABSECO Smart Living · {lead.home_type}
        </p>
      </div>

      <div className="glass-card space-y-4 p-6 sm:p-8">
        <p className="text-sm font-semibold text-white">Scenes in this home</p>
        <ul className="mt-2 space-y-1 text-sm text-slate-300">
          <li>• Luxury living room with smart lighting and curtains</li>
          <li>• Cinema mode for movie nights</li>
          <li>• Bedroom scenes for wake‑up and sleep</li>
          <li>• Security cameras and perimeter protection</li>
        </ul>
      </div>

      <div className="glass-card space-y-4 p-6 sm:p-8">
        <p className="text-sm font-semibold text-white">
          Experience smart living like this
        </p>
        <p className="text-xs text-slate-400">
          Design your own dream smart home in a few taps, then see it in your room and
          book a consultation.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <a
            href={showroomUrl}
            className="rounded-full bg-[#FF6A00] px-5 py-2 font-semibold text-white shadow-[0_0_18px_rgba(255,106,0,0.5)]"
          >
            Design My Smart Home
          </a>
          <Link href="/experience">
            <span className="inline-block rounded-full border border-white/30 px-5 py-2 font-semibold text-slate-200 hover:border-white/50 hover:bg-white/5">
              Experience In My Room
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

