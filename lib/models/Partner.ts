import { Model, Schema, model, models } from "mongoose";

export type PartnerDocument = {
  name: string;
  phone: string;
  profession: string;
  city: string;
  years_experience: number;
  company_name?: string;
  status: "pending" | "approved" | "rejected";
  partner_id: string;
  referral_slug: string;
  commission_rate: number;
  createdAt: Date;
  updatedAt: Date;
};

const partnerSchema = new Schema<PartnerDocument>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    profession: { type: String, required: true },
    city: { type: String, required: true },
    years_experience: { type: Number, required: true },
    company_name: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
    partner_id: { type: String, required: true, unique: true },
    referral_slug: { type: String, required: true, unique: true },
    commission_rate: { type: Number, default: 4 }
  },
  { timestamps: true }
);

export const Partner: Model<PartnerDocument> =
  models.Partner || model<PartnerDocument>("Partner", partnerSchema);
