import { Model, Schema, model, models } from "mongoose";

export type OrderStatus =
  | "created"
  | "booking_pending"
  | "booking_paid"
  | "payment_failed"
  | "invoice_generated"
  | "installation_pending"
  | "cancelled";

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderInvoiceStatus = "not_generated" | "generated" | "sent" | "paid";

export type OrderItem = {
  name: string;
  category?: string;
  room?: string;
  quantity: number;
  amount?: number;
  description?: string;
};

export type OrderDocument = {
  order_number: string;
  customer_id?: string;
  lead_id: string;
  proposal_id: string;
  planner_plan_id?: string;
  sales_executive?: string;
  checkout_token?: string;
  status: OrderStatus;
  items: OrderItem[];
  package_name?: string;
  amount: number;
  booking_amount: number;
  remaining_amount: number;
  payment_status: OrderPaymentStatus;
  invoice_status: OrderInvoiceStatus;
  expected_installation_date?: Date;
  priority?: "Low" | "Medium" | "High";
  notes?: string;
  created_at: Date;
  updated_at: Date;
};

const orderItemSchema = new Schema<OrderItem>(
  {
    name: { type: String, required: true },
    category: { type: String },
    room: { type: String },
    quantity: { type: Number, default: 1 },
    amount: { type: Number },
    description: { type: String }
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    order_number: { type: String, required: true, unique: true, index: true },
    customer_id: { type: String, index: true },
    lead_id: { type: String, required: true, index: true },
    proposal_id: { type: String, required: true, unique: true, index: true },
    planner_plan_id: { type: String, index: true },
    sales_executive: { type: String, index: true },
    checkout_token: { type: String, index: true },
    status: {
      type: String,
      enum: [
        "created",
        "booking_pending",
        "booking_paid",
        "payment_failed",
        "invoice_generated",
        "installation_pending",
        "cancelled"
      ],
      default: "created",
      index: true
    },
    items: { type: [orderItemSchema], default: [] },
    package_name: { type: String },
    amount: { type: Number, required: true, default: 0 },
    booking_amount: { type: Number, required: true, default: 0 },
    remaining_amount: { type: Number, required: true, default: 0 },
    payment_status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending", index: true },
    invoice_status: {
      type: String,
      enum: ["not_generated", "generated", "sent", "paid"],
      default: "not_generated",
      index: true
    },
    expected_installation_date: { type: Date },
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    notes: { type: String }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Order: Model<OrderDocument> = models.Order || model<OrderDocument>("Order", orderSchema);
