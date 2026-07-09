import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { Consultation } from "@/lib/models/Consultation";
import { Lead } from "@/lib/models/Lead";
import { Proposal } from "@/lib/models/Proposal";
import { ProposalRequest } from "@/lib/models/ProposalRequest";
import { SiteVisit } from "@/lib/models/SiteVisit";
import { SmartHomePlan } from "@/lib/models/SmartHomePlan";

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!hasAnyRole(session?.user.role, CONTROL_ROLES)) {
      return apiError(session ? "FORBIDDEN" : "UNAUTHENTICATED", session ? "Forbidden." : "Authentication required.", session ? 403 : 401);
    }
    await connectDb();
    const [
      completedPlans,
      proposalRequests,
      consultations,
      siteVisits,
      sentProposals,
      approvedProposals,
      sourcePerformance,
      campaignPerformance,
      convertedProposals
    ] = await Promise.all([
      SmartHomePlan.countDocuments({ status: "completed" }),
      ProposalRequest.countDocuments({}),
      Consultation.countDocuments({}),
      SiteVisit.countDocuments({}),
      Proposal.countDocuments({ status: { $in: ["sent", "viewed", "customer_review", "approved", "accepted", "converted"] } }),
      Proposal.countDocuments({ status: { $in: ["approved", "accepted", "converted"] } }),
      Lead.aggregate([{ $group: { _id: "$lead_source", leads: { $sum: 1 }, average_score: { $avg: "$lead_score" } } }]),
      Lead.aggregate([{ $group: { _id: "$campaign", leads: { $sum: 1 }, average_score: { $avg: "$lead_score" } } }]),
      Proposal.find({ status: { $in: ["approved", "accepted", "converted"] }, requested_at: { $exists: true } }).select(
        "requested_at approved_at converted_at decided_at"
      )
    ]);

    const salesCycleDays = convertedProposals
      .map((proposal) => {
        const start = proposal.requested_at?.getTime();
        const end = (proposal.converted_at || proposal.approved_at || proposal.decided_at)?.getTime();
        if (!start || !end) return null;
        return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      })
      .filter((value): value is number => typeof value === "number");
    const averageSalesCycle =
      salesCycleDays.length > 0
        ? Math.round(salesCycleDays.reduce((sum, value) => sum + value, 0) / salesCycleDays.length)
        : 0;

    return apiOk({
      metrics: {
        planner_to_proposal_pct: pct(proposalRequests, completedPlans),
        proposal_to_consultation_pct: pct(consultations, proposalRequests),
        consultation_to_site_visit_pct: pct(siteVisits, consultations),
        site_visit_to_proposal_approval_pct: pct(approvedProposals, siteVisits),
        proposal_approval_pct: pct(approvedProposals, sentProposals || proposalRequests),
        average_sales_cycle_days: averageSalesCycle
      },
      sourcePerformance,
      campaignPerformance
    });
  } catch (error) {
    return handleApiError(error);
  }
}
