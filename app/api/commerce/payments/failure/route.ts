import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { markPaymentFailed } from "@/lib/services/commerce-engine";
import { Order } from "@/lib/models/Order";

const failureSchema = z.object({
  order_id: z.string().min(1),
  reason: z.string().optional(),
  raw_response: z.record(z.unknown()).optional(),
  checkout_token: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, failureSchema);
    await connectDb();
    const session = await getSessionFromRequest(request);
    const order = await Order.findById(body.order_id);
    if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
    const tokenAllowed = body.checkout_token && order.checkout_token && body.checkout_token === order.checkout_token;
    const sessionAllowed =
      session && (hasAnyRole(session.user.role, CONTROL_ROLES) || order.customer_id === session.user.id);
    if (!tokenAllowed && !sessionAllowed) {
      return apiError("FORBIDDEN", "You cannot update this order.", 403);
    }
    await markPaymentFailed(body.order_id, body.reason || "Payment failed.", body.raw_response);
    return apiOk({});
  } catch (error) {
    return handleApiError(error);
  }
}
