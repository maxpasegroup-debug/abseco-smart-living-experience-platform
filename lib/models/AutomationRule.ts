import { Model, Schema, model, models } from "mongoose";

export type AutomationRuleDocument = {
  name: string;
  trigger: "new_lead" | "no_reply" | "keyword" | "consultation_request";
  condition?: Record<string, unknown>;
  action: "send_message" | "create_consultation" | "mark_qualified" | "notify_sales";
  action_payload?: { message?: string; delay_hours?: number };
  delay_minutes?: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const automationRuleSchema = new Schema<AutomationRuleDocument>(
  {
    name: { type: String, required: true },
    trigger: {
      type: String,
      enum: ["new_lead", "no_reply", "keyword", "consultation_request"],
      required: true
    },
    condition: { type: Schema.Types.Mixed },
    action: {
      type: String,
      enum: ["send_message", "create_consultation", "mark_qualified", "notify_sales"],
      required: true
    },
    action_payload: { type: Schema.Types.Mixed },
    delay_minutes: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const AutomationRule: Model<AutomationRuleDocument> =
  models.AutomationRule || model<AutomationRuleDocument>("AutomationRule", automationRuleSchema);
