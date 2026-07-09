import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Proposal } from "@/lib/models/Proposal";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth/session";

const proposalCreateSchema = z.object({
  lead_id: z.string().min(1),
  property_type: z.string().trim().min(1),
  rooms: z.array(z.string()).default([]),
  automation_categories: z.array(z.string()).default([]),
  estimated_cost_min: z.number().optional(),
  estimated_cost_max: z.number().optional(),
  currency: z.string().default("INR"),
  planner_plan_id: z.string().optional(),
  proposal_request_id: z.string().optional(),
  consultation_id: z.string().optional(),
  site_visit_id: z.string().optional()
});

export async function GET() {
  try {
    await connectDb();
    const proposals = await Proposal.find().sort({ created_at: -1 }).limit(100);
    return apiOk({ proposals });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, proposalCreateSchema);
    const {
      lead_id,
      property_type,
      rooms = [],
      automation_categories = [],
      estimated_cost_min,
      estimated_cost_max,
      currency,
      planner_plan_id,
      proposal_request_id,
      consultation_id,
      site_visit_id
    } = body;
    if (!lead_id || !property_type) return apiError("BAD_REQUEST", "lead_id and property_type are required.", 400);
    await connectDb();
    const slug = `${lead_id.slice(-6)}-${Date.now().toString(36)}`;
    const proposal = await Proposal.create({
      lead_id,
      property_type,
      rooms,
      automation_categories,
      estimated_cost_min,
      estimated_cost_max,
      currency: currency || "INR",
      planner_plan_id,
      proposal_request_id,
      consultation_id,
      site_visit_id,
      proposal_url_slug: slug
    });
    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "proposal_change",
      target_type: "proposal",
      target_id: proposal._id.toString(),
      metadata: { event: "created", lead_id }
    });
    return apiOk({ proposal }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

