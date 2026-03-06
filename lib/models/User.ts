import { Model, Schema, model, models } from "mongoose";

export type UserDocument = {
  name?: string;
  phone: string;
  email?: string;
  role: "customer" | "partner" | "sales" | "admin";
  provider: "otp" | "google";
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    name: String,
    phone: { type: String, required: true, unique: true },
    email: String,
    role: {
      type: String,
      enum: ["customer", "partner", "sales", "admin"],
      default: "customer"
    },
    provider: { type: String, enum: ["otp", "google"], default: "otp" }
  },
  { timestamps: true }
);

export const User: Model<UserDocument> = models.User || model<UserDocument>("User", userSchema);
