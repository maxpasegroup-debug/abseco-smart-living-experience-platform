import { Model, Schema, model, models } from "mongoose";

export type ReceiptDocument = {
  receipt_number: string;
  order_id: string;
  payment_id: string;
  gateway: "razorpay";
  reference?: string;
  amount: number;
  status: "generated" | "sent";
  created_at: Date;
  updated_at: Date;
};

const receiptSchema = new Schema<ReceiptDocument>(
  {
    receipt_number: { type: String, required: true, unique: true, index: true },
    order_id: { type: String, required: true, index: true },
    payment_id: { type: String, required: true, unique: true, index: true },
    gateway: { type: String, enum: ["razorpay"], default: "razorpay" },
    reference: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["generated", "sent"], default: "generated" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Receipt: Model<ReceiptDocument> =
  models.Receipt || model<ReceiptDocument>("Receipt", receiptSchema);
