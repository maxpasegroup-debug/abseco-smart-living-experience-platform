import { ActivityTimeline } from "@/lib/models/ActivityTimeline";
import { Lead, type LeadDocument, type LeadTemperature } from "@/lib/models/Lead";
import { Proposal } from "@/lib/models/Proposal";
import { ProposalRequest } from "@/lib/models/ProposalRequest";
import { SalesNotification, type SalesNotificationDocument } from "@/lib/models/SalesNotification";
import type { SmartHomePlanDocument } from "@/lib/models/SmartHomePlan";
import type { AuthSession } from "@/lib/auth/session";

type PlannerAnswers = {
  homeType?: string;
  rooms?: string[];
  lifestyles?: string[];
  family?: { members?: number; children?: boolean; parents?: boolean; pets?: boolean };
  budget?: string;
  goals?: string[];
  preferredContactMethod?: "phone" | "whatsapp" | "email" | "video";
  buyingTimeline?: string;
  region?: string;
  campaign?: string;
};

type PlannerSignals = {
  plannerCompleted?: boolean;
  requestedConsultation?: boolean;
  requestedProposal?: boolean;
  cameraExperienceUsed?: boolean;
  completionPercentage?: number;
};

type ScoreResult = {
  score: number;
  temperature: LeadTemperature;
  status: LeadDocument["status"];
  tags: string[];
  customerIntent: string;
};

const budgetWeights: Record<string, number> = {
  "Under 2L": 5,
  "2L - 5L": 12,
  "5L - 10L": 20,
  "10L - 20L": 28,
  "20L+": 35
};

function normalizeAnswers(value: unknown): PlannerAnswers {
  if (!value || typeof value !== "object") return {};
  return value as PlannerAnswers;
}

function getBudgetWeight(budget?: string) {
  if (!budget) return 0;
  const direct = budgetWeights[budget];
  if (typeof direct === "number") return direct;
  if (budget.includes("20")) return 35;
  if (budget.includes("10")) return 28;
  if (budget.includes("5")) return 20;
  if (budget.includes("2")) return 12;
  return 5;
}

export function scorePlannerLead(answersValue: unknown, signals: PlannerSignals = {}): ScoreResult {
  const answers = normalizeAnswers(answersValue);
  const rooms = answers.rooms || [];
  const lifestyles = answers.lifestyles || [];
  const goals = answers.goals || [];
  const tags = new Set<string>();
  let score = 0;

  score += getBudgetWeight(answers.budget);
  score += Math.min(rooms.length * 6, 30);
  score += Math.min((signals.completionPercentage || 0) / 2, 20);
  if (signals.plannerCompleted) score += 15;
  if (signals.cameraExperienceUsed) score += 10;
  if (signals.requestedProposal) score += 25;
  if (signals.requestedConsultation) score += 20;

  if (lifestyles.includes("Luxury")) {
    score += 15;
    tags.add("luxury-interest");
  }
  if (goals.includes("Security") || lifestyles.includes("Security")) tags.add("security");
  if (goals.includes("Cinema") || lifestyles.includes("Entertainment")) tags.add("entertainment");
  if (answers.family?.parents) tags.add("senior-friendly");
  if (answers.family?.children) tags.add("child-friendly");
  if (answers.family?.pets) tags.add("pet-friendly");
  if (answers.buyingTimeline) tags.add(`timeline:${answers.buyingTimeline}`);

  const capped = Math.max(0, Math.min(100, Math.round(score)));
  const temperature: LeadTemperature = capped >= 70 ? "hot" : capped >= 40 ? "warm" : "cold";
  const status: LeadDocument["status"] =
    capped >= 80 || signals.requestedProposal || signals.requestedConsultation ? "qualified" : "new";
  const customerIntent =
    signals.requestedProposal ? "proposal" : signals.requestedConsultation ? "consultation" : "planning";

  return { score: capped, temperature, status, tags: Array.from(tags), customerIntent };
}

export function assignSalesRep(params: {
  region?: string;
  budget?: string;
  manualOverride?: string;
  currentAssignee?: string;
}) {
  if (params.manualOverride) {
    return { salesRep: params.manualOverride, reason: "manual_override" };
  }
  if (params.currentAssignee) {
    return { salesRep: params.currentAssignee, reason: "existing_assignment" };
  }
  const region = params.region?.toLowerCase() || "";
  const highBudget = getBudgetWeight(params.budget) >= 28;
  if (highBudget) return { salesRep: "sales-manager-luxury", reason: "high_budget" };
  if (region.includes("dubai")) return { salesRep: "sales-executive-dubai", reason: "region" };
  if (region.includes("abu dhabi")) return { salesRep: "sales-executive-abu-dhabi", reason: "region" };
  return { salesRep: "sales-executive-default", reason: "availability" };
}

