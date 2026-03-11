import { Model, Schema, model, models } from "mongoose";

export type TemplateDocument = {
  channel: "whatsapp" | "email" | "sms";
  name: string;
  title: string;
  body: string;
  media_url?: string;
  category?: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  created_at: Date;
  updated_at: Date;
};

const templateSchema = new Schema<TemplateDocument>(
  {
    channel: { type: String, enum: ["whatsapp", "email", "sms"], default: "whatsapp" },
    name: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    media_url: { type: String },
    category: { type: String },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected"],
      default: "draft"
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Template: Model<TemplateDocument> =
  models.Template || model<TemplateDocument>("Template", templateSchema);

