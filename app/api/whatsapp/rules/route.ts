import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { AutomationRule } from "@/lib/models/AutomationRule";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth/session";

const ruleSchema = z.object({
  name: z.string().trim().min(1),
  trigger: z.enum(["new_lead", "no_reply", "keyword", "consultation_request"]),
  condition: z.record(z.unknown()).optional(),
  action: z.enum(["send_message", "create_consultation", "mark_qualified", "notify_sales"]),
  action_payload: z.record(z.unknown()).optional(),
  delay_minutes: z.number().min(0).optional(),
  enabled: z.boolean().optional()
});

export async function GET() {
  try {
    await connectDb();
    const rules = await AutomationRule.find().sort({ createdAt: -1 });
    return apiOk({ rules });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, ruleSchema);
    const { name, trigger, condition, action, action_payload, delay_minutes, enabled } = body;
    await connectDb();
    const rule = await AutomationRule.create({
      name,
      trigger,
      condition: condition || undefined,
      action,
      action_payload: action_payload || undefined,
      delay_minutes: delay_minutes ?? 0,
      enabled: enabled !== false
    });
    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "customer_change",
      target_type: "automation_rule",
      target_id: rule._id.toString(),
      metadata: { event: "rule_created", trigger, action }
    });
    return apiOk({ rule }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
