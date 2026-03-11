import { Model, Schema, model, models } from "mongoose";

export type ConsultationStatus = "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";

export type ConsultationDocument = {
  lead_id: string;
  consultation_type: "online" | "phone" | "site_visit";
  date: string;
  time: string;
  city?: string;
  property_type?: string;
  construction_stage?: string;
  assigned_rep?: string;
  status: ConsultationStatus;
  outcome?: "Interested" | "Need Follow-Up" | "Proposal Requested" | "Not Interested";
  created_at: Date;
  updated_at: Date;
};

const consultationSchema = new Schema<ConsultationDocument>(
  {
    lead_id: { type: String, required: true, index: true },
    consultation_type: { type: String, enum: ["online", "phone", "site_visit"], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    city: { type: String },
    property_type: { type: String },
    construction_stage: { type: String },
    assigned_rep: { type: String },
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"], default: "Scheduled" },
    outcome: {
      type: String,
      enum: ["Interested", "Need Follow-Up", "Proposal Requested", "Not Interested"]
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Consultation: Model<ConsultationDocument> =
  models.Consultation || model<ConsultationDocument>("Consultation", consultationSchema);

