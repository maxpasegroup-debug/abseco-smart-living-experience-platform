import { Model, Schema, model, models } from "mongoose";

export type PaymentStatus = "created" | "pending" | "success" | "failed";

export type PaymentDocument = {
  order_id: string;
  order_number: string;
  lead_id?: string;
  customer_id?: string;
  provider: "razorpay";
  provider_order_id?: string;
  provider_payment_id?: string;
  provider_signature?: string;
  reference?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  failure_reason?: string;
  raw_response?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
  paid_at?: Date;
};

const paymentSchema = new Schema<PaymentDocument>(
  {
    order_id: { type: String, required: true, index: true },
    order_number: { type: String, required: true, index: true },
    lead_id: { type: String, index: true },
    customer_id: { type: String, index: true },
    provider: { type: String, enum: ["razorpay"], default: "razorpay" },
    provider_order_id: { type: String, index: true },
    provider_payment_id: { type: String, index: true },
    provider_signature: { type: String },
    reference: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "pending", "success", "failed"], default: "created", index: true },
    failure_reason: { type: String },
    raw_response: { type: Schema.Types.Mixed },
    paid_at: { type: Date }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Payment: Model<PaymentDocument> =
  models.Payment || model<PaymentDocument>("Payment", paymentSchema);
