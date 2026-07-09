import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Lead } from "@/lib/models/Lead";
import { triggerWelcome, scheduleFollowUps } from "@/lib/services/whatsapp-engine";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

const leadCreateSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(7).max(20),
  location: z.string().trim().default(""),
  home_type: z.string().trim().min(1),
  rooms: z.string().optional(),
  budget: z.string().trim().min(1),
  priority: z.string().optional(),
  lead_score: z.number().min(0).max(100).optional(),
  lead_temperature: z.enum(["cold", "warm", "hot"]).optional(),
  lead_source: z.string().optional(),
  campaign: z.string().optional(),
  planner_score: z.number().min(0).max(100).optional(),
  customer_intent: z.string().optional(),
  preferred_contact_method: z.enum(["phone", "whatsapp", "email", "video"]).optional(),
  buying_timeline: z.string().optional(),
  tags: z.array(z.string()).optional(),
  region: z.string().optional(),
  partner_id: z.string().nullable().optional(),
  interest_level: z.enum(["cold", "warm", "hot"]).default("warm"),
  referral_source: z.string().optional(),
  status: z
    .enum(["new", "contacted", "qualified", "proposal_requested", "consultation_booked", "site_visit_requested", "customer"])
    .optional()
});

export async function GET() {
  try {
    await connectDb();
    const leads = await Lead.find().sort({ created_at: -1 }).limit(50);
    return apiOk({ leads });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await parseJson(request, leadCreateSchema);
    await connectDb();
    const lead = await Lead.create({ ...payload, partner_id: payload.partner_id || undefined });
    const leadId = lead._id.toString();
    const phone = lead.phone || "";
    if (phone) {
      try {
        await triggerWelcome(leadId, phone);
        await scheduleFollowUps(leadId, phone);
      } catch (waErr) {
        console.error("WhatsApp welcome/follow-up error:", waErr);
      }
    }
    await writeAuditLog({
      request,
      action: "lead_update",
      target_type: "lead",
      target_id: leadId,
      metadata: { source: payload.referral_source || "unknown", event: "created" }
    });
    return apiOk({ lead }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
