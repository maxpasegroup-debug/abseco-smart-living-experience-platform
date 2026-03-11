import { Model, Schema, model, models } from "mongoose";

export type MessageQueueDocument = {
  to: string;
  message: string;
  media?: string;
  media_type?: string;
  lead_id?: string;
  status: "pending" | "sent" | "failed";
  scheduled_for: Date;
  sent_at?: Date;
  error?: string;
  created_at: Date;
};

const messageQueueSchema = new Schema<MessageQueueDocument>(
  {
    to: { type: String, required: true, index: true },
    message: { type: String, required: true },
    media: { type: String },
    media_type: { type: String },
    lead_id: { type: String, index: true },
    status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
    scheduled_for: { type: Date, required: true, index: true },
    sent_at: { type: Date },
    error: { type: String }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const MessageQueue: Model<MessageQueueDocument> =
  models.MessageQueue || model<MessageQueueDocument>("MessageQueue", messageQueueSchema);
