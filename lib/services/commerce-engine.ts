import crypto from "crypto";
import { CommerceSettings, type CommerceSettingsDocument } from "@/lib/models/CommerceSettings";
import { Invoice } from "@/lib/models/Invoice";
import { Lead } from "@/lib/models/Lead";
import { Order, type OrderDocument } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";
import { Proposal } from "@/lib/models/Proposal";
import { ProposalItem } from "@/lib/models/ProposalItem";
import { Receipt } from "@/lib/models/Receipt";
import type { SalesNotificationDocument } from "@/lib/models/SalesNotification";
import { SmartHomePlan } from "@/lib/models/SmartHomePlan";
import { getEnv } from "@/lib/env";
import { createProjectFromPaidOrder } from "@/lib/services/project-service";
import { notifyRevenue, recordTimeline } from "@/lib/services/revenue-engine";

export type CheckoutSummary = {
  orderAmount: number;
  bookingAmount: number;
  remainingAmount: number;
  gstAmount: number;
  discountAmount: number;
  payableAmount: number;
  currency: "INR";
};

export type PaymentProviderOrder = {
  provider: "razorpay";
  providerOrderId: string;
  amount: number;
  currency: "INR";
  keyId?: string;
};

export interface PaymentProvider {
  createOrder(params: { amount: number; currency: "INR"; receipt: string; notes?: Record<string, string> }): Promise<PaymentProviderOrder>;
  verifyPayment(params: { providerOrderId: string; providerPaymentId: string; signature: string }): boolean;
  verifyWebhook(payload: string, signature?: string | null): boolean;
}

