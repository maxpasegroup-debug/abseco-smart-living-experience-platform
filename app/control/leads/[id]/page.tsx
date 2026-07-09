"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type LeadDetails = {
  lead?: {
    name: string;
    phone: string;
    location: string;
    home_type: string;
    budget: string;
    lead_score?: number;
    lead_temperature?: string;
    recommendation?: Record<string, unknown>;
    assigned_sales_rep?: string;
    status?: string;
    lead_source?: string;
    customer_intent?: string;
    buying_timeline?: string;
    preferred_contact_method?: string;
  };
  plannerSummary?: {
    recommendation?: { packageName?: string; estimatedBudgetRange?: string };
    structured_plan?: { selectedRooms?: string[]; experiences?: string[] };
  };
  proposals?: Array<{ _id: string; status: string; proposal_url_slug: string }>;
  orders?: Array<{ _id: string; order_number: string; status: string; payment_status: string; booking_amount: number }>;
  consultations?: Array<{ _id: string; consultation_type: string; date: string; time: string; status: string }>;
  siteVisits?: Array<{ _id: string; date: string; location: string; status: string }>;
  timeline?: Array<{ _id: string; title: string; event_name: string; created_at: string }>;
};

export default function ControlLeadDetailsPage() {
  const params = useParams<{ id: string }>();
  const [details, setDetails] = useState<LeadDetails>({});

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/leads/${params.id}`)
      .then((response) => response.json())
      .then((data) => setDetails(data))
      .catch(() => setDetails({}));
  }, [params?.id]);

  const lead = details.lead;

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold">Lead Details</h1>
        <p className="mt-1 text-sm text-slate-400">
          Planner summary, sales assignment, proposal status, consultation, and timeline.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card space-y-2 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white">{lead?.name || "Lead"}</h2>
          <p className="text-xs text-slate-400">{lead?.phone} | {lead?.location}</p>
          <div className="grid gap-3 pt-3 text-sm sm:grid-cols-3">
            <p><span className="text-slate-500">Home</span><br />{lead?.home_type || "-"}</p>
            <p><span className="text-slate-500">Budget</span><br />{lead?.budget || "-"}</p>
            <p><span className="text-slate-500">Score</span><br />{lead?.lead_score || 0} / {lead?.lead_temperature || "warm"}</p>
            <p><span className="text-slate-500">Status</span><br />{lead?.status || "new"}</p>
            <p><span className="text-slate-500">Assigned</span><br />{lead?.assigned_sales_rep || "-"}</p>
            <p><span className="text-slate-500">Source</span><br />{lead?.lead_source || "-"}</p>
            <p><span className="text-slate-500">Intent</span><br />{lead?.customer_intent || "-"}</p>
            <p><span className="text-slate-500">Timeline</span><br />{lead?.buying_timeline || "-"}</p>
            <p><span className="text-slate-500">Contact</span><br />{lead?.preferred_contact_method || "-"}</p>
          </div>
        </div>

        <div className="glass-card space-y-2 p-5">
          <h2 className="text-sm font-semibold text-white">Planner</h2>
          <p className="text-sm text-slate-300">
            {details.plannerSummary?.recommendation?.packageName || "No planner package yet"}
          </p>
          <p className="text-xs text-slate-500">
            {details.plannerSummary?.recommendation?.estimatedBudgetRange || ""}
          </p>
          <p className="text-xs text-slate-400">
            {(details.plannerSummary?.structured_plan?.selectedRooms || []).join(", ") || "Rooms not captured"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Proposals</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(details.proposals || []).map((proposal) => (
              <p key={proposal._id}>{proposal.status} | {proposal.proposal_url_slug}</p>
            ))}
            {(details.proposals || []).length === 0 && <p className="text-slate-500">No proposals yet.</p>}
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Orders</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(details.orders || []).map((order) => (
              <p key={order._id}>{order.order_number} | {order.status} | {order.payment_status}</p>
            ))}
            {(details.orders || []).length === 0 && <p className="text-slate-500">No orders yet.</p>}
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Consultations</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(details.consultations || []).map((consultation) => (
              <p key={consultation._id}>{consultation.consultation_type} | {consultation.date} {consultation.time}</p>
            ))}
            {(details.consultations || []).length === 0 && <p className="text-slate-500">No consultations yet.</p>}
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Site Visits</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(details.siteVisits || []).map((visit) => (
              <p key={visit._id}>{visit.status} | {visit.date} | {visit.location}</p>
            ))}
            {(details.siteVisits || []).length === 0 && <p className="text-slate-500">No site visits yet.</p>}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-white">Timeline</h2>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          {(details.timeline || []).map((item) => (
            <p key={item._id}>
              {new Date(item.created_at).toLocaleString()} | {item.title}
            </p>
          ))}
          {(details.timeline || []).length === 0 && <p className="text-slate-500">No activity yet.</p>}
        </div>
      </div>
    </section>
  );
}
