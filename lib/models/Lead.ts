import { Model, Schema, model, models } from "mongoose";

export type LeadDocument = {
  name: string;
  phone: string;
  location: string;
  home_type: string;
  budget: string;
  interest_level: "cold" | "warm" | "hot";
  referral_source?: string;
  created_at: Date;
};

const leadSchema = new Schema<LeadDocument>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    home_type: { type: String, required: true },
    budget: { type: String, required: true },
    interest_level: { type: String, enum: ["cold", "warm", "hot"], default: "warm" },
    referral_source: { type: String }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Lead: Model<LeadDocument> = models.Lead || model<LeadDocument>("Lead", leadSchema);
