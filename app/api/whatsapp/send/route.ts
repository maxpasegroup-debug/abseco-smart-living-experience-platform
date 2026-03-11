import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Message } from "@/lib/models/Message";
import { queueMessage, processQueue } from "@/lib/services/whatsapp-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, lead_id, queue: useQueue } = body;
    if (!to || !message) {
      return NextResponse.json({ error: "to and message required" }, { status: 400 });
    }
    if (useQueue) {
      await queueMessage({ to, message, lead_id });
      return NextResponse.json({ ok: true, queued: true });
    }
    const { sendWhatsAppMessage } = await import("@/lib/services/whatsapp-provider");
    const result = await sendWhatsAppMessage({ to, message });
    if (result.ok && lead_id) {
      await connectDb();
      await Message.create({ lead_id, sender: "system", message, timestamp: new Date() });
    }
    return NextResponse.json(result.ok ? { ok: true } : { ok: false, error: result.error }, { status: result.ok ? 200 : 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { processed, failed } = await processQueue();
    return NextResponse.json({ ok: true, processed, failed });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
