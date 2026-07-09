import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { connectDb } from "@/lib/db/connect";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { getCustomerLeadIds } from "@/lib/services/customer-dashboard";
import { getCustomerProjects, submitCustomerApproval } from "@/lib/services/project-service";

const customerApprovalSchema = z.object({
  project_id: z.string().min(1),
  status: z.enum(["approved", "corrections_requested"]),
  comments: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  digital_acceptance: z.boolean().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    await connectDb();
    const leadIds = await getCustomerLeadIds(session);
    const projects = await getCustomerProjects(session.user.id, leadIds);
    return apiOk({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    const input = await parseJson(request, customerApprovalSchema);
    await connectDb();
    const project = await submitCustomerApproval({
      projectId: input.project_id,
      customerId: session.user.id,
      status: input.status,
      comments: input.comments,
      rating: input.rating,
      digitalAcceptance: input.digital_acceptance
    });
    return apiOk({ project });
  } catch (error) {
    return handleApiError(error);
  }
}
