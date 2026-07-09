import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { Order } from "@/lib/models/Order";
import { createOrderFromApprovedProposal } from "@/lib/services/commerce-engine";

const orderCreateSchema = z.object({
  proposal_id: z.string().min(1)
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    await connectDb();
    const query = hasAnyRole(session.user.role, CONTROL_ROLES) ? {} : { customer_id: session.user.id };
    const orders = await Order.find(query).sort({ created_at: -1 }).limit(100);
    return apiOk({ orders });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!hasAnyRole(session?.user.role, CONTROL_ROLES)) {
      return apiError(session ? "FORBIDDEN" : "UNAUTHENTICATED", session ? "Forbidden." : "Authentication required.", session ? 403 : 401);
    }
    const body = await parseJson(request, orderCreateSchema);
    await connectDb();
    const order = await createOrderFromApprovedProposal(body.proposal_id);
    return apiOk({ order }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
