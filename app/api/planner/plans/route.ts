import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { SmartHomePlan } from "@/lib/models/SmartHomePlan";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { getSessionFromRequest } from "@/lib/auth/session";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import {
  createPlannerProposal,
  createProposalRequestForPlan,
  recordTimeline,
  upsertPlannerLead
} from "@/lib/services/revenue-engine";

const plannerPlanSchema = z.object({
  id: z.string().optional(),
  status: z.enum(["draft", "completed"]).default("draft"),
  currentStep: z.number().min(1).max(7).default(1),
  answers: z.record(z.unknown()),
  recommendation: z.record(z.unknown()).optional(),
  structuredPlan: z.record(z.unknown()).optional(),
  leadId: z.string().optional(),
  proposalId: z.string().optional(),
  conversionStatus: z.enum(["saved", "proposal_requested", "consultation_booked"]).optional(),
  source: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    await connectDb();
    const query =
      session?.user.role === "customer"
        ? { customer_id: session.user.id }
        : {};
    const plans = await SmartHomePlan.find(query).sort({ updated_at: -1 }).limit(100);
    return apiOk({ plans });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    const body = await parseJson(request, plannerPlanSchema);
    await connectDb();

    const payload = {
      customer_id: session?.user.id,
      status: body.status,
      current_step: body.currentStep,
      answers: body.answers,
      recommendation: body.recommendation,
      structured_plan: body.structuredPlan,
      lead_id: body.leadId,
      proposal_id: body.proposalId,
      conversion_status: body.conversionStatus || "saved",
      source: body.source || "unified-planner"
    };

    const plan = body.id
      ? await SmartHomePlan.findByIdAndUpdate(body.id, { $set: payload }, { new: true })
      : await SmartHomePlan.create(payload);

    if (!plan) {
      return apiError("SERVER_ERROR", "Unable to save planner plan.", 500);
    }

    if (body.status === "completed") {
      const requestedProposal = body.conversionStatus === "proposal_requested";
      const requestedConsultation = body.conversionStatus === "consultation_booked";
      const { lead, scoring } = await upsertPlannerLead({
        plan,
        session,
        requestedProposal,
        requestedConsultation
      });

      if (lead) {
        plan.lead_id = lead._id.toString();
        plan.planner_score = scoring.score;
        plan.lead_temperature = scoring.temperature;
        await plan.save();

        await recordTimeline({
          leadId: lead._id.toString(),
          customerId: session.user.id,
          plannerPlanId: plan._id.toString(),
          eventName: "planner_completed",
          title: "Planner completed",
          metadata: {
            score: scoring.score,
            temperature: scoring.temperature,
            conversion_status: body.conversionStatus || "saved"
          }
        });

        if (requestedProposal) {
          const requestRecord = await createProposalRequestForPlan({
            plan,
            leadId: lead._id.toString(),
            customerId: session.user.id
          });
          const proposal =
            requestRecord?.proposal_id
              ? null
              : await createPlannerProposal({
                  leadId: lead._id.toString(),
                  customerId: session.user.id,
                  plannerPlanId: plan._id.toString(),
                  proposalRequestId: requestRecord?._id.toString(),
                  recommendation: body.recommendation,
                  answers: body.answers as never
                });
          if (requestRecord && proposal) {
            requestRecord.proposal_id = proposal._id.toString();
            await requestRecord.save();
          }
          plan.proposal_id = requestRecord?.proposal_id || proposal?._id.toString();
          await plan.save();
        }

        if (requestedConsultation) {
          await recordTimeline({
            leadId: lead._id.toString(),
            customerId: session.user.id,
            plannerPlanId: plan._id.toString(),
            eventName: "consultation_intent",
            title: "Consultation requested from planner",
            metadata: { source: payload.source }
          });
        }
      }
    }

    await writeAuditLog({
      request,
      session,
      action: "customer_change",
      target_type: "smart_home_plan",
      target_id: plan?._id.toString(),
      metadata: { event: body.status === "completed" ? "planner_completed" : "planner_saved", source: payload.source }
    });

    return apiOk({ plan }, body.id ? 200 : 201);
  } catch (error) {
    return handleApiError(error);
  }
}
