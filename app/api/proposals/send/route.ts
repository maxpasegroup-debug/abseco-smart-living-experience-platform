import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Proposal } from "@/lib/models/Proposal";
import { Lead } from "@/lib/models/Lead";
import { queueMessage } from "@/lib/services/whatsapp-engine";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { getSessionFromRequest } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit";
import { markProposalStatusTimestamp, notifyRevenue, recordTimeline } from "@/lib/services/revenue-engine";

const sendProposalSchema = z.object({
  proposal_id: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, sendProposalSchema);
    const { proposal_id } = body;
    await connectDb();
    const proposal = await Proposal.findById(proposal_id);
    if (!proposal) {
      return apiError("NOT_FOUND", "Proposal not found.", 404);
    }
    const lead = await Lead.findById(proposal.lead_id);
    if (!lead || !lead.phone) {
      return apiError("BAD_REQUEST", "Lead phone not available.", 400);
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

    await markProposalStatusTimestamp(proposal, "sent", "system", "Sent through WhatsApp queue");
    await proposal.save();
    await recordTimeline({
      leadId: proposal.lead_id,
      customerId: proposal.customer_id,
      proposalId: proposal._id.toString(),
      eventName: "proposal_sent",
      title: "Proposal sent",
      metadata: { channel: "whatsapp", link }
    });
    await notifyRevenue({
      type: "proposal_sent",
      leadId: proposal.lead_id,
      title: "Proposal sent",
      body: "Proposal link was queued for customer delivery.",
      recipientRole: "admin"
    });

    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "proposal_change",
      target_type: "proposal",
      target_id: proposal._id.toString(),
      metadata: { event: "sent", lead_id: proposal.lead_id }
    });
    return apiOk({});
  } catch (error) {
    return handleApiError(error);
  }
}

