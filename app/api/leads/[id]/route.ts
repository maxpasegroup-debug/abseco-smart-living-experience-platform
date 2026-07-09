import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { Lead } from "@/lib/models/Lead";
import { SmartHomePlan } from "@/lib/models/SmartHomePlan";
import { Proposal } from "@/lib/models/Proposal";
import { ProposalRequest } from "@/lib/models/ProposalRequest";
import { Consultation } from "@/lib/models/Consultation";
import { SiteVisit } from "@/lib/models/SiteVisit";
import { ActivityTimeline } from "@/lib/models/ActivityTimeline";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";
import { Invoice } from "@/lib/models/Invoice";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDb();
    const lead = await Lead.findById(params.id);
    if (!lead) return apiError("NOT_FOUND", "Lead not found.", 404);

    const [plans, proposalRequests, proposals, consultations, siteVisits, orders, timeline] = await Promise.all([
      SmartHomePlan.find({ lead_id: params.id }).sort({ updated_at: -1 }).limit(20),
      ProposalRequest.find({ lead_id: params.id }).sort({ requested_at: -1 }).limit(20),
      Proposal.find({ lead_id: params.id }).sort({ created_at: -1 }).limit(20),
      Consultation.find({ lead_id: params.id }).sort({ created_at: -1 }).limit(20),
      SiteVisit.find({ lead_id: params.id }).sort({ created_at: -1 }).limit(20),
      Order.find({ lead_id: params.id }).sort({ created_at: -1 }).limit(20),
      ActivityTimeline.find({ lead_id: params.id }).sort({ created_at: -1 }).limit(100)
    ]);
    const orderIds = orders.map((order) => order._id.toString());
    const [payments, invoices] = await Promise.all([
      Payment.find({ order_id: { $in: orderIds } }).sort({ created_at: -1 }).limit(50),
      Invoice.find({ order_id: { $in: orderIds } }).sort({ created_at: -1 }).limit(50)
    ]);

    return apiOk({
      lead,
      plannerSummary: plans[0] || null,
      plans,
      proposalRequests,
      proposals,
      consultations,
      siteVisits,
      orders,
      payments,
      invoices,
      timeline
    });
  } catch (error) {
    return handleApiError(error);
  }
}
