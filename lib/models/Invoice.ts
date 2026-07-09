import { Model, Schema, model, models } from "mongoose";

export type InvoiceDocument = {
  invoice_number: string;
  order_id: string;
  customer_id?: string;
  gst_amount: number;
  amount: number;
  booking_amount: number;
  remaining_amount: number;
  status: "generated" | "sent" | "paid" | "cancelled";
  download_url?: string;
  created_at: Date;
  updated_at: Date;
};

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    invoice_number: { type: String, required: true, unique: true, index: true },
    order_id: { type: String, required: true, unique: true, index: true },
    customer_id: { type: String, index: true },
    gst_amount: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    booking_amount: { type: Number, required: true },
    remaining_amount: { type: Number, required: true },
    status: { type: String, enum: ["generated", "sent", "paid", "cancelled"], default: "generated", index: true },
    download_url: { type: String }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Invoice: Model<InvoiceDocument> =
  models.Invoice || model<InvoiceDocument>("Invoice", invoiceSchema);
