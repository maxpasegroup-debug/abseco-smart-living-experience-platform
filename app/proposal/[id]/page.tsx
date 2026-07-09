"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Proposal = {
  _id: string;
  property_type: string;
  rooms: string[];
  automation_categories: string[];
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  currency: string;
  pdf_url?: string;
  status?: string;
};

type ProposalItem = {
  _id: string;
  product_name: string;
  category: string;
  room?: string;
  description?: string;
};

export default function PublicProposalPage() {
  const params = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/proposals/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setProposal(d.proposal || null);
        setItems(d.items || []);
      })
      .catch(() => {
        setProposal(null);
        setItems([]);
      });
  }, [params?.id]);

  if (!proposal) {
    return (
      <section className="space-y-4">
        <h1 className="text-xl font-semibold">Smart Home Proposal</h1>
        <p className="text-sm text-slate-400">Loading proposal...</p>
      </section>
    );
  }

  const hasRange =
    typeof proposal.estimated_cost_min === "number" &&
    typeof proposal.estimated_cost_max === "number";

  async function recordAction(action: "approved" | "rejected" | "revision_requested" | "viewed") {
    setMessage(null);
    const res = await fetch(`/api/proposals/${params.id}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(data.error?.message || data.error || "Unable to update proposal.");
      return;
    }
    setProposal(data.proposal || proposal);
    setOrderId(data.order?._id || null);
    setCheckoutToken(data.order?.checkout_token || null);
    setMessage(
      action === "approved"
        ? "Proposal approved. Your booking order is ready."
        : action === "rejected"
          ? "Proposal rejected. The sales team has been notified."
          : action === "revision_requested"
            ? "Change request sent to the sales team."
            : "Proposal activity recorded."
    );
  }

  function handleDownload() {
    if (!proposal) return;
    if (proposal.pdf_url) {
      window.open(proposal.pdf_url, "_blank");
      return;
    }
    setMessage("PDF download will be available after the final proposal is prepared.");
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "ABSECO Smart Home Proposal", url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setMessage("Proposal link copied.");
    }
  }

  return (
    <section className="space-y-6 pb-12">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
          Your ABSECO Smart Home Proposal
        </h1>
        <p className="text-sm text-slate-400">
          A tailored automation plan for your {proposal.property_type.toLowerCase()}.
        </p>
      </div>

      <div className="glass-card space-y-4 p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">Project Overview</h2>
        <p className="text-sm text-slate-300">
          This proposal outlines how lighting, comfort, security, and entertainment work
          together to create your smart home experience.
        </p>
        {hasRange && (
          <div className="mt-4 rounded-2xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-300">
              Estimated investment
            </p>
            <p className="mt-2 font-display text-xl font-semibold text-white">
              {proposal.currency}{" "}
              {proposal.estimated_cost_min!.toLocaleString()} –{" "}
              {proposal.currency} {proposal.estimated_cost_max!.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Final amount depends on exact scope, finishes, and on‑site conditions.
            </p>
          </div>
        )}
      </div>

      <div className="glass-card space-y-4 p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">
          Recommended Automation Systems
        </h2>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {proposal.automation_categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-white/5 px-3 py-1 text-slate-200"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {proposal.rooms.length > 0 && (
        <div className="glass-card space-y-4 p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-white">
            Room‑by‑Room Automation Plan
          </h2>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {proposal.rooms.map((room) => (
              <div
                key={room}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
              >
                <p className="font-semibold">{room}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Lighting, comfort, and control designed for this space.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="glass-card space-y-3 p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-white">Scope Details</h2>
          <ul className="space-y-1 text-sm text-slate-300">
            {items.map((item) => (
              <li key={item._id}>
                • {item.product_name} – {item.category}
                {item.room ? ` · ${item.room}` : ""}{" "}
                {item.description ? ` · ${item.description}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="glass-card flex flex-wrap items-center justify-between gap-3 p-6 sm:p-8">
        <div>
          <p className="font-display text-sm font-semibold text-white">
            Ready for the next step?
          </p>
          <p className="mt-1 text-xs text-slate-400">
            You can accept this proposal, request changes, or book installation.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <button
            type="button"
            onClick={() => recordAction("approved")}
            className="inline-block rounded-full bg-[#FF6A00] px-5 py-2 font-semibold text-white shadow-[0_0_18px_rgba(255,106,0,0.5)]"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => recordAction("revision_requested")}
            className="inline-block rounded-full border border-white/30 px-5 py-2 font-semibold text-slate-200 hover:border-white/50 hover:bg-white/5"
          >
            Request Changes
          </button>
          <button
            type="button"
            onClick={() => recordAction("rejected")}
            className="inline-block rounded-full border border-white/20 px-5 py-2 font-semibold text-slate-200 hover:border-white/40 hover:bg-white/5"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-block rounded-full border border-white/20 px-5 py-2 font-semibold text-slate-200 hover:border-white/40 hover:bg-white/5"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-block rounded-full border border-white/20 px-5 py-2 font-semibold text-slate-200 hover:border-white/40 hover:bg-white/5"
          >
            Share
          </button>
          <Link href="/consultation">
            <span className="inline-block rounded-full border border-white/20 px-5 py-2 font-semibold text-slate-200 hover:border-white/40 hover:bg-white/5">
              Book Consultation
            </span>
          </Link>
        </div>
        {message && <p className="w-full text-xs text-slate-300">{message}</p>}
        {orderId && (
          <Link
            href={`/checkout/${orderId}${checkoutToken ? `?token=${checkoutToken}` : ""}`}
            className="w-full text-xs font-semibold text-[#FF6A00]"
          >
            Continue to checkout
          </Link>
        )}
      </div>
    </section>
  );
}

