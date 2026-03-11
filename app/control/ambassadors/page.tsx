"use client";

export default function AmbassadorsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Smart Living Ambassadors</h1>
        <p className="text-sm text-slate-300">
          Leaderboard of customers whose homes generate new referrals.
        </p>
      </div>
      <div className="glass-card p-4 text-xs text-slate-400">
        <p>
          Ambassador tracking models and showcase pages are in place. This view can be
          extended with an <code className="rounded bg-white/10 px-1">/api/ambassadors</code>{" "}
          endpoint to show real-time rankings.
        </p>
      </div>
    </section>
  );
}

