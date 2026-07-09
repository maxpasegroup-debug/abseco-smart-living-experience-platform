"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Snapshot = {
  customerHealth?: string;
  dashboard?: {
    profile?: { name?: string; phone?: string; email?: string };
    proposalStatus?: string;
    orderStatus?: string;
    paymentStatus?: string;
    records?: {
      plans?: unknown[];
      proposals?: unknown[];
      orders?: unknown[];
      payments?: unknown[];
      timeline?: Array<{ _id: string; title: string; created_at: string }>;
    };
  };
};

export default function ControlCustomerSnapshotPage() {
  const params = useParams<{ id: string }>();
  const [snapshot, setSnapshot] = useState<Snapshot>({});

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/customer/admin/${params.id}`)
      .then((response) => response.json())
      .then((data) => setSnapshot(data))
      .catch(() => setSnapshot({}));
  }, [params?.id]);

  const dashboard = snapshot.dashboard;

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold">Customer Snapshot</h1>
        <p className="mt-1 text-sm text-slate-400">Dashboard snapshot, health, project status, and timeline.</p>
      </div>

      <div className="glass-card grid gap-3 p-5 text-sm sm:grid-cols-4">
        <p><span className="text-slate-500">Customer</span><br />{dashboard?.profile?.name || params?.id}</p>
        <p><span className="text-slate-500">Health</span><br />{snapshot.customerHealth || "active"}</p>
        <p><span className="text-slate-500">Proposal</span><br />{dashboard?.proposalStatus || "-"}</p>
        <p><span className="text-slate-500">Payment</span><br />{dashboard?.paymentStatus || "-"}</p>
        <p><span className="text-slate-500">Plans</span><br />{dashboard?.records?.plans?.length || 0}</p>
        <p><span className="text-slate-500">Proposals</span><br />{dashboard?.records?.proposals?.length || 0}</p>
        <p><span className="text-slate-500">Orders</span><br />{dashboard?.records?.orders?.length || 0}</p>
        <p><span className="text-slate-500">Payments</span><br />{dashboard?.records?.payments?.length || 0}</p>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-white">Timeline</h2>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          {(dashboard?.records?.timeline || []).slice(0, 20).map((item) => (
            <p key={item._id}>{new Date(item.created_at).toLocaleString()} | {item.title}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
