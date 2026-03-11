import { Model, Schema, model, models } from "mongoose";

export type SiteVisitStatus = "Scheduled" | "Engineer Assigned" | "Completed" | "Report Submitted";

export type SiteVisitDocument = {
  lead_id: string;
  engineer?: string;
  date: string;
  location: string;
  status: SiteVisitStatus;
  created_at: Date;
  updated_at: Date;
};

const siteVisitSchema = new Schema<SiteVisitDocument>(
  {
    lead_id: { type: String, required: true, index: true },
    engineer: { type: String },
    date: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Engineer Assigned", "Completed", "Report Submitted"],
      default: "Scheduled"
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const SiteVisit: Model<SiteVisitDocument> =
  models.SiteVisit || model<SiteVisitDocument>("SiteVisit", siteVisitSchema);

