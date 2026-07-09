import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Campaign } from "@/lib/models/Campaign";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { getSessionFromRequest } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit";

const campaignPatchSchema = z.object({
  title: z.string().trim().min(1).optional(),
  message: z.string().trim().min(1).max(4000).optional(),
  media: z.string().url().optional(),
  segment: z.enum(["all_leads", "new_leads", "active_prospects", "customers"]).optional(),
  send_time: z.string().optional(),
  status: z.enum(["draft", "scheduled", "sent"]).optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await parseJson(request, campaignPatchSchema);
    const { title, message, media, segment, send_time, status } = body;
    await connectDb();
    const update: Record<string, unknown> = {};
    if (title !== undefined) update.title = title;
    if (message !== undefined) update.message = message;
    if (media !== undefined) update.media = media;
    if (segment !== undefined) update.segment = segment;
    if (send_time !== undefined) update.send_time = new Date(send_time);
    if (status !== undefined) update.status = status;
    const campaign = await Campaign.findByIdAndUpdate(params.id, { $set: update }, { new: true });
    if (!campaign) return apiError("NOT_FOUND", "Campaign not found.", 404);
    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "customer_change",
      target_type: "campaign",
      target_id: params.id,
      metadata: { event: "campaign_updated" }
    });
    return apiOk({ campaign });
  } catch (e) {
    return handleApiError(e);
  }
}
