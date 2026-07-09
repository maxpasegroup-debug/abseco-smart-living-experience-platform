import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Campaign } from "@/lib/models/Campaign";
import { Lead } from "@/lib/models/Lead";
import { queueMessage } from "@/lib/services/whatsapp-engine";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { getSessionFromRequest } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const campaign = await Campaign.findById(params.id);
    if (!campaign) return apiError("NOT_FOUND", "Campaign not found.", 404);
    let query = {};
    if (campaign.segment === "new_leads") query = { status: "new" };
    else if (campaign.segment === "active_prospects") query = { status: { $in: ["contacted", "qualified"] } };
    else if (campaign.segment === "customers") query = { status: "customer" };
    const leads = await Lead.find(query).select("phone _id").limit(500);
    for (const lead of leads) {
      if (lead.phone) await queueMessage({ to: lead.phone, message: campaign.message, lead_id: lead._id.toString() });
    }
    await Campaign.updateOne({ _id: campaign._id }, { status: "sent", sent_at: new Date() });
    await writeAuditLog({
      request: _request,
      session: await getSessionFromRequest(_request),
      action: "customer_change",
      target_type: "campaign",
      target_id: params.id,
      metadata: { event: "campaign_sent", sent_to: leads.length }
    });
    return apiOk({ sent_to: leads.length });
  } catch (e) {
    return handleApiError(e);
  }
}
