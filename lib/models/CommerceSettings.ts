import { Model, Schema, model, models } from "mongoose";

export type BookingMode = "fixed" | "percentage";

export type CommerceSettingsDocument = {
  key: "default";
  booking_mode: BookingMode;
  booking_value: number;
  gst_percentage?: number;
  coupons_enabled: boolean;
  discounts_enabled: boolean;
  active_provider: "razorpay";
  created_at: Date;
  updated_at: Date;
};

const commerceSettingsSchema = new Schema<CommerceSettingsDocument>(
  {
    key: { type: String, enum: ["default"], default: "default", unique: true },
    booking_mode: { type: String, enum: ["fixed", "percentage"], default: "fixed" },
    booking_value: { type: Number, required: true, default: 0 },
    gst_percentage: { type: Number, default: 0 },
    coupons_enabled: { type: Boolean, default: false },
    discounts_enabled: { type: Boolean, default: false },
    active_provider: { type: String, enum: ["razorpay"], default: "razorpay" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const CommerceSettings: Model<CommerceSettingsDocument> =
  models.CommerceSettings ||
  model<CommerceSettingsDocument>("CommerceSettings", commerceSettingsSchema);
