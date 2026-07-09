import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { AutomationRule } from "@/lib/models/AutomationRule";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth/session";

const rulePatchSchema = z.object({
  name: z.string().trim().min(1).optional(),
  trigger: z.enum(["new_lead", "no_reply", "keyword", "consultation_request"]).optional(),
  condition: z.record(z.unknown()).optional(),
  action: z.enum(["send_message", "create_consultation", "mark_qualified", "notify_sales"]).optional(),
  action_payload: z.record(z.unknown()).optional(),
  delay_minutes: z.number().min(0).optional(),
  enabled: z.boolean().optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await parseJson(request, rulePatchSchema);
    const { name, trigger, condition, action, action_payload, delay_minutes, enabled } = body;
    await connectDb();
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (trigger !== undefined) update.trigger = trigger;
    if (condition !== undefined) update.condition = condition;
    if (action !== undefined) update.action = action;
    if (action_payload !== undefined) update.action_payload = action_payload;
    if (delay_minutes !== undefined) update.delay_minutes = delay_minutes;
    if (enabled !== undefined) update.enabled = enabled;
    const rule = await AutomationRule.findByIdAndUpdate(params.id, { $set: update }, { new: true });
    if (!rule) return apiError("NOT_FOUND", "Rule not found.", 404);
    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "customer_change",
      target_type: "automation_rule",
      target_id: params.id,
      metadata: { event: "rule_updated" }
    });
    return apiOk({ rule });
  } catch (e) {
    return handleApiError(e);
  }
}
