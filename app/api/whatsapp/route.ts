import { NextRequest, NextResponse } from "next/server";
import { dispatchWhatsApp, WhatsAppBot } from "@/lib/services/whatsapp";

export async function POST(request: NextRequest) {
  const { bot, to, message, context } = await request.json();
  if (!bot || !to || !message) {
    return NextResponse.json({ error: "bot, to, message are required" }, { status: 400 });
  }

  const result = await dispatchWhatsApp(bot as WhatsAppBot, { to, message, context });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
