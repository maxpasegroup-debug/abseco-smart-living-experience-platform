import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Lead } from "@/lib/models/Lead";
import { Message } from "@/lib/models/Message";
import { queueMessage } from "@/lib/services/whatsapp-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, text } = body;
    if (!lead_id || !text) {
      return NextResponse.json({ error: "lead_id and text are required" }, { status: 400 });
    }
    await connectDb();
    const lead = await Lead.findById(lead_id);
    if (!lead || !lead.phone) {
      return NextResponse.json({ error: "Lead phone not available" }, { status: 400 });
    }
    await queueMessage({ to: lead.phone, message: text, lead_id });
    await Message.create({
      lead_id,
      sender: "sales",
      message: text,
      timestamp: new Date()
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

