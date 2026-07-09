import { Model, Schema, model, models } from "mongoose";

export type AuditAction =
  | "admin_login"
  | "admin_logout"
  | "role_change"
  | "proposal_change"
  | "customer_change"
  | "lead_update"
  | "consultation_update"
  | "delete_operation"
  | "security_event";

export type AuditLogDocument = {
  action: AuditAction;
  actor_id?: string;
  actor_role?: string;
  target_type?: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  user_agent?: string;
  created_at: Date;
};

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    action: { type: String, required: true, index: true },
    actor_id: { type: String, index: true },
    actor_role: { type: String },
    target_type: { type: String, index: true },
    target_id: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed },
    ip: { type: String },
    user_agent: { type: String }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const AuditLog: Model<AuditLogDocument> =
  models.AuditLog || model<AuditLogDocument>("AuditLog", auditLogSchema);