function numberFromEnv(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getBookingSettings() {
  const env = getEnv();
  const existing = await CommerceSettings.findOne({ key: "default" });
  if (existing) return existing;
  return CommerceSettings.create({
    key: "default",
    booking_mode: env.ABSECO_DEFAULT_BOOKING_MODE || "fixed",
    booking_value: numberFromEnv(env.ABSECO_DEFAULT_BOOKING_VALUE, 0),
    gst_percentage: numberFromEnv(env.ABSECO_DEFAULT_GST_PERCENTAGE, 0),
    coupons_enabled: false,
    discounts_enabled: false,
    active_provider: "razorpay"
  });
}

export function calculateCheckoutSummary(orderAmount: number, settings: CommerceSettingsDocument): CheckoutSummary {
  const bookingRaw =
    settings.booking_mode === "percentage"
      ? Math.round((orderAmount * settings.booking_value) / 100)
      : settings.booking_value;
  const bookingAmount = Math.max(0, Math.min(orderAmount, Math.round(bookingRaw)));
  const gstAmount = Math.max(0, Math.round((bookingAmount * (settings.gst_percentage || 0)) / 100));
  const discountAmount = 0;
  const payableAmount = Math.max(0, bookingAmount + gstAmount - discountAmount);
  return {
    orderAmount,
    bookingAmount,
    remainingAmount: Math.max(0, orderAmount - bookingAmount),
    gstAmount,
    discountAmount,
    payableAmount,
    currency: "INR"
  };
}

function createNumber(prefix: string) {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${stamp}-${suffix}`;
}

function createCheckoutToken() {
  return crypto.randomBytes(24).toString("hex");
}

function resolveProposalAmount(proposal: { value_hint?: number; estimated_cost_min?: number; estimated_cost_max?: number }) {
  return proposal.value_hint || proposal.estimated_cost_max || proposal.estimated_cost_min || 0;
}

export class RazorpayPaymentProvider implements PaymentProvider {
  private keyId = getEnv().RAZORPAY_KEY_ID || getEnv().NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  private keySecret = getEnv().RAZORPAY_KEY_SECRET || "";
  private webhookSecret = getEnv().RAZORPAY_WEBHOOK_SECRET || "";

  async createOrder(params: { amount: number; currency: "INR"; receipt: string; notes?: Record<string, string> }) {
    if (!this.keyId || !this.keySecret) {
      throw new Error("Razorpay credentials are not configured.");
    }
    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Math.round(params.amount * 100),
        currency: params.currency,
        receipt: params.receipt,
        notes: params.notes || {}
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.id) {
      throw new Error(data.error?.description || "Unable to create Razorpay order.");
    }
    return {
      provider: "razorpay" as const,
      providerOrderId: data.id as string,
      amount: params.amount,
      currency: params.currency,
      keyId: getEnv().NEXT_PUBLIC_RAZORPAY_KEY_ID || this.keyId
    };
  }

  verifyPayment(params: { providerOrderId: string; providerPaymentId: string; signature: string }) {
    if (!this.keySecret) return false;
    const expected = crypto
      .createHmac("sha256", this.keySecret)
      .update(`${params.providerOrderId}|${params.providerPaymentId}`)
      .digest("hex");
    const expectedBuffer = Buffer.from(expected);
    const signatureBuffer = Buffer.from(params.signature);
    return expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  }

  verifyWebhook(payload: string, signature?: string | null) {
    if (!this.webhookSecret || !signature) return false;
    const expected = crypto.createHmac("sha256", this.webhookSecret).update(payload).digest("hex");
    const expectedBuffer = Buffer.from(expected);
    const signatureBuffer = Buffer.from(signature);
    return expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  }
}

export function getPaymentProvider(): PaymentProvider {
  return new RazorpayPaymentProvider();
}

export async function createOrderFromApprovedProposal(proposalId: string) {
  const existing = await Order.findOne({ proposal_id: proposalId });
  if (existing) return existing;

  const proposal = await Proposal.findById(proposalId);
  if (!proposal) throw new Error("Proposal not found.");
  const lead = await Lead.findById(proposal.lead_id);
  const planner = proposal.planner_plan_id
    ? await SmartHomePlan.findById(proposal.planner_plan_id)
    : await SmartHomePlan.findOne({ proposal_id: proposal._id.toString() });
  const proposalItems = await ProposalItem.find({ proposal_id: proposal._id.toString() });
  const amount = resolveProposalAmount(proposal);
  const settings = await getBookingSettings();
  const summary = calculateCheckoutSummary(amount, settings);
  const recommendation = planner?.recommendation as { packageName?: string } | undefined;
  const order = await Order.create({
    order_number: createNumber("ABO"),
    customer_id: proposal.customer_id,
    lead_id: proposal.lead_id,
    proposal_id: proposal._id.toString(),
    planner_plan_id: proposal.planner_plan_id || planner?._id.toString(),
    sales_executive: proposal.assigned_sales_rep || lead?.assigned_sales_rep,
    checkout_token: createCheckoutToken(),
    status: "booking_pending",
    items: proposalItems.map((item) => ({
      name: item.product_name,
      category: item.category,
      room: item.room,
      quantity: item.quantity || 1,
      amount: item.total_price || item.unit_price,
      description: item.description
    })),
    package_name: recommendation?.packageName,
    amount,
    booking_amount: summary.bookingAmount,
    remaining_amount: summary.remainingAmount,
    payment_status: "pending",
    invoice_status: "not_generated",
    priority: lead?.priority === "High" ? "High" : "Medium",
    notes: "Created from approved proposal."
  });

  await recordTimeline({
    leadId: order.lead_id,
    customerId: order.customer_id,
    plannerPlanId: order.planner_plan_id,
    proposalId: order.proposal_id,
    eventName: "order_created",
    title: "Order created",
    metadata: { order_id: order._id.toString(), order_number: order.order_number }
  });
  await sendCommerceNotification("order_created", order, "New order created", `Order ${order.order_number} is ready for booking payment.`);
  return order;
}

export async function createCheckoutPayment(orderId: string, termsAccepted: boolean) {
  if (!termsAccepted) throw new Error("Terms must be accepted before checkout.");
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found.");
  if (order.payment_status === "paid") throw new Error("Booking amount is already paid.");
  const settings = await getBookingSettings();
  const summary = calculateCheckoutSummary(order.amount, settings);
  order.booking_amount = summary.bookingAmount;
  order.remaining_amount = summary.remainingAmount;
  await order.save();

  const provider = getPaymentProvider();
  const hadFailedPayment = await Payment.exists({ order_id: order._id.toString(), status: "failed" });
  const providerOrder = await provider.createOrder({
    amount: summary.payableAmount,
    currency: "INR",
    receipt: order.order_number,
    notes: { order_id: order._id.toString(), order_number: order.order_number }
  });
  const payment = await Payment.findOneAndUpdate(
    { order_id: order._id.toString(), provider_order_id: providerOrder.providerOrderId },
    {
      $setOnInsert: {
        order_id: order._id.toString(),
        order_number: order.order_number,
        lead_id: order.lead_id,
        customer_id: order.customer_id,
        provider: providerOrder.provider,
        provider_order_id: providerOrder.providerOrderId,
        amount: summary.payableAmount,
        currency: providerOrder.currency,
        status: "pending"
      }
    },
    { upsert: true, new: true }
  );
  if (hadFailedPayment) {
    await recordTimeline({
      leadId: order.lead_id,
      customerId: order.customer_id,
      proposalId: order.proposal_id,
      eventName: "payment_retried",
      title: "Payment retried",
      metadata: { order_id: order._id.toString(), provider_order_id: providerOrder.providerOrderId }
    });
  }
  return { order, payment, providerOrder, summary };
}

export async function markPaymentFailed(orderId: string, reason: string, rawResponse?: Record<string, unknown>) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found.");
  await Payment.create({
    order_id: order._id.toString(),
    order_number: order.order_number,
    lead_id: order.lead_id,
    customer_id: order.customer_id,
    provider: "razorpay",
    amount: order.booking_amount,
    currency: "INR",
    status: "failed",
    failure_reason: reason,
    raw_response: rawResponse
  });
  order.status = "payment_failed";
  order.payment_status = "failed";
  await order.save();
  await recordTimeline({
    leadId: order.lead_id,
    customerId: order.customer_id,
    proposalId: order.proposal_id,
    eventName: "payment_failed",
    title: "Payment failed",
    metadata: { order_id: order._id.toString(), reason }
  });
  await sendCommerceNotification("payment_failure", order, "Payment failed", `Booking payment failed for ${order.order_number}.`);
}

export async function verifyCheckoutPayment(params: {
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}) {
  const provider = getPaymentProvider();
  if (!provider.verifyPayment(params)) throw new Error("Payment signature verification failed.");
  const payment = await Payment.findOne({ provider_order_id: params.providerOrderId });
  if (!payment) throw new Error("Payment record not found.");
  if (payment.status === "success") return finalizePaidOrder(payment.order_id, payment._id.toString());

  payment.provider_payment_id = params.providerPaymentId;
  payment.provider_signature = params.signature;
  payment.reference = params.providerPaymentId;
  payment.status = "success";
  payment.paid_at = new Date();
  await payment.save();
  return finalizePaidOrder(payment.order_id, payment._id.toString());
}

export async function finalizePaidOrder(orderId: string, paymentId: string) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found.");
  order.status = "booking_paid";
  order.payment_status = "paid";
  await order.save();
  await Promise.all([
    Proposal.updateOne({ _id: order.proposal_id }, { status: "converted", converted_at: new Date() }),
    Lead.updateOne({ _id: order.lead_id }, { status: "customer", last_activity: new Date() })
  ]);
  const invoice = await generateInvoice(order);
  const receipt = await generateReceipt(order, paymentId);
  const project = await createProjectFromPaidOrder(order._id.toString());
  await recordTimeline({
    leadId: order.lead_id,
    customerId: order.customer_id,
    proposalId: order.proposal_id,
    orderId: order._id.toString(),
    projectId: project._id.toString(),
    eventName: "booking_paid",
    title: "Booking amount paid",
    metadata: { order_id: order._id.toString(), payment_id: paymentId }
  });
  await sendCommerceNotification("payment_success", order, "Payment received", `Booking payment received for ${order.order_number}.`);
  return { order, invoice, receipt };
}

export async function generateInvoice(order: OrderDocument & { _id?: { toString(): string } }) {
  const existing = await Invoice.findOne({ order_id: order._id?.toString() });
  if (existing) return existing;
  const settings = await getBookingSettings();
  const summary = calculateCheckoutSummary(order.amount, settings);
  const invoice = await Invoice.create({
    invoice_number: createNumber("ABI"),
    order_id: order._id?.toString(),
    customer_id: order.customer_id,
    gst_amount: summary.gstAmount,
    amount: order.amount,
    booking_amount: order.booking_amount,
    remaining_amount: order.remaining_amount,
    status: "generated",
    download_url: `/api/commerce/invoices/${order._id?.toString()}/download`
  });
  order.invoice_status = "generated";
  order.status = "invoice_generated";
  await (order as unknown as { save(): Promise<unknown> }).save();
  await recordTimeline({
    leadId: order.lead_id,
    customerId: order.customer_id,
    proposalId: order.proposal_id,
    eventName: "invoice_generated",
    title: "Invoice generated",
    metadata: { invoice_number: invoice.invoice_number }
  });
  await sendCommerceNotification("invoice_generated", order, "Invoice generated", `Invoice ${invoice.invoice_number} generated.`);
  return invoice;
}

export async function generateReceipt(order: OrderDocument & { _id?: { toString(): string } }, paymentId: string) {
  const existing = await Receipt.findOne({ payment_id: paymentId });
  if (existing) return existing;
  const payment = await Payment.findById(paymentId);
  const receipt = await Receipt.create({
    receipt_number: createNumber("ABR"),
    order_id: order._id?.toString(),
    payment_id: paymentId,
    gateway: "razorpay",
    reference: payment?.reference || payment?.provider_payment_id,
    amount: payment?.amount || order.booking_amount,
    status: "generated"
  });
  await recordTimeline({
    leadId: order.lead_id,
    customerId: order.customer_id,
    proposalId: order.proposal_id,
    eventName: "receipt_generated",
    title: "Receipt generated",
    metadata: { receipt_number: receipt.receipt_number }
  });
  await sendCommerceNotification("receipt_generated", order, "Receipt generated", `Receipt ${receipt.receipt_number} generated.`);
  return receipt;
}

async function sendCommerceNotification(
  type: SalesNotificationDocument["type"],
  order: OrderDocument & { _id?: { toString(): string } },
  title: string,
  body: string
) {
  if (order.customer_id) {
    await notifyRevenue({
      type,
      leadId: order.lead_id,
      title,
      body,
      recipientRole: "customer",
      recipientId: order.customer_id
    });
  }
  await notifyRevenue({
    type,
    leadId: order.lead_id,
    title,
    body,
    recipientRole: "sales",
    recipientId: order.sales_executive
  });
  await notifyRevenue({
    type,
    leadId: order.lead_id,
    title,
    body,
    recipientRole: "admin"
  });
}
