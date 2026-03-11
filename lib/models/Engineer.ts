import { Model, Schema, model, models } from "mongoose";

export type EngineerAvailabilitySlot = {
  day: string; // e.g. "Mon", "Tue"
  time: string; // e.g. "10:00", "14:00"
};

export type EngineerDocument = {
  name: string;
  region: string;
  availability: EngineerAvailabilitySlot[];
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
    region: { type: String, required: true },
    availability: { type: [availabilitySchema], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Engineer: Model<EngineerDocument> =
  models.Engineer || model<EngineerDocument>("Engineer", engineerSchema);

