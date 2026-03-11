import { Model, Schema, model, models } from "mongoose";

export type MessageDocument = {
  lead_id: string;
  sender: "lead" | "system" | "sales";
  message: string;
  media?: string;
  media_type?: "image" | "video" | "document";
  timestamp: Date;
};

const messageSchema = new Schema<MessageDocument>(
  {
    lead_id: { type: String, required: true, index: true },
    sender: { type: String, enum: ["lead", "system", "sales"], required: true },
    message: { type: String, required: true },
    media: { type: String },
    media_type: { type: String, enum: ["image", "video", "document"] },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export const Message: Model<MessageDocument> =
  models.Message || model<MessageDocument>("Message", messageSchema);
