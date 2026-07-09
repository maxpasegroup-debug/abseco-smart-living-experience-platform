import { Model, Schema, model, models } from "mongoose";

export type ConsultationStatus = "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
export type ConsultationType = "online" | "video" | "phone" | "whatsapp" | "showroom_visit" | "site_visit";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";

export type ConsultationDocument = {
  lead_id: string;
  consultation_type: ConsultationType;
  date: string;
  time: string;
  city?: string;
  property_type?: string;
  construction_stage?: string;
  assigned_rep?: string;
  preferred_date?: string;
  preferred_time?: string;
  remarks?: string;
  booking_status?: BookingStatus;
  status: ConsultationStatus;
  outcome?: "Interested" | "Need Follow-Up" | "Proposal Requested" | "Not Interested";
  created_at: Date;
  updated_at: Date;
};

const consultationSchema = new Schema<ConsultationDocument>(
  {
    lead_id: { type: String, required: true, index: true },
    consultation_type: {
      type: String,
      enum: ["online", "video", "phone", "whatsapp", "showroom_visit", "site_visit"],
      required: true
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    city: { type: String },
    property_type: { type: String },
    construction_stage: { type: String },
    assigned_rep: { type: String },
    preferred_date: { type: String },
    preferred_time: { type: String },
    remarks: { type: String },
    booking_status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "rescheduled"],
      default: "pending",
      index: true
    },
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

