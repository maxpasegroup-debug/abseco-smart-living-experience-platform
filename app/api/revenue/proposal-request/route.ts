import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { connectDb } from "@/lib/db/connect";
import { SmartHomePlan } from "@/lib/models/SmartHomePlan";
import {
  createPlannerProposal,
  createProposalRequestForPlan,
  upsertPlannerLead
} from "@/lib/services/revenue-engine";

const proposalRequestSchema = z.object({
  planner_plan_id: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    const body = await parseJson(request, proposalRequestSchema);
    await connectDb();

    const plan = await SmartHomePlan.findById(body.planner_plan_id);
    if (!plan) return apiError("NOT_FOUND", "Planner plan not found.", 404);
    if (session.user.role === "customer" && plan.customer_id !== session.user.id) {
      return apiError("FORBIDDEN", "You cannot request a proposal for this plan.", 403);
    }

    const { lead } = await upsertPlannerLead({ plan, session, requestedProposal: true });
    if (!lead) return apiError("SERVER_ERROR", "Unable to create lead.", 500);
    const proposalRequest = await createProposalRequestForPlan({
      plan,
      leadId: lead._id.toString(),
      customerId: plan.customer_id
    });
    const proposal =
      proposalRequest?.proposal_id
        ? null
        : await createPlannerProposal({
            leadId: lead._id.toString(),
            customerId: plan.customer_id,
            plannerPlanId: plan._id.toString(),
            proposalRequestId: proposalRequest?._id.toString(),
            recommendation: plan.recommendation,
            answers: plan.answers as never
          });
    if (proposalRequest && proposal) {
      proposalRequest.proposal_id = proposal._id.toString();
      await proposalRequest.save();
    }
    plan.lead_id = lead._id.toString();
    plan.proposal_id = proposalRequest?.proposal_id || proposal?._id.toString();
    plan.conversion_status = "proposal_requested";
    await plan.save();

    return apiOk({ proposalRequest, proposal }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