export async function recordTimeline(params: {
  leadId?: string;
  customerId?: string;
  plannerPlanId?: string;
  proposalId?: string;
  orderId?: string;
  projectId?: string;
  consultationId?: string;
  siteVisitId?: string;
  eventName: string;
  title: string;
  metadata?: Record<string, unknown>;
}) {
  return ActivityTimeline.create({
    lead_id: params.leadId,
    customer_id: params.customerId,
    planner_plan_id: params.plannerPlanId,
    proposal_id: params.proposalId,
    order_id: params.orderId,
    project_id: params.projectId,
    consultation_id: params.consultationId,
    site_visit_id: params.siteVisitId,
    event_name: params.eventName,
    title: params.title,
    metadata: params.metadata
  });
}

export async function notifyRevenue(params: {
  type: SalesNotificationDocument["type"];
  leadId: string;
  title: string;
  body: string;
  recipientRole?: SalesNotificationDocument["recipient_role"];
  recipientId?: string;
}) {
  return SalesNotification.create({
    type: params.type,
    lead_id: params.leadId,
    title: params.title,
    body: params.body,
    recipient_role: params.recipientRole,
    recipient_id: params.recipientId
  });
}

export async function upsertPlannerLead(params: {
  plan: SmartHomePlanDocument & { _id?: { toString(): string } };
  session?: AuthSession | null;
  requestedProposal?: boolean;
  requestedConsultation?: boolean;
  cameraExperienceUsed?: boolean;
}) {
  const answers = normalizeAnswers(params.plan.answers);
  const scoring = scorePlannerLead(answers, {
    plannerCompleted: params.plan.status === "completed",
    requestedProposal: params.requestedProposal,
    requestedConsultation: params.requestedConsultation,
    cameraExperienceUsed: params.cameraExperienceUsed,
    completionPercentage: params.plan.status === "completed" ? 100 : Math.round((params.plan.current_step / 7) * 100)
  });
  const planId = params.plan._id?.toString();
  const phone =
    params.session?.user.phone ||
    params.session?.user.email ||
    (params.session?.user.id ? `customer-${params.session.user.id}` : `planner-${planId}`);
  const region = answers.region || "";
  let existing = planId ? await Lead.findOne({ planner_plan_id: planId }).sort({ created_at: -1 }) : null;
  if (!existing && phone) {
    existing = await Lead.findOne({ phone }).sort({ created_at: -1 });
  }
  const assignment = assignSalesRep({
    region,
    budget: answers.budget,
    currentAssignee: existing?.assigned_sales_rep
  });
  const assignmentChanged = existing?.assigned_sales_rep !== assignment.salesRep;
  const payload = {
    name: params.session?.user.name || existing?.name || "Planner Lead",
    phone,
    location: region || existing?.location || "Not captured",
    home_type: answers.homeType || existing?.home_type || "Smart Home",
    rooms: (answers.rooms || []).join(", "),
    budget: answers.budget || existing?.budget || "Not captured",
    priority: scoring.temperature === "hot" ? "High" : scoring.temperature === "warm" ? "Medium" : "Low",
    lead_score: scoring.score,
    lead_temperature: scoring.temperature,
    planner_score: scoring.score,
    planner_plan_id: planId,
    recommendation: params.plan.recommendation,
    customer_intent: scoring.customerIntent,
    preferred_contact_method: answers.preferredContactMethod,
    buying_timeline: answers.buyingTimeline,
    tags: scoring.tags,
    region,
    lead_source: params.plan.source || "unified-planner",
    campaign: answers.campaign,
    referral_source: params.plan.source || "unified-planner",
    status: scoring.status,
    interest_level: scoring.temperature,
    assigned_sales_rep: assignment.salesRep,
    last_activity: new Date()
  };
  const lead = existing
    ? await Lead.findByIdAndUpdate(
        existing._id,
        {
          $set: payload,
          ...(assignmentChanged
            ? {
                $push: {
                  assignment_history: {
                    sales_rep: assignment.salesRep,
                    reason: assignment.reason,
                    assigned_at: new Date()
                  }
                }
              }
            : {})
        },
        { new: true }
      )
    : await Lead.create({
        ...payload,
        assignment_history: [{ sales_rep: assignment.salesRep, reason: assignment.reason, assigned_at: new Date() }]
      });

  if (lead && assignmentChanged) {
    await notifyRevenue({
      type: "assignment",
      leadId: lead._id.toString(),
      title: "Lead assigned",
      body: `${lead.name} assigned to ${assignment.salesRep}.`,
      recipientRole: "sales",
      recipientId: assignment.salesRep
    });
  }
  if (lead && scoring.temperature === "hot") {
    await notifyRevenue({
      type: "hot_lead",
      leadId: lead._id.toString(),
      title: "Hot planner lead",
      body: `${lead.name} scored ${scoring.score}/100 from the smart home planner.`,
      recipientRole: "sales",
      recipientId: assignment.salesRep
    });
  }
  return { lead, scoring, assignment };
}

