import { Model, Schema, model, models } from "mongoose";

export type CampaignDocument = {
  title: string;
  message: string;
  media?: string;
  media_type?: "image" | "video";
  segment: "all_leads" | "new_leads" | "active_prospects" | "customers";
  send_time?: Date;
  status: "draft" | "scheduled" | "sent";
  sent_at?: Date;
  created_at: Date;
  updated_at: Date;
};

const campaignSchema = new Schema<CampaignDocument>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    media: { type: String },
    media_type: { type: String, enum: ["image", "video"] },
    segment: {
      type: String,
      enum: ["all_leads", "new_leads", "active_prospects", "customers"],
      required: true
    },
    send_time: { type: Date },
    status: { type: String, enum: ["draft", "scheduled", "sent"], default: "draft" },
    sent_at: { type: Date }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Campaign: Model<CampaignDocument> =
  models.Campaign || model<CampaignDocument>("Campaign", campaignSchema);
