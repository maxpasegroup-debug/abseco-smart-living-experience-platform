import { Model, Schema, model, models } from "mongoose";

export type EngineerAvailabilitySlot = {
  day: string; // e.g. "Mon", "Tue"
  time: string; // e.g. "10:00", "14:00"
};

export type EngineerPerformance = {
  completed_projects: number;
  average_rating: number;
  qa_pass_rate: number;
};

export type EngineerDocument = {
  name: string;
  role?: "primary" | "assistant" | "qa" | "project_manager";
  region: string;
  phone?: string;
  email?: string;
  skills?: string[];
  availability_status?: "available" | "assigned" | "on_leave" | "inactive";
  availability: EngineerAvailabilitySlot[];
  assigned_project_ids?: string[];
  performance?: EngineerPerformance;
  active: boolean;
  created_at: Date;
  updated_at: Date;
};

const availabilitySchema = new Schema<EngineerAvailabilitySlot>(
  {
    day: { type: String, required: true },
    time: { type: String, required: true }
  },
  { _id: false }
);

const engineerSchema = new Schema<EngineerDocument>(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["primary", "assistant", "qa", "project_manager"], default: "primary" },
    region: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    skills: { type: [String], default: [] },
    availability_status: {
      type: String,
      enum: ["available", "assigned", "on_leave", "inactive"],
      default: "available",
      index: true
    },
    availability: { type: [availabilitySchema], default: [] },
    assigned_project_ids: { type: [String], default: [] },
    performance: {
      completed_projects: { type: Number, default: 0 },
      average_rating: { type: Number, default: 0 },
      qa_pass_rate: { type: Number, default: 0 }
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Engineer: Model<EngineerDocument> =
  models.Engineer || model<EngineerDocument>("Engineer", engineerSchema);

