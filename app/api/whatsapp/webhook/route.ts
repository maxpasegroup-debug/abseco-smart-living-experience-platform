import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Lead } from "@/lib/models/Lead";
import { Message } from "@/lib/models/Message";
import { ConsultationRequest } from "@/lib/models/ConsultationRequest";
import {
  queueMessage,
  getMenuReply,
  createConsultationRequest,
  notifySales
} from "@/lib/services/whatsapp-engine";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("91") ? digits : `91${digits}`;
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge || "", { status: 200 });
  }
  return NextResponse.json({ error: "Invalid verification" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    if (!value?.messages) {
      return NextResponse.json({ ok: true });
    }
    const from = value.messages[0].from;
    const text = value.messages[0].text?.body || value.messages[0].type || "";
    const phone = normalizePhone(from);
    await connectDb();
    const lead = await Lead.findOne({ phone }).sort({ created_at: -1 });
    const leadId = lead?._id?.toString();
    if (leadId) {
      await Message.create({ lead_id: leadId, sender: "lead", message: text, timestamp: new Date() });
    }
    const reply = getMenuReply(text);
    if (reply) {
      await queueMessage({ to: phone, message: reply, lead_id: leadId });
      return NextResponse.json({ ok: true });
    }
    if (text.toLowerCase().includes("consultation") || text.toLowerCase().includes("book") || text.toLowerCase().includes("yes")) {
      const existing = await ConsultationRequest.findOne({ lead_id: leadId, status: "pending" });
      if (existing) {
        await queueMessage({ to: phone, message: "We have your request. Our team will call you shortly.", lead_id: leadId });
      } else if (leadId) {
        const parts = text.split(/[\n,]/).map((s: string) => s.trim()).filter(Boolean);
        await createConsultationRequest({
          lead_id: leadId,
          phone,
          name: lead?.name,
          city: parts[0] || lead?.location || "Not shared",
          property_type: parts[1] || "Not shared",
          construction_stage: parts[2] || "Not shared"
        });
        await queueMessage({ to: phone, message: "Thank you. We have noted your request and will contact you soon.", lead_id: leadId });
      }
      return NextResponse.json({ ok: true });
    }
    if (text.toLowerCase().includes("quotation") || text.toLowerCase().includes("quote")) {
      if (leadId) await notifySales("quotation_request", leadId, "Quotation requested", `Lead requested quotation. Phone: ${phone}`);
      await queueMessage({ to: phone, message: "We will send you a custom quotation shortly. Our team will reach out.", lead_id: leadId });
      return NextResponse.json({ ok: true });
    }
    if (text.toLowerCase().includes("site visit") || text.toLowerCase().includes("visit")) {
      if (leadId) await notifySales("site_visit_ready", leadId, "Site visit interest", `Lead asked for site visit. Phone: ${phone}`);
      await queueMessage({ to: phone, message: "We will schedule a site visit. Our team will call you.", lead_id: leadId });
      return NextResponse.json({ ok: true });
    }
    await queueMessage({ to: phone, message: "Reply with 1 for ideas, 2 for consultation, 3 for installations.", lead_id: leadId });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
