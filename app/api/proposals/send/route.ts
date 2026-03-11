import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Proposal } from "@/lib/models/Proposal";
import { Lead } from "@/lib/models/Lead";
import { queueMessage } from "@/lib/services/whatsapp-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposal_id } = body;
    if (!proposal_id) {
      return NextResponse.json({ error: "proposal_id is required" }, { status: 400 });
    }
    await connectDb();
    const proposal = await Proposal.findById(proposal_id);
    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }
    const lead = await Lead.findById(proposal.lead_id);
    if (!lead || !lead.phone) {
      return NextResponse.json({ error: "Lead phone not available" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const link = `${baseUrl}/proposal/${proposal.proposal_url_slug}`;
    const message =
      "Your ABSECO Smart Home Proposal is ready.\n\n" +
      "View your smart living plan here:\n" +
      link;

    await queueMessage({
      to: lead.phone,
      message,
      lead_id: proposal.lead_id
    });

    proposal.status = "sent";
    proposal.sent_at = new Date();
    await proposal.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

