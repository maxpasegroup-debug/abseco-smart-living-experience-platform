import { Model, Schema, model, models } from "mongoose";

export type LeadEngagementEvent = {
  type: string;
  context?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
};

export type LeadTemperature = "cold" | "warm" | "hot";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_requested"
  | "consultation_booked"
  | "site_visit_requested"
  | "customer";

export type LeadAssignmentHistory = {
  sales_rep: string;
  reason?: string;
  assigned_by?: string;
  assigned_at: Date;
};

export type LeadDocument = {
  name: string;
  phone: string;
  location: string;
  home_type: string;
  rooms?: string;
  budget: string;
  priority?: string;
  lead_score?: number;
  lead_temperature?: LeadTemperature;
  lead_source?: string;
  campaign?: string;
  planner_plan_id?: string;
  planner_score?: number;
  recommendation?: Record<string, unknown>;
  customer_intent?: string;
  preferred_contact_method?: "phone" | "whatsapp" | "email" | "video";
  buying_timeline?: string;
  tags?: string[];
  region?: string;
  partner_id?: string;
  interest_level: LeadTemperature;
  referral_source?: string;
  status?: LeadStatus;
  assigned_sales_rep?: string;
  assignment_history?: LeadAssignmentHistory[];
  last_whatsapp_at?: Date;
  welcome_sent_at?: Date;
  follow_up_stage?: number;
  last_activity?: Date;
  engagement_events?: LeadEngagementEvent[];
  created_at: Date;
};

const engagementEventSchema = new Schema<LeadEngagementEvent>(
  {
    type: { type: String, required: true },
    context: { type: String },
    metadata: { type: Schema.Types.Mixed },
    created_at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const assignmentHistorySchema = new Schema<LeadAssignmentHistory>(
  {
    sales_rep: { type: String, required: true },
    reason: { type: String },
    assigned_by: { type: String },
    assigned_at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const leadSchema = new Schema<LeadDocument>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    home_type: { type: String, required: true },
    rooms: { type: String },
    budget: { type: String, required: true },
    priority: { type: String },
    lead_score: { type: Number, default: 0 },
    lead_temperature: { type: String, enum: ["cold", "warm", "hot"], default: "warm" },
    lead_source: { type: String, index: true },
    campaign: { type: String, index: true },
    planner_plan_id: { type: String, index: true },
    planner_score: { type: Number, default: 0 },
    recommendation: { type: Schema.Types.Mixed },
    customer_intent: { type: String },
    preferred_contact_method: { type: String, enum: ["phone", "whatsapp", "email", "video"] },
    buying_timeline: { type: String },
    tags: { type: [String], default: [] },
    region: { type: String, index: true },
    partner_id: { type: String },
    interest_level: { type: String, enum: ["cold", "warm", "hot"], default: "warm" },
    referral_source: { type: String },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "proposal_requested",
        "consultation_booked",
        "site_visit_requested",
        "customer"
      ],
      default: "new",
      index: true
    },
    assigned_sales_rep: { type: String },
    assignment_history: { type: [assignmentHistorySchema], default: [] },
    last_whatsapp_at: { type: Date },
    welcome_sent_at: { type: Date },
    follow_up_stage: { type: Number, default: 0 },
    last_activity: { type: Date },
    engagement_events: { type: [engagementEventSchema], default: [] }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Lead: Model<LeadDocument> = models.Lead || model<LeadDocument>("Lead", leadSchema);
