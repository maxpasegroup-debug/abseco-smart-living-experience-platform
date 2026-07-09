import { Model, Schema, model, models } from "mongoose";

export type ActivityTimelineDocument = {
  lead_id?: string;
  customer_id?: string;
  planner_plan_id?: string;
  proposal_id?: string;
  order_id?: string;
  project_id?: string;
  consultation_id?: string;
  site_visit_id?: string;
  event_name: string;
  title: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
};

const activityTimelineSchema = new Schema<ActivityTimelineDocument>(
  {
    lead_id: { type: String, index: true },
    customer_id: { type: String, index: true },
    planner_plan_id: { type: String, index: true },
    proposal_id: { type: String, index: true },
    order_id: { type: String, index: true },
    project_id: { type: String, index: true },
    consultation_id: { type: String, index: true },
    site_visit_id: { type: String, index: true },
    event_name: { type: String, required: true, index: true },
    title: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const ActivityTimeline: Model<ActivityTimelineDocument> =
  models.ActivityTimeline ||
  model<ActivityTimelineDocument>("ActivityTimeline", activityTimelineSchema);
