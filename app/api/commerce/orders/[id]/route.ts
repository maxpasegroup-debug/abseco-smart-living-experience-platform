import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";
import { Invoice } from "@/lib/models/Invoice";
import { Receipt } from "@/lib/models/Receipt";
import { ActivityTimeline } from "@/lib/models/ActivityTimeline";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    await connectDb();
    const order = await Order.findById(params.id);
    if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
    if (!hasAnyRole(session.user.role, CONTROL_ROLES) && order.customer_id !== session.user.id) {
      return apiError("FORBIDDEN", "You cannot view this order.", 403);
    }
    const [payments, invoice, receipts, timeline] = await Promise.all([
      Payment.find({ order_id: order._id.toString() }).sort({ created_at: -1 }).limit(20),
      Invoice.findOne({ order_id: order._id.toString() }),
      Receipt.find({ order_id: order._id.toString() }).sort({ created_at: -1 }).limit(20),
      ActivityTimeline.find({ lead_id: order.lead_id }).sort({ created_at: -1 }).limit(100)
    ]);
    return apiOk({ order, payments, invoice, receipts, timeline });
  } catch (error) {
    return handleApiError(error);
  }
}
