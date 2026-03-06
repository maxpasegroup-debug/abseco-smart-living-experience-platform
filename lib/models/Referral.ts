import { Model, Schema, model, models } from "mongoose";

export type ReferralDocument = {
  partnerId: string;
  leadId: string;
  status: "new" | "qualified" | "converted";
  commissionEarned: number;
  createdAt: Date;
  updatedAt: Date;
};

const referralSchema = new Schema<ReferralDocument>(
  {
    partnerId: { type: String, required: true },
    leadId: { type: String, required: true },
    status: { type: String, enum: ["new", "qualified", "converted"], default: "new" },
    commissionEarned: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Referral: Model<ReferralDocument> =
  models.Referral || model<ReferralDocument>("Referral", referralSchema);
