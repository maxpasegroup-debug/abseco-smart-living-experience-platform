import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Proposal } from "@/lib/models/Proposal";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { getSessionFromRequest } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit";
import { markProposalStatusTimestamp, notifyRevenue, recordTimeline } from "@/lib/services/revenue-engine";
import { createOrderFromApprovedProposal } from "@/lib/services/commerce-engine";

const proposalStatusSchema = z.object({
  proposal_id: z.string().min(1),
  status: z.enum([
    "draft",
    "requested",
    "preparing",
    "internal_review",
    "sent",
    "viewed",
    "customer_review",
    "revision_requested",
    "approved",
    "accepted",
    "rejected",
    "expired",
    "converted"
  ]),
  notes: z.string().optional()
});

export async function PUT(request: NextRequest) {
  try {
    const body = await parseJson(request, proposalStatusSchema);
    const { proposal_id, status, notes } = body;
    await connectDb();
    const proposal = await Proposal.findById(proposal_id);
    if (!proposal) {
      return apiError("NOT_FOUND", "Proposal not found.", 404);
    }
    const session = await getSessionFromRequest(request);
    await markProposalStatusTimestamp(proposal, status, session?.user.id, notes);
    await proposal.save();
    await recordTimeline({
      leadId: proposal.lead_id,
      customerId: proposal.customer_id,
      proposalId: proposal._id.toString(),
      eventName: `proposal_${status}`,
      title: `Proposal ${status.replace(/_/g, " ")}`,
      metadata: { notes }
    });
    await notifyRevenue({
      type: "status_change",
      leadId: proposal.lead_id,
      title: "Proposal status changed",
      body: `Proposal moved to ${status.replace(/_/g, " ")}.`,
      recipientRole: "sales",
      recipientId: proposal.assigned_sales_rep
    });
    const order =
      status === "approved" || status === "accepted"
        ? await createOrderFromApprovedProposal(proposal._id.toString())
        : null;
    await writeAuditLog({
      request,
      session,
      action: "proposal_change",
      target_type: "proposal",
      target_id: proposal._id.toString(),
      metadata: { event: "status_updated", status }
    });
    return apiOk({ proposal, order });
  } catch (error) {
    return handleApiError(error);
  }
}

