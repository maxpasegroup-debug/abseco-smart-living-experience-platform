import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Proposal } from "@/lib/models/Proposal";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { markProposalStatusTimestamp, notifyRevenue, recordTimeline } from "@/lib/services/revenue-engine";
import { createOrderFromApprovedProposal } from "@/lib/services/commerce-engine";

const customerProposalActionSchema = z.object({
  action: z.enum(["approved", "rejected", "revision_requested", "viewed"]),
  notes: z.string().optional()
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await parseJson(request, customerProposalActionSchema);
    await connectDb();
    const proposal =
      (await Proposal.findById(params.id).catch(() => null)) ||
      (await Proposal.findOne({ proposal_url_slug: params.id }));
    if (!proposal) return apiError("NOT_FOUND", "Proposal not found.", 404);

    await markProposalStatusTimestamp(proposal, body.action, "customer", body.notes);
    await proposal.save();
    await recordTimeline({
      leadId: proposal.lead_id,
      customerId: proposal.customer_id,
      proposalId: proposal._id.toString(),
      eventName: `proposal_${body.action}`,
      title: `Customer ${body.action.replace(/_/g, " ")}`,
      metadata: { notes: body.notes }
    });
    await notifyRevenue({
      type: "status_change",
      leadId: proposal.lead_id,
      title: "Customer updated proposal",
      body: `Customer marked proposal as ${body.action.replace(/_/g, " ")}.`,
      recipientRole: "sales",
      recipientId: proposal.assigned_sales_rep
    });
    const order =
      body.action === "approved"
        ? await createOrderFromApprovedProposal(proposal._id.toString())
        : null;

    return apiOk({ proposal, order });
  } catch (error) {
    return handleApiError(error);
  }
}
