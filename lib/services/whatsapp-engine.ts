/**
 * ABSECO WhatsApp Sales Engine
 * Queue, send, and record messages; trigger automation.
 */

import { connectDb } from "@/lib/db/connect";
import { Lead } from "@/lib/models/Lead";
import { Message } from "@/lib/models/Message";
import { MessageQueue } from "@/lib/models/MessageQueue";
import { SalesNotification } from "@/lib/models/SalesNotification";
import { sendWhatsAppMessage } from "@/lib/services/whatsapp-provider";

const WELCOME_MESSAGE = `Welcome to ABSECO Smart Living.

You recently explored smart home automation with us.

How can we help you today?

1. Explore smart home ideas
2. Book a free consultation
3. See smart home installations`;

const MENU_1_REPLY = `Here are some smart home inspirations:

• Smart Lighting
• Smart Curtains
• Home Theatre
• Villa Automation

Reply with a number or "consultation" to book a free visit.`;

const MENU_2_REPLY = `Let's get you a free consultation.

Please share:
1. Your city
2. Property type (Apartment / Villa / House / Office)
3. Construction stage (Planning / Under construction / Ready)`;

const MENU_3_REPLY = `See real smart homes by ABSECO:

• Villas across Kerala
• Apartments & penthouses
• Office automation

Reply "consultation" to schedule a visit.`;

const FOLLOW_UP_24H = `Smart homes installed by ABSECO across Kerala.

Reply 1 for ideas, 2 for consultation, 3 for installations.`;

const FOLLOW_UP_48H = `Limited time offer on smart lighting automation.

Reply "consultation" to book a free site visit.`;

const FOLLOW_UP_72H = `Would you like to schedule your free smart home consultation?

Reply "yes" or "consultation" to get started.`;

export async function queueMessage(params: {
  to: string;
  message: string;
  lead_id?: string;
  media?: string;
  delay_ms?: number;
}): Promise<void> {
  await connectDb();
  const scheduled = new Date(Date.now() + (params.delay_ms || 0));
  await MessageQueue.create({
    to: params.to,
    message: params.message,
    lead_id: params.lead_id,
    status: "pending",
    scheduled_for: scheduled
  });
}

export async function processQueue(): Promise<{ processed: number; failed: number }> {
  await connectDb();
  const due = await MessageQueue.find({ status: "pending", scheduled_for: { $lte: new Date() } })
    .sort({ scheduled_for: 1 })
    .limit(30);
  let processed = 0;
  let failed = 0;
  for (const item of due) {
    const result = await sendWhatsAppMessage({ to: item.to, message: item.message, media_url: item.media });
    if (result.ok) {
      await MessageQueue.updateOne({ _id: item._id }, { status: "sent", sent_at: new Date() });
      if (item.lead_id) {
        await Message.create({ lead_id: item.lead_id, sender: "system", message: item.message, timestamp: new Date() });
        await Lead.updateOne({ _id: item.lead_id }, { last_whatsapp_at: new Date() });
      }
      processed++;
    } else {
      await MessageQueue.updateOne({ _id: item._id }, { status: "failed", error: result.error });
      failed++;
    }
  }
  return { processed, failed };
}

export async function triggerWelcome(leadId: string, phone: string): Promise<void> {
  await connectDb();
  const lead = await Lead.findById(leadId);
  if (!lead || lead.welcome_sent_at) return;
  await queueMessage({ to: phone, message: WELCOME_MESSAGE, lead_id: leadId });
  await Lead.updateOne({ _id: leadId }, { welcome_sent_at: new Date(), last_whatsapp_at: new Date(), status: "contacted" });
  await Message.create({ lead_id: leadId, sender: "system", message: WELCOME_MESSAGE, timestamp: new Date() });
}

export function getMenuReply(text: string): string | null {
  const t = text.trim().toLowerCase();
  if (t === "1") return MENU_1_REPLY;
  if (t === "2") return MENU_2_REPLY;
  if (t === "3") return MENU_3_REPLY;
  if (t.includes("consultation") || t === "2") return MENU_2_REPLY;
  return null;
}

export async function createConsultationRequest(params: {
  lead_id: string;
  phone: string;
  name?: string;
  city: string;
  property_type: string;
  construction_stage: string;
}): Promise<void> {
  const { ConsultationRequest } = await import("@/lib/models/ConsultationRequest");
  await connectDb();
  await ConsultationRequest.create(params);
  await Lead.updateOne({ _id: params.lead_id }, { status: "qualified" });
  await SalesNotification.create({
    type: "consultation_request",
    lead_id: params.lead_id,
    title: "Consultation requested",
    body: `${params.name || "Lead"} — ${params.city}, ${params.property_type}. Reply to engage.`
  });

  const bookingMessage =
    "Thank you for your interest in ABSECO Smart Living.\n\n" +
    "You can schedule a free smart home consultation here:\n\n" +
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/consultation`;
  await queueMessage({ to: params.phone, message: bookingMessage, lead_id: params.lead_id });
}

export async function scheduleFollowUps(leadId: string, phone: string): Promise<void> {
  await queueMessage({ to: phone, message: FOLLOW_UP_24H, lead_id: leadId, delay_ms: 24 * 60 * 60 * 1000 });
  await queueMessage({ to: phone, message: FOLLOW_UP_48H, lead_id: leadId, delay_ms: 48 * 60 * 60 * 1000 });
  await queueMessage({ to: phone, message: FOLLOW_UP_72H, lead_id: leadId, delay_ms: 72 * 60 * 60 * 1000 });
}

export async function notifySales(type: "quotation_request" | "site_visit_ready", leadId: string, title: string, body: string): Promise<void> {
  await connectDb();
  await SalesNotification.create({ type, lead_id: leadId, title, body });
}
