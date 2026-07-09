import { Model, Schema, model, models } from "mongoose";

export type ProposalRequestStatus = "requested" | "preparing" | "converted" | "cancelled";

export type ProposalRequestDocument = {
  planner_plan_id: string;
  lead_id: string;
  customer_id?: string;
  proposal_id?: string;
  assigned_sales_rep?: string;
  status: ProposalRequestStatus;
  requested_at: Date;
  created_at: Date;
  updated_at: Date;
};

const proposalRequestSchema = new Schema<ProposalRequestDocument>(
  {
    planner_plan_id: { type: String, required: true, index: true },
    lead_id: { type: String, required: true, index: true },
    customer_id: { type: String, index: true },
    proposal_id: { type: String, index: true },
    assigned_sales_rep: { type: String },
    status: {
      type: String,
      enum: ["requested", "preparing", "converted", "cancelled"],
      default: "requested",
      index: true
    },
    requested_at: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const ProposalRequest: Model<ProposalRequestDocument> =
  models.ProposalRequest ||
  model<ProposalRequestDocument>("ProposalRequest", proposalRequestSchema);
