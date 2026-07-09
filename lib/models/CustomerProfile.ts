import { Model, Schema, model, models } from "mongoose";

export type CustomerProfileDocument = {
  customer_id: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  preferred_language?: string;
  communication_preferences?: {
    whatsapp?: boolean;
    email?: boolean;
    phone?: boolean;
  };
  saved_homes?: Array<{
    label: string;
    home_type?: string;
    address?: string;
  }>;
  family_members?: Array<{
    name?: string;
    relationship?: string;
    phone?: string;
  }>;
  created_at: Date;
  updated_at: Date;
};

const customerProfileSchema = new Schema<CustomerProfileDocument>(
  {
    customer_id: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    preferred_language: { type: String, default: "English" },
    communication_preferences: {
      whatsapp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      phone: { type: Boolean, default: true }
    },
    saved_homes: {
      type: [
        {
          label: { type: String },
          home_type: { type: String },
          address: { type: String }
        }
      ],
      default: []
    },
    family_members: {
      type: [
        {
          name: { type: String },
          relationship: { type: String },
          phone: { type: String }
        }
      ],
      default: []
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const CustomerProfile: Model<CustomerProfileDocument> =
  models.CustomerProfile ||
  model<CustomerProfileDocument>("CustomerProfile", customerProfileSchema);
