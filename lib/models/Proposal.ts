import { Model, Schema, model, models } from "mongoose";

export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "rejected";

export type ProposalDocument = {
  lead_id: string;
  customer_id?: string;
  consultation_id?: string;
  site_visit_id?: string;
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
  created_at: Date;
  updated_at: Date;
  sent_at?: Date;
  viewed_at?: Date;
  decided_at?: Date;
};

const proposalSchema = new Schema<ProposalDocument>(
  {
    lead_id: { type: String, required: true, index: true },
    customer_id: { type: String },
    consultation_id: { type: String },
    site_visit_id: { type: String },
    property_type: { type: String, required: true },
    rooms: { type: [String], default: [] },
    automation_categories: { type: [String], default: [] },
    estimated_cost_min: { type: Number },
    estimated_cost_max: { type: Number },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["draft", "sent", "viewed", "accepted", "rejected"],
      default: "draft"
    },
    value_hint: { type: Number },
    proposal_url_slug: { type: String, required: true, unique: true },
    pdf_url: { type: String },
    notes_internal: { type: String },
    sent_at: { type: Date },
    viewed_at: { type: Date },
    decided_at: { type: Date }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Proposal: Model<ProposalDocument> =
  models.Proposal || model<ProposalDocument>("Proposal", proposalSchema);

