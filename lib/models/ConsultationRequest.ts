import { Model, Schema, model, models } from "mongoose";

export type ConsultationRequestDocument = {
  lead_id: string;
  phone: string;
  name?: string;
  city: string;
  property_type: string;
  construction_stage: string;
  status: "pending" | "scheduled" | "completed";
  assigned_to?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
};

const consultationRequestSchema = new Schema<ConsultationRequestDocument>(
  {
    lead_id: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    name: { type: String },
    city: { type: String, required: true },
    property_type: { type: String, required: true },
    construction_stage: { type: String, required: true },
    status: { type: String, enum: ["pending", "scheduled", "completed"], default: "pending" },
    assigned_to: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

export const ConsultationRequest: Model<ConsultationRequestDocument> =
  models.ConsultationRequest ||
  model<ConsultationRequestDocument>("ConsultationRequest", consultationRequestSchema);
