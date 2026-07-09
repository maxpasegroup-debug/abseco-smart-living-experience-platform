import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Lead } from "@/lib/models/Lead";
import { Message } from "@/lib/models/Message";
import { queueMessage } from "@/lib/services/whatsapp-engine";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { getSessionFromRequest } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit";

const sendMessageSchema = z.object({
  lead_id: z.string().min(1),
  text: z.string().trim().min(1).max(4000)
});

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, sendMessageSchema);
    const { lead_id, text } = body;
    await connectDb();
    const lead = await Lead.findById(lead_id);
    if (!lead || !lead.phone) {
      return apiError("BAD_REQUEST", "Lead phone not available.", 400);
    }
    await queueMessage({ to: lead.phone, message: text, lead_id });
    await Message.create({
      lead_id,
      sender: "sales",
      message: text,
      timestamp: new Date()
    });
    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "lead_update",
      target_type: "lead",
      target_id: lead_id,
      metadata: { event: "message_sent" }
    });
    return apiOk({});
  } catch (error) {
    return handleApiError(error);
  }
}

