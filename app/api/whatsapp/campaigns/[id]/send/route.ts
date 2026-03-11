import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Campaign } from "@/lib/models/Campaign";
import { Lead } from "@/lib/models/Lead";
import { queueMessage } from "@/lib/services/whatsapp-engine";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const campaign = await Campaign.findById(params.id);
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    let query = {};
    if (campaign.segment === "new_leads") query = { status: "new" };
    else if (campaign.segment === "active_prospects") query = { status: { $in: ["contacted", "qualified"] } };
    else if (campaign.segment === "customers") query = { status: "customer" };
    const leads = await Lead.find(query).select("phone _id").limit(500);
    for (const lead of leads) {
      if (lead.phone) await queueMessage({ to: lead.phone, message: campaign.message, lead_id: lead._id.toString() });
    }
    await Campaign.updateOne({ _id: campaign._id }, { status: "sent", sent_at: new Date() });
    return NextResponse.json({ ok: true, sent_to: leads.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
