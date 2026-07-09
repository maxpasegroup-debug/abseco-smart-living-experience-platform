"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Proposal = {
  _id: string;
  proposal_url_slug: string;
  status: string;
  property_type: string;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  status_history?: Array<{ status: string; changed_at: string; notes?: string }>;
};

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    fetch("/api/customer/proposals")
      .then((response) => response.json())
      .then((data) => setProposals(data.proposals || []))
      .catch(() => setProposals([]));
  }, []);

  function trackProposalView(proposalId: string) {
    fetch("/api/customer/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: "proposal_view", metadata: { proposal_id: proposalId } })
    }).catch(() => {});
  }

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">My Proposals</h1>
        <p className="mt-1 text-sm text-slate-400">Proposal status, pricing, approval, revisions, and activity.</p>
      </div>

      <div className="space-y-3">
        {proposals.map((proposal) => (
          <div key={proposal._id} className="glass-card space-y-3 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{proposal.property_type}</p>
                <p className="text-xs text-slate-400">{proposal.status}</p>
              </div>
              <Link
                href={`/proposal/${proposal.proposal_url_slug}`}
                onClick={() => trackProposalView(proposal._id)}
                className="rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-semibold text-white"
              >
                View Proposal
              </Link>
            </div>
            <p className="text-xs text-slate-300">
              Price: INR {proposal.estimated_cost_min?.toLocaleString() || 0} - INR {proposal.estimated_cost_max?.toLocaleString() || 0}
            </p>
            <div className="space-y-1 text-xs text-slate-500">
              {(proposal.status_history || []).slice(-3).map((item, index) => (
                <p key={`${item.status}-${index}`}>{item.status} | {new Date(item.changed_at).toLocaleString()} {item.notes ? `| ${item.notes}` : ""}</p>
              ))}
            </div>
          </div>
        ))}
        {proposals.length === 0 && <p className="glass-card p-5 text-sm text-slate-400">No proposals yet.</p>}
      </div>
    </section>
  );
}