export async function createProposalRequestForPlan(params: {
  plan: SmartHomePlanDocument & { _id?: { toString(): string } };
  leadId: string;
  customerId?: string;
}) {
  const planId = params.plan._id?.toString();
  if (!planId) return null;
  const lead = await Lead.findById(params.leadId);
  const request = await ProposalRequest.findOneAndUpdate(
    { planner_plan_id: planId, lead_id: params.leadId },
    {
      $setOnInsert: {
        customer_id: params.customerId,
        requested_at: new Date()
      },
      $set: {
        assigned_sales_rep: lead?.assigned_sales_rep,
        status: "requested"
      }
    },
    { upsert: true, new: true }
  );
  await Lead.updateOne({ _id: params.leadId }, { status: "proposal_requested", last_activity: new Date() });
  await recordTimeline({
    leadId: params.leadId,
    customerId: params.customerId,
    plannerPlanId: planId,
    eventName: "proposal_requested",
    title: "Proposal requested",
    metadata: { proposal_request_id: request._id.toString() }
  });
  await notifyRevenue({
    type: "proposal_request",
    leadId: params.leadId,
    title: "Proposal requested",
    body: `${lead?.name || "Customer"} requested a proposal from the planner.`,
    recipientRole: "sales",
    recipientId: lead?.assigned_sales_rep
  });
  return request;
}

export async function markProposalStatusTimestamp(proposal: {
  status_history?: unknown[];
  requested_at?: Date;
  preparing_at?: Date;
  internal_review_at?: Date;
  sent_at?: Date;
  viewed_at?: Date;
  customer_review_at?: Date;
  revision_requested_at?: Date;
  approved_at?: Date;
  rejected_at?: Date;
  expired_at?: Date;
  converted_at?: Date;
  decided_at?: Date;
  status: string;
}, status: string, changedBy?: string, notes?: string) {
  const now = new Date();
  proposal.status = status;
  if (status === "requested") proposal.requested_at = now;
  if (status === "preparing") proposal.preparing_at = now;
  if (status === "internal_review") proposal.internal_review_at = now;
  if (status === "sent") proposal.sent_at = now;
  if (status === "viewed") proposal.viewed_at = now;
  if (status === "customer_review") proposal.customer_review_at = now;
  if (status === "revision_requested") proposal.revision_requested_at = now;
  if (status === "approved" || status === "accepted") {
    proposal.approved_at = now;
    proposal.decided_at = now;
  }
  if (status === "rejected") {
    proposal.rejected_at = now;
    proposal.decided_at = now;
  }
  if (status === "expired") proposal.expired_at = now;
  if (status === "converted") proposal.converted_at = now;
  proposal.status_history = [
    ...((proposal.status_history as unknown[]) || []),
    { status, changed_by: changedBy, changed_at: now, notes }
  ];
}

export async function createPlannerProposal(params: {
  leadId: string;
  customerId?: string;
  plannerPlanId?: string;
  proposalRequestId?: string;
  recommendation?: Record<string, unknown>;
  answers?: PlannerAnswers;
}) {
  const slug = `${params.leadId.slice(-6)}-${Date.now().toString(36)}`;
  const recommendation = params.recommendation || {};
  const answers = params.answers || {};
  const proposal = await Proposal.create({
    lead_id: params.leadId,
    customer_id: params.customerId,
    planner_plan_id: params.plannerPlanId,
    proposal_request_id: params.proposalRequestId,
    assigned_sales_rep: undefined,
    property_type: answers.homeType || "Smart Home",
    rooms: answers.rooms || [],
    automation_categories: (recommendation.recommendedExperiences as string[]) || answers.goals || [],
    estimated_cost_min: undefined,
    estimated_cost_max: undefined,
    currency: "INR",
    status: "requested",
    status_history: [{ status: "requested", changed_at: new Date(), notes: "Created from planner request" }],
    requested_at: new Date(),
    proposal_url_slug: slug
  });
  return proposal;
}
