import { Model, Schema, model, models } from "mongoose";

export type SmartHomePlanDocument = {
  customer_id?: string;
  guest_id?: string;
  lead_id?: string;
  proposal_id?: string;
  status: "draft" | "completed";
  current_step: number;
  answers: Record<string, unknown>;
  recommendation?: Record<string, unknown>;
  structured_plan?: Record<string, unknown>;
  planner_score?: number;
  lead_temperature?: "cold" | "warm" | "hot";
  conversion_status: "saved" | "proposal_requested" | "consultation_booked";
  source?: string;
  created_at: Date;
  updated_at: Date;
};

const smartHomePlanSchema = new Schema<SmartHomePlanDocument>(
  {
    customer_id: { type: String, index: true },
    guest_id: { type: String, index: true },
    lead_id: { type: String, index: true },
    proposal_id: { type: String, index: true },
    status: { type: String, enum: ["draft", "completed"], default: "draft", index: true },
    current_step: { type: Number, default: 1 },
    answers: { type: Schema.Types.Mixed, required: true },
    recommendation: { type: Schema.Types.Mixed },
    structured_plan: { type: Schema.Types.Mixed },
    planner_score: { type: Number, default: 0 },
    lead_temperature: { type: String, enum: ["cold", "warm", "hot"] },
    conversion_status: {
      type: String,
      enum: ["saved", "proposal_requested", "consultation_booked"],
      default: "saved",
      index: true
    },
    source: { type: String }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const SmartHomePlan: Model<SmartHomePlanDocument> =
  models.SmartHomePlan || model<SmartHomePlanDocument>("SmartHomePlan", smartHomePlanSchema);
