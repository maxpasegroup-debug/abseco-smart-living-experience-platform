import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { Lead } from "@/lib/models/Lead";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!hasAnyRole(session?.user.role, CONTROL_ROLES)) {
      return apiError(session ? "FORBIDDEN" : "UNAUTHENTICATED", session ? "Forbidden." : "Authentication required.", session ? 403 : 401);
    }
    await connectDb();
    const [
      orders,
      paidOrders,
      failedPayments,
      pendingPayments,
      bookingAgg,
      revenueBySalesExecutive,
      payments
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ payment_status: "paid" }),
      Payment.countDocuments({ status: "failed" }),
      Order.countDocuments({ payment_status: "pending" }),
      Order.aggregate([
        {
          $group: {
            _id: null,
            booking_collected: { $sum: { $cond: [{ $eq: ["$payment_status", "paid"] }, "$booking_amount", 0] } },
            revenue: { $sum: { $cond: [{ $eq: ["$payment_status", "paid"] }, "$amount", 0] } },
            average_booking: { $avg: "$booking_amount" }
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: "$sales_executive",
            orders: { $sum: 1 },
            booking_collected: { $sum: { $cond: [{ $eq: ["$payment_status", "paid"] }, "$booking_amount", 0] } }
          }
        }
      ]),
      Payment.countDocuments({})
    ]);

    const revenueBySource = await Order.aggregate([
      {
        $lookup: {
          from: Lead.collection.name,
          let: { leadId: "$lead_id" },
          pipeline: [{ $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$leadId"] } } }],
          as: "lead"
        }
      },
      { $unwind: { path: "$lead", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$lead.lead_source",
          orders: { $sum: 1 },
          booking_collected: { $sum: { $cond: [{ $eq: ["$payment_status", "paid"] }, "$booking_amount", 0] } }
        }
      }
    ]);

    const totals = bookingAgg[0] || { booking_collected: 0, revenue: 0, average_booking: 0 };
    return apiOk({
      metrics: {
        orders,
        booking_amount_collected: totals.booking_collected || 0,
        revenue: totals.revenue || 0,
        payment_success_pct: pct(paidOrders, payments),
        payment_failure_pct: pct(failedPayments, payments),
        pending_payments: pendingPayments,
        average_booking: Math.round(totals.average_booking || 0)
      },
      revenueBySource,
      revenueBySalesExecutive
    });
  } catch (error) {
    return handleApiError(error);
  }
}
