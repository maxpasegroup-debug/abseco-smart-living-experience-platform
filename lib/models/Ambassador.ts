import { Model, Schema, model, models } from "mongoose";

export type AmbassadorDocument = {
  lead_id: string;
  code: string;
  showcase_slug: string;
  city?: string;
  total_visits: number;
  total_leads: number;
  total_consultations: number;
  total_installations: number;
  reward_balance: number;
  created_at: Date;
  updated_at: Date;
};

const ambassadorSchema = new Schema<AmbassadorDocument>(
  {
    lead_id: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true },
    showcase_slug: { type: String, required: true, unique: true },
    city: { type: String },
    total_visits: { type: Number, default: 0 },
    total_leads: { type: Number, default: 0 },
    total_consultations: { type: Number, default: 0 },
    total_installations: { type: Number, default: 0 },
    reward_balance: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Ambassador: Model<AmbassadorDocument> =
  models.Ambassador || model<AmbassadorDocument>("Ambassador", ambassadorSchema);

