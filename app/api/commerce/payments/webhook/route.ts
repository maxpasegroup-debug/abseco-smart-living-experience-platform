import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { Payment } from "@/lib/models/Payment";
import { finalizePaidOrder, getPaymentProvider, markPaymentFailed } from "@/lib/services/commerce-engine";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const provider = getPaymentProvider();
    if (!provider.verifyWebhook(payload, signature)) {
      return apiError("FORBIDDEN", "Invalid webhook signature.", 403);
    }
    const event = JSON.parse(payload);
    await connectDb();

    const paymentEntity = event.payload?.payment?.entity;
    const providerOrderId = paymentEntity?.order_id;
    const providerPaymentId = paymentEntity?.id;
    const payment = providerOrderId ? await Payment.findOne({ provider_order_id: providerOrderId }) : null;

    if (event.event === "payment.captured" && payment) {
      payment.provider_payment_id = providerPaymentId;
      payment.reference = providerPaymentId;
      payment.status = "success";
      payment.raw_response = event;
      payment.paid_at = new Date();
      await payment.save();
      await finalizePaidOrder(payment.order_id, payment._id.toString());
    }

    if (event.event === "payment.failed" && payment) {
      await markPaymentFailed(payment.order_id, paymentEntity?.error_description || "Gateway reported payment failure.", event);
    }

    return apiOk({});
  } catch (error) {
    return handleApiError(error);
  }
}
