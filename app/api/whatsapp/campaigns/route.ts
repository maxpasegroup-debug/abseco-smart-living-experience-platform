import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Campaign } from "@/lib/models/Campaign";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth/session";

const campaignSchema = z.object({
  title: z.string().trim().min(1),
  message: z.string().trim().min(1).max(4000),
  media: z.string().url().optional(),
  segment: z.enum(["all_leads", "new_leads", "active_prospects", "customers"]).default("all_leads"),
  send_time: z.string().optional(),
  status: z.enum(["draft", "scheduled", "sent"]).optional()
});

export async function GET() {
  try {
    await connectDb();
    const campaigns = await Campaign.find().sort({ created_at: -1 }).limit(50);
    return apiOk({ campaigns });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, campaignSchema);
    const { title, message, media, segment, send_time, status } = body;
    await connectDb();
    const campaign = await Campaign.create({
      title,
      message,
      media: media || undefined,
      segment: segment || "all_leads",
      send_time: send_time ? new Date(send_time) : undefined,
      status: status || "draft"
    });
    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "customer_change",
      target_type: "campaign",
      target_id: campaign._id.toString(),
      metadata: { event: "campaign_created", segment: campaign.segment }
    });
    return apiOk({ campaign }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
