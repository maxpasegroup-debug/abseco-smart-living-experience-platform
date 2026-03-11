import { Model, Schema, model, models } from "mongoose";

export type JourneyEventDocument = {
  lead_id?: string;
  event_name: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
};

const journeyEventSchema = new Schema<JourneyEventDocument>(
  {
    lead_id: { type: String, index: true },
    event_name: { type: String, required: true, index: true },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export const JourneyEvent: Model<JourneyEventDocument> =
  models.JourneyEvent || model<JourneyEventDocument>("JourneyEvent", journeyEventSchema);

