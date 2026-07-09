import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Proposal } from "@/lib/models/Proposal";
import { ProposalItem } from "@/lib/models/ProposalItem";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { markProposalStatusTimestamp, recordTimeline } from "@/lib/services/revenue-engine";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const proposal =
      (await Proposal.findById(params.id)) ||
      (await Proposal.findOne({ proposal_url_slug: params.id }));
    if (!proposal) {
      return apiError("NOT_FOUND", "Proposal not found.", 404);
    }
    if (!proposal.viewed_at && proposal.status === "sent") {
      await markProposalStatusTimestamp(proposal, "viewed", "customer", "Viewed public proposal");
      await proposal.save();
      await recordTimeline({
        leadId: proposal.lead_id,
        customerId: proposal.customer_id,
        proposalId: proposal._id.toString(),
        eventName: "proposal_viewed",
        title: "Proposal viewed"
      });
    }
    const items = await ProposalItem.find({ proposal_id: proposal._id.toString() });
    return apiOk({ proposal, items });
  } catch (error) {
    return handleApiError(error);
  }
}

