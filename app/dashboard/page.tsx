"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Dashboard = {
  profile?: { name?: string; phone?: string; email?: string };
  currentProject?: {
    planner?: { structured_plan?: Record<string, unknown>; recommendation?: Record<string, unknown> };
    proposal?: { status?: string; proposal_url_slug?: string };
    order?: { _id: string; order_number: string; status: string; payment_status: string; booking_amount: number; remaining_amount: number };
    executionProject?: {
      _id: string;
      project_number: string;
      status: string;
      completion_percentage: number;
      expected_completion?: string;
      primary_engineer_id?: string;
      rooms?: Array<{ room: string; status: string; completion_percentage: number }>;
      photos?: Array<{ url: string; room?: string; category: string; uploaded_at: string }>;
    };
    nextAction?: { label: string; href: string };
  };
  projectStatus?: string;
  projectProgress?: number;
  expectedCompletion?: string;
  latestProjectPhotos?: Array<{ url: string; room?: string; category: string; uploaded_at: string }>;
  roomProgress?: Array<{ room: string; status: string; completion_percentage: number }>;
  proposalStatus?: string;
  orderStatus?: string;
  paymentStatus?: string;
  unreadCount?: number;
  notifications?: Array<{ _id: string; title: string; body: string; read: boolean; created_at: string }>;
  timeline?: Array<{ _id: string; title: string; event_name: string; created_at: string }>;
  quickActions?: Array<{ label: string; href: string }>;
  documents?: Array<{ id: string; title: string; type: string; status: string; href: string }>;
};

function text(value: unknown, fallback = "-") {
  return typeof value === "string" && value ? value : fallback;
}

