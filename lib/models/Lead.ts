import { Model, Schema, model, models } from "mongoose";

export type LeadEngagementEvent = {
  type: string;
  context?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
};

export type LeadTemperature = "cold" | "warm" | "hot";

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
  partner_id?: string;
  interest_level: LeadTemperature;
  referral_source?: string;
  status?: "new" | "contacted" | "qualified" | "customer";
  assigned_sales_rep?: string;
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
    partner_id: { type: String },
    interest_level: { type: String, enum: ["cold", "warm", "hot"], default: "warm" },
    referral_source: { type: String },
    status: { type: String, enum: ["new", "contacted", "qualified", "customer"], default: "new" },
    assigned_sales_rep: { type: String },
    last_whatsapp_at: { type: Date },
    welcome_sent_at: { type: Date },
    follow_up_stage: { type: Number, default: 0 },
    last_activity: { type: Date },
    engagement_events: { type: [engagementEventSchema], default: [] }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Lead: Model<LeadDocument> = models.Lead || model<LeadDocument>("Lead", leadSchema);
