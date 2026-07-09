import { Model, Schema, model, models } from "mongoose";

export type ProposalStatus =
  | "draft"
  | "requested"
  | "preparing"
  | "internal_review"
  | "sent"
  | "viewed"
  | "customer_review"
  | "revision_requested"
  | "approved"
  | "accepted"
  | "rejected"
  | "expired"
  | "converted";

export type ProposalStatusHistory = {
  status: ProposalStatus;
  changed_by?: string;
  changed_at: Date;
  notes?: string;
};

export type ProposalDocument = {
  lead_id: string;
  customer_id?: string;
  planner_plan_id?: string;
  proposal_request_id?: string;
  consultation_id?: string;
  site_visit_id?: string;
  assigned_sales_rep?: string;
  property_type: string;
  rooms: string[];
  automation_categories: string[];
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  currency: string;
  status: ProposalStatus;
  value_hint?: number;
  proposal_url_slug: string;
  pdf_url?: string;
  notes_internal?: string;
  status_history?: ProposalStatusHistory[];
  created_at: Date;
  updated_at: Date;
  requested_at?: Date;
  preparing_at?: Date;
  internal_review_at?: Date;
  sent_at?: Date;
  viewed_at?: Date;
  customer_review_at?: Date;
  revision_requested_at?: Date;
  approved_at?: Date;
  rejected_at?: Date;
  expired_at?: Date;
  converted_at?: Date;
  decided_at?: Date;
};

const proposalStatuses: ProposalStatus[] = [
  "draft",
  "requested",
  "preparing",
  "internal_review",
  "sent",
  "viewed",
  "customer_review",
  "revision_requested",
  "approved",
  "accepted",
  "rejected",
  "expired",
  "converted"
];

const statusHistorySchema = new Schema<ProposalStatusHistory>(
  {
    status: { type: String, enum: proposalStatuses, required: true },
    changed_by: { type: String },
    changed_at: { type: Date, default: Date.now },
    notes: { type: String }
  },
  { _id: false }
);

const proposalSchema = new Schema<ProposalDocument>(
  {
    lead_id: { type: String, required: true, index: true },
    customer_id: { type: String },
    planner_plan_id: { type: String, index: true },
    proposal_request_id: { type: String, index: true },
    consultation_id: { type: String },
    site_visit_id: { type: String },
    assigned_sales_rep: { type: String },
    property_type: { type: String, required: true },
    rooms: { type: [String], default: [] },
    automation_categories: { type: [String], default: [] },
    estimated_cost_min: { type: Number },
    estimated_cost_max: { type: Number },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: proposalStatuses,
      default: "draft"
    },
    value_hint: { type: Number },
    proposal_url_slug: { type: String, required: true, unique: true },
    pdf_url: { type: String },
    notes_internal: { type: String },
    status_history: { type: [statusHistorySchema], default: [] },
    requested_at: { type: Date },
    preparing_at: { type: Date },
    internal_review_at: { type: Date },
    sent_at: { type: Date },
    viewed_at: { type: Date },
    customer_review_at: { type: Date },
    revision_requested_at: { type: Date },
    approved_at: { type: Date },
    rejected_at: { type: Date },
    expired_at: { type: Date },
    converted_at: { type: Date },
    decided_at: { type: Date }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Proposal: Model<ProposalDocument> =
  models.Proposal || model<ProposalDocument>("Proposal", proposalSchema);

