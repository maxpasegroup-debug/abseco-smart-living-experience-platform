import { Model, Schema, model, models } from "mongoose";

export type SiteVisitStatus = "Scheduled" | "Engineer Assigned" | "Completed" | "Report Submitted";

export type SiteVisitDocument = {
  lead_id: string;
  consultation_id?: string;
  assigned_sales_rep?: string;
  engineer?: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  google_maps_link?: string;
  property_stage?: "existing" | "construction" | "renovation";
  builder?: string;
  architect?: string;
  remarks?: string;
  status: SiteVisitStatus;
  created_at: Date;
  updated_at: Date;
};

const siteVisitSchema = new Schema<SiteVisitDocument>(
  {
    lead_id: { type: String, required: true, index: true },
    consultation_id: { type: String, index: true },
    assigned_sales_rep: { type: String },
    engineer: { type: String },
    date: { type: String, required: true },
    time: { type: String },
    location: { type: String, required: true },
    address: { type: String },
    google_maps_link: { type: String },
    property_stage: { type: String, enum: ["existing", "construction", "renovation"] },
    builder: { type: String },
    architect: { type: String },
    remarks: { type: String },
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

