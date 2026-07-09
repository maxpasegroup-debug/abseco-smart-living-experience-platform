import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { ActivityTimeline } from "@/lib/models/ActivityTimeline";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseQuery, z } from "@/lib/validation";

const timelineQuerySchema = z.object({
  lead_id: z.string().optional(),
  customer_id: z.string().optional(),
  planner_plan_id: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    const query = parseQuery(request, timelineQuerySchema);
    if (!query.lead_id && !query.customer_id && !query.planner_plan_id) {
      return apiError("BAD_REQUEST", "lead_id, customer_id, or planner_plan_id is required.", 400);
    }
    await connectDb();
    if (!hasAnyRole(session.user.role, CONTROL_ROLES) && query.customer_id !== session.user.id) {
      return apiError("FORBIDDEN", "You cannot view this timeline.", 403);
    }
    const timeline = await ActivityTimeline.find({
      ...(query.lead_id ? { lead_id: query.lead_id } : {}),
      ...(query.customer_id ? { customer_id: query.customer_id } : {}),
      ...(query.planner_plan_id ? { planner_plan_id: query.planner_plan_id } : {})
    })
      .sort({ created_at: -1 })
      .limit(200);
    return apiOk({ timeline });
  } catch (error) {
    return handleApiError(error);
  }
}
