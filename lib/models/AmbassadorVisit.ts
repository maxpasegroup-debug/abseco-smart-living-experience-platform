import { Model, Schema, model, models } from "mongoose";

export type AmbassadorVisitDocument = {
  ambassador_id: string;
  visitor_ip?: string;
  user_agent?: string;
  created_at: Date;
};

const ambassadorVisitSchema = new Schema<AmbassadorVisitDocument>(
  {
    ambassador_id: { type: String, required: true, index: true },
    visitor_ip: { type: String },
    user_agent: { type: String },
    created_at: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export const AmbassadorVisit: Model<AmbassadorVisitDocument> =
  models.AmbassadorVisit ||
  model<AmbassadorVisitDocument>("AmbassadorVisit", ambassadorVisitSchema);

