import { Model, Schema, model, models } from "mongoose";

export type ProposalItemDocument = {
  proposal_id: string;
  product_name: string;
  category: string;
  room?: string;
  description?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  type?: "product" | "service" | "package";
};

const proposalItemSchema = new Schema<ProposalItemDocument>(
  {
    proposal_id: { type: String, required: true, index: true },
    product_name: { type: String, required: true },
    category: { type: String, required: true },
    room: { type: String },
    description: { type: String },
    quantity: { type: Number },
    unit_price: { type: Number },
    total_price: { type: Number },
    type: { type: String, enum: ["product", "service", "package"], default: "product" }
  },
  { timestamps: false }
);

export const ProposalItem: Model<ProposalItemDocument> =
  models.ProposalItem || model<ProposalItemDocument>("ProposalItem", proposalItemSchema);

