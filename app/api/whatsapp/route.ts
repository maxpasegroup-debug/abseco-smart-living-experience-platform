import { NextRequest } from "next/server";
import { dispatchWhatsApp, WhatsAppBot } from "@/lib/services/whatsapp";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";

const whatsappDispatchSchema = z.object({
  bot: z.enum(["RIO", "TARA", "NEXA"]),
  to: z.string().min(7).max(20),
  message: z.string().trim().min(1).max(4000),
  context: z.record(z.string()).optional()
});

export async function POST(request: NextRequest) {
  try {
    const { bot, to, message, context } = await parseJson(request, whatsappDispatchSchema);
    const result = await dispatchWhatsApp(bot as WhatsAppBot, { to, message, context });
    if (!result.ok) return apiError("BAD_REQUEST", "WhatsApp dispatch failed.", 400, result);
    return apiOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