export default function CustomerDashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard>({});

  useEffect(() => {
    fetch("/api/customer/dashboard")
      .then((response) => response.json())
      .then((data) => setDashboard(data.dashboard || {}))
      .catch(() => setDashboard({}));
    fetch("/api/customer/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: "dashboard_visit" })
    }).catch(() => {});
  }, []);

  function trackAction(label: string) {
    const event =
      label === "Make Payment"
        ? "payment_click"
        : label === "Book Consultation" || label === "Request Site Visit"
          ? "consultation_request"
          : label === "WhatsApp Support"
            ? "support_request"
            : undefined;
    if (!event) return;
    fetch("/api/customer/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: event, metadata: { label } })
    }).catch(() => {});
  }

  async function submitProjectApproval(status: "approved" | "corrections_requested") {
    const projectId = dashboard.currentProject?.executionProject?._id;
    if (!projectId) return;
    await fetch("/api/customer/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        status,
        comments: status === "approved" ? "Digital acceptance submitted from customer dashboard." : "Corrections requested from customer dashboard.",
        rating: status === "approved" ? 5 : undefined,
        digital_acceptance: status === "approved"
      })
    }).catch(() => {});
    fetch("/api/customer/dashboard")
      .then((response) => response.json())
      .then((data) => setDashboard(data.dashboard || {}))
      .catch(() => {});
  }

  const plan = dashboard.currentProject?.planner;
  const structured = plan?.structured_plan || {};
  const recommendation = plan?.recommendation || {};
  const order = dashboard.currentProject?.order;
  const project = dashboard.currentProject?.executionProject;

  return (
    <section className="space-y-6 pb-16">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">My Smart Home</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
          Welcome{dashboard.profile?.name ? `, ${dashboard.profile.name}` : ""}
        </h1>
        <p className="max-w-xl text-sm text-slate-400">
          Your ABSECO project, plan, payments, documents, and next steps in one place.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card space-y-3 p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current project</p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                {text(recommendation.packageName, "Smart Home Plan")}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{text(structured.homeSummary)}</p>
            </div>
            {dashboard.currentProject?.nextAction && (
              <Link
                href={dashboard.currentProject.nextAction.href}
                className="rounded-full bg-[#FF6A00] px-5 py-2 text-xs font-semibold text-white"
              >
                {dashboard.currentProject.nextAction.label}
              </Link>
            )}
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-slate-500">Proposal</span><br />{dashboard.proposalStatus || "not_requested"}
            </p>
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-slate-500">Order</span><br />{dashboard.orderStatus || "not_created"}
            </p>
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-slate-500">Payment</span><br />{dashboard.paymentStatus || "not_started"}
            </p>
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-slate-500">Project</span><br />{dashboard.projectStatus || "not_started"}
            </p>
          </div>
        </div>

        <div className="glass-card space-y-3 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Profile</p>
          <p className="text-sm font-semibold text-white">{dashboard.profile?.name || "ABSECO Customer"}</p>
          <p className="text-xs text-slate-400">{dashboard.profile?.phone || dashboard.profile?.email || "Contact details pending"}</p>
          <Link href="/profile" className="text-xs font-semibold text-[#FF6A00]">Manage profile</Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Project Execution</h2>
              <p className="mt-2 text-xs text-slate-400">{project?.project_number || "Project will appear after booking payment."}</p>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-200">
              {dashboard.projectProgress || 0}%
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#FF6A00]" style={{ width: `${dashboard.projectProgress || 0}%` }} />
          </div>
          <div className="mt-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
            <p><span className="text-slate-500">Status</span><br />{dashboard.projectStatus || "not_started"}</p>
            <p><span className="text-slate-500">Primary Engineer</span><br />{project?.primary_engineer_id || "To be assigned"}</p>
            <p><span className="text-slate-500">Expected Completion</span><br />{dashboard.expectedCompletion ? new Date(dashboard.expectedCompletion).toLocaleDateString() : "To be scheduled"}</p>
          </div>
          {dashboard.projectStatus === "customer_review" && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => submitProjectApproval("approved")}
                className="rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-semibold text-white"
                type="button"
              >
                Approve Project
              </button>
              <button
                onClick={() => submitProjectApproval("corrections_requested")}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-200"
                type="button"
              >
                Request Corrections
              </button>
            </div>
          )}
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Latest Photos</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(dashboard.latestProjectPhotos || []).slice(0, 4).map((photo) => (
              <p key={`${photo.url}-${photo.uploaded_at}`}>{photo.category} | {photo.room || "Project"} | placeholder</p>
            ))}
            {(dashboard.latestProjectPhotos || []).length === 0 && <p className="text-slate-500">Photo documentation will appear during installation.</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Planner Summary</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p>Rooms: {Array.isArray(structured.selectedRooms) ? structured.selectedRooms.join(", ") : "-"}</p>
            <p>Experiences: {Array.isArray(structured.experiences) ? structured.experiences.join(", ") : "-"}</p>
            <p>Budget: {text(recommendation.estimatedBudgetRange)}</p>
          </div>
          <Link href="/my-smart-home" className="mt-4 block text-xs font-semibold text-[#FF6A00]">View smart home</Link>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Order Status</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p>{order?.order_number || "No order yet"}</p>
            <p>Booking: INR {order?.booking_amount?.toLocaleString() || 0}</p>
            <p>Remaining: INR {order?.remaining_amount?.toLocaleString() || 0}</p>
          </div>
          <Link href={order ? `/checkout/${order._id}` : "/orders"} className="mt-4 block text-xs font-semibold text-[#FF6A00]">
            {order?.payment_status === "paid" ? "View order" : "Make payment"}
          </Link>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
          <p className="mt-2 text-2xl font-semibold text-white">{dashboard.unreadCount || 0}</p>
          <p className="text-xs text-slate-500">Unread updates</p>
          <Link href="/notifications" className="mt-4 block text-xs font-semibold text-[#FF6A00]">View notifications</Link>
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {(dashboard.quickActions || []).map((action) => (
            <Link
              key={action.label}
              href={action.href}
              onClick={() => trackAction(action.label)}
              className="rounded-full border border-white/20 px-4 py-2 text-center text-xs font-semibold text-slate-200 hover:bg-white/5"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Activity Timeline</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(dashboard.timeline || []).slice(0, 8).map((item) => (
              <p key={item._id}>{new Date(item.created_at).toLocaleString()} | {item.title}</p>
            ))}
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Document Center</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(dashboard.documents || []).slice(0, 8).map((document) => (
              <Link key={document.id} href={document.href} className="block hover:text-white">
                {document.type} | {document.title} | {document.status}
              </Link>
            ))}
          </div>
          <Link href="/documents" className="mt-4 block text-xs font-semibold text-[#FF6A00]">View all documents</Link>
        </div>
      </div>
    </section>
  );
}
