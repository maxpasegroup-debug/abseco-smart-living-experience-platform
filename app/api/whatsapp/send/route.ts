import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Message } from "@/lib/models/Message";
import { queueMessage, processQueue } from "@/lib/services/whatsapp-engine";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth/session";

const whatsappSendSchema = z.object({
  to: z.string().min(7).max(20),
  message: z.string().trim().min(1).max(4000),
  lead_id: z.string().optional(),
  queue: z.boolean().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, whatsappSendSchema);
    const { to, message, lead_id, queue: useQueue } = body;
    if (useQueue) {
      await queueMessage({ to, message, lead_id });
      return apiOk({ queued: true });
    }
    const { sendWhatsAppMessage } = await import("@/lib/services/whatsapp-provider");
    const result = await sendWhatsAppMessage({ to, message });
    if (result.ok && lead_id) {
      await connectDb();
      await Message.create({ lead_id, sender: "system", message, timestamp: new Date() });
      await writeAuditLog({
        request,
        session: await getSessionFromRequest(request),
        action: "lead_update",
        target_type: "lead",
        target_id: lead_id,
        metadata: { event: "whatsapp_sent" }
      });
    }
    if (!result.ok) return apiError("BAD_REQUEST", result.error || "WhatsApp send failed.", 400);
    return apiOk({});
  } catch (e) {
    return handleApiError(e);
  }
}

export async function GET() {
  try {
    const { processed, failed } = await processQueue();
    return apiOk({ processed, failed });
  } catch (e) {
    return handleApiError(e);
  }
}
