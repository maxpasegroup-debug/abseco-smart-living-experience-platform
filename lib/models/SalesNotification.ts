import { Model, Schema, model, models } from "mongoose";

export type SalesNotificationDocument = {
  type:
    | "consultation_request"
    | "quotation_request"
    | "site_visit_ready"
    | "hot_lead"
    | "proposal_request"
    | "assignment"
    | "site_visit_scheduled"
    | "proposal_sent"
    | "status_change"
    | "order_created"
    | "payment_success"
    | "payment_failure"
    | "invoice_generated"
    | "receipt_generated"
    | "project_created"
    | "engineer_assigned"
    | "visit_scheduled"
    | "installation_started"
    | "testing_completed"
    | "ready_for_review"
    | "project_completed"
    | "engineer_delay"
    | "project_delay"
    | "pending_qa"
    | "pending_approval";
  lead_id: string;
  recipient_role?: "customer" | "sales" | "admin";
  recipient_id?: string;
  title: string;
  body: string;
  read: boolean;
  archived?: boolean;
  created_at: Date;
};

const salesNotificationSchema = new Schema<SalesNotificationDocument>(
  {
    type: {
      type: String,
      enum: [
        "consultation_request",
        "quotation_request",
        "site_visit_ready",
        "hot_lead",
        "proposal_request",
        "assignment",
        "site_visit_scheduled",
        "proposal_sent",
        "status_change",
        "order_created",
        "payment_success",
        "payment_failure",
        "invoice_generated",
        "receipt_generated",
        "project_created",
        "engineer_assigned",
        "visit_scheduled",
        "installation_started",
        "testing_completed",
        "ready_for_review",
        "project_completed",
        "engineer_delay",
        "project_delay",
        "pending_qa",
        "pending_approval"
      ],
      required: true
    },
    lead_id: { type: String, required: true, index: true },
    recipient_role: { type: String, enum: ["customer", "sales", "admin"] },
    recipient_id: { type: String },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false, index: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const SalesNotification: Model<SalesNotificationDocument> =
  models.SalesNotification ||
  model<SalesNotificationDocument>("SalesNotification", salesNotificationSchema);
