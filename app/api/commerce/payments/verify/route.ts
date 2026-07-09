import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { verifyCheckoutPayment } from "@/lib/services/commerce-engine";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  checkout_token: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, verifySchema);
    await connectDb();
    const session = await getSessionFromRequest(request);
    const payment = await Payment.findOne({ provider_order_id: body.razorpay_order_id });
    if (!payment) return apiError("NOT_FOUND", "Payment record not found.", 404);
    const order = await Order.findById(payment.order_id);
    if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
    const tokenAllowed = body.checkout_token && order.checkout_token && body.checkout_token === order.checkout_token;
    const sessionAllowed =
      session && (hasAnyRole(session.user.role, CONTROL_ROLES) || order.customer_id === session.user.id);
    if (!tokenAllowed && !sessionAllowed) {
      return apiError("FORBIDDEN", "You cannot verify this payment.", 403);
    }
    const result = await verifyCheckoutPayment({
      providerOrderId: body.razorpay_order_id,
      providerPaymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature
    });
    return apiOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
