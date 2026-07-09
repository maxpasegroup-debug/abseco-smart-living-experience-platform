import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { calculateCheckoutSummary, createCheckoutPayment, getBookingSettings } from "@/lib/services/commerce-engine";
import { Order } from "@/lib/models/Order";

const checkoutSchema = z.object({
  order_id: z.string().min(1),
  terms_accepted: z.boolean(),
  coupon_code: z.string().optional(),
  checkout_token: z.string().optional()
});

function canAccessOrder(params: {
  session: Awaited<ReturnType<typeof getSessionFromRequest>>;
  order: { customer_id?: string; checkout_token?: string };
  token?: string | null;
}) {
  if (params.token && params.order.checkout_token && params.token === params.order.checkout_token) return true;
  return Boolean(params.session && (hasAnyRole(params.session.user.role, CONTROL_ROLES) || params.order.customer_id === params.session.user.id));
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, checkoutSchema);
    await connectDb();
    if (!body.terms_accepted) return apiError("BAD_REQUEST", "Terms acceptance is required.", 400);
    const session = await getSessionFromRequest(request);
    const order = await Order.findById(body.order_id);
    if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
    if (!canAccessOrder({ session, order, token: body.checkout_token })) {
      return apiError("FORBIDDEN", "You cannot checkout this order.", 403);
    }
    const result = await createCheckoutPayment(body.order_id, body.terms_accepted);
    return apiOk(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get("order_id");
    const checkoutToken = request.nextUrl.searchParams.get("checkout_token");
    if (!orderId) return apiError("BAD_REQUEST", "order_id is required.", 400);
    const session = await getSessionFromRequest(request);
    await connectDb();
    const order = await Order.findById(orderId);
    if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
    if (!canAccessOrder({ session, order, token: checkoutToken })) {
      return apiError("FORBIDDEN", "You cannot view this checkout.", 403);
    }
    const settings = await getBookingSettings();
    const summary = calculateCheckoutSummary(order.amount, settings);
    return apiOk({ order, settings, summary });
  } catch (error) {
    return handleApiError(error);
  }
}
