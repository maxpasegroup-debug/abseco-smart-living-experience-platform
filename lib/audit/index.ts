import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { AuditLog, type AuditAction } from "@/lib/models/AuditLog";
import type { AuthSession } from "@/lib/auth/session";
import { logger } from "@/lib/logger";

export async function writeAuditLog(params: {
  request?: NextRequest;
  session?: AuthSession | null;
  action: AuditAction;
  target_type?: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await connectDb();
    await AuditLog.create({
      action: params.action,
      actor_id: params.session?.user.id,
      actor_role: params.session?.user.role,
      target_type: params.target_type,
      target_id: params.target_id,
      metadata: params.metadata,
      ip:
        params.request?.headers.get("x-forwarded-for") ||
        params.request?.headers.get("x-real-ip") ||
        "",
      user_agent: params.request?.headers.get("user-agent") || ""
    });
    logger.audit(params.action, {
      actor: params.session?.user.id,
      role: params.session?.user.role,
      target_type: params.target_type,
      target_id: params.target_id
    });
  } catch (error) {
    logger.error("Failed to write audit log", { error: String(error), action: params.action });
  }
}
