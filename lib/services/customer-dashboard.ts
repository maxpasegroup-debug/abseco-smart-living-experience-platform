import type { AuthSession } from "@/lib/auth/session";
import { ActivityTimeline } from "@/lib/models/ActivityTimeline";
import { CustomerProfile } from "@/lib/models/CustomerProfile";
import { Invoice } from "@/lib/models/Invoice";
import { Lead } from "@/lib/models/Lead";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";
import { Proposal } from "@/lib/models/Proposal";
import { Receipt } from "@/lib/models/Receipt";
import { SalesNotification } from "@/lib/models/SalesNotification";
import { SmartHomePlan } from "@/lib/models/SmartHomePlan";
import { getCustomerProjects } from "@/lib/services/project-service";

export async function getOrCreateCustomerProfile(session: AuthSession) {
  return CustomerProfile.findOneAndUpdate(
    { customer_id: session.user.id },
    {
      $setOnInsert: {
        customer_id: session.user.id,
        name: session.user.name,
        phone: session.user.phone,
        email: session.user.email,
        preferred_language: "English",
        communication_preferences: { whatsapp: true, email: true, phone: true }
      }
    },
    { upsert: true, new: true }
  );
}

export async function getCustomerLeadIds(session: AuthSession) {
  const phoneOrEmail = [session.user.phone, session.user.email].filter(Boolean);
  const leads = await Lead.find({
    $or: [
      { phone: { $in: phoneOrEmail } },
      { phone: `customer-${session.user.id}` },
      { planner_plan_id: { $exists: true }, name: session.user.name || "__none__" }
    ]
  })
    .select("_id")
    .limit(50);
  return leads.map((lead) => lead._id.toString());
}

export async function getCustomerRecords(session: AuthSession) {
  const leadIds = await getCustomerLeadIds(session);
  const plans = await SmartHomePlan.find({
    $or: [{ customer_id: session.user.id }, { lead_id: { $in: leadIds } }]
  })
    .sort({ updated_at: -1 })
    .limit(20);
  const planIds = plans.map((plan) => plan._id.toString());
  const proposals = await Proposal.find({
    $or: [{ customer_id: session.user.id }, { lead_id: { $in: leadIds } }, { planner_plan_id: { $in: planIds } }]
  })
    .sort({ updated_at: -1 })
    .limit(50);
  const proposalIds = proposals.map((proposal) => proposal._id.toString());
  const orders = await Order.find({
    $or: [{ customer_id: session.user.id }, { lead_id: { $in: leadIds } }, { proposal_id: { $in: proposalIds } }]
  })
    .sort({ updated_at: -1 })
    .limit(50);
  const orderIds = orders.map((order) => order._id.toString());
  const [payments, invoices, receipts, projects, timeline, notifications, profile] = await Promise.all([
    Payment.find({ order_id: { $in: orderIds } }).sort({ created_at: -1 }).limit(100),
    Invoice.find({ order_id: { $in: orderIds } }).sort({ created_at: -1 }).limit(100),
    Receipt.find({ order_id: { $in: orderIds } }).sort({ created_at: -1 }).limit(100),
    getCustomerProjects(session.user.id, leadIds),
    ActivityTimeline.find({
      $or: [
        { customer_id: session.user.id },
        { lead_id: { $in: leadIds } },
        { planner_plan_id: { $in: planIds } },
        { order_id: { $in: orderIds } }
      ]
    })
      .sort({ created_at: -1 })
      .limit(100),
    SalesNotification.find({
      recipient_role: "customer",
      $or: [{ recipient_id: session.user.id }, { lead_id: { $in: leadIds } }],
      archived: { $ne: true }
    })
      .sort({ created_at: -1 })
      .limit(100),
    getOrCreateCustomerProfile(session)
  ]);
  return { leadIds, plans, proposals, orders, payments, invoices, receipts, projects, timeline, notifications, profile };
}

export function getNextAction(records: Awaited<ReturnType<typeof getCustomerRecords>>) {
  const latestOrder = records.orders[0];
  if (latestOrder?.payment_status === "pending") {
    return { label: "Pay booking amount", href: `/checkout/${latestOrder._id}` };
  }
  const latestProposal = records.proposals[0];
  if (latestProposal && ["sent", "viewed", "customer_review"].includes(latestProposal.status)) {
    return { label: "Review proposal", href: `/proposal/${latestProposal.proposal_url_slug}` };
  }
  if (!records.plans[0]) return { label: "Build my smart home", href: "/build" };
  return { label: "Book consultation", href: "/consultation" };
}

export function buildDocumentCenter(records: Awaited<ReturnType<typeof getCustomerRecords>>) {
  return [
    ...records.proposals.map((proposal) => ({
      id: proposal._id.toString(),
      type: "proposal",
      title: `Proposal ${proposal.proposal_url_slug}`,
      status: proposal.status,
      href: `/proposal/${proposal.proposal_url_slug}`
    })),
    ...records.invoices.map((invoice) => ({
      id: invoice._id.toString(),
      type: "invoice",
      title: invoice.invoice_number,
      status: invoice.status,
      href: invoice.download_url || `/api/commerce/invoices/${invoice.order_id}/download`
    })),
    ...records.receipts.map((receipt) => ({
      id: receipt._id.toString(),
      type: "receipt",
      title: receipt.receipt_number,
      status: receipt.status,
      href: "#"
    }))
  ];
}

export async function buildCustomerDashboard(session: AuthSession) {
  const records = await getCustomerRecords(session);
  const currentPlan = records.plans[0] || null;
  const currentProposal = records.proposals[0] || null;
  const currentOrder = records.orders[0] || null;
  const currentExecutionProject = records.projects[0] || null;
  const unreadCount = records.notifications.filter((notification) => !notification.read).length;
  return {
    profile: records.profile,
    currentProject: {
      planner: currentPlan,
      proposal: currentProposal,
      order: currentOrder,
      executionProject: currentExecutionProject,
      nextAction: getNextAction(records)
    },
    projectStatus: currentExecutionProject?.status || "not_started",
    projectProgress: currentExecutionProject?.completion_percentage || 0,
    projectEngineers: {
      primaryEngineerId: currentExecutionProject?.primary_engineer_id,
      assistantEngineerIds: currentExecutionProject?.assistant_engineer_ids || []
    },
    latestProjectPhotos: currentExecutionProject?.photos?.slice(-4).reverse() || [],
    roomProgress: currentExecutionProject?.rooms || [],
    expectedCompletion: currentExecutionProject?.expected_completion,
    plannerSummary: currentPlan,
    proposalStatus: currentProposal?.status || "not_requested",
    orderStatus: currentOrder?.status || "not_created",
    paymentStatus: currentOrder?.payment_status || "not_started",
    notifications: records.notifications,
    unreadCount,
    timeline: records.timeline,
    quickActions: [
      { label: "Book Consultation", href: "/consultation" },
      { label: "Request Site Visit", href: "/consultation?type=site_visit" },
      { label: "Contact Sales", href: "/sales" },
      { label: "WhatsApp Support", href: "https://wa.me/" },
      { label: "Download Proposal", href: currentProposal ? `/proposal/${currentProposal.proposal_url_slug}` : "/proposal" },
      { label: "View Invoice", href: records.invoices[0]?.download_url || "/orders" },
      { label: "Make Payment", href: currentOrder ? `/checkout/${currentOrder._id}` : "/orders" },
      { label: "Upgrade Smart Home", href: "/build" }
    ],
    documents: buildDocumentCenter(records),
    records
  };
}
