import { Model, Schema, model, models } from "mongoose";

export type SalesNotificationDocument = {
  type: "consultation_request" | "quotation_request" | "site_visit_ready" | "hot_lead";
  lead_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: Date;
};

const salesNotificationSchema = new Schema<SalesNotificationDocument>(
  {
    type: {
      type: String,
      enum: ["consultation_request", "quotation_request", "site_visit_ready", "hot_lead"],
      required: true
    },
    lead_id: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const SalesNotification: Model<SalesNotificationDocument> =
  models.SalesNotification ||
  model<SalesNotificationDocument>("SalesNotification", salesNotificationSchema);
