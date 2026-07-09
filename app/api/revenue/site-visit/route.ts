import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { SiteVisit } from "@/lib/models/SiteVisit";
import { Lead } from "@/lib/models/Lead";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { notifyRevenue, recordTimeline } from "@/lib/services/revenue-engine";

const siteVisitSchema = z.object({
  lead_id: z.string().min(1),
  address: z.string().optional(),
  location: z.string().optional(),
  google_maps_link: z.string().optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  property_stage: z.enum(["existing", "construction", "renovation"]).optional(),
  builder: z.string().optional(),
  architect: z.string().optional(),
  remarks: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!hasAnyRole(session?.user.role, CONTROL_ROLES)) {
      return apiError(session ? "FORBIDDEN" : "UNAUTHENTICATED", session ? "Forbidden." : "Authentication required.", session ? 403 : 401);
    }
    const body = await parseJson(request, siteVisitSchema);
    await connectDb();
    const lead = await Lead.findById(body.lead_id);
    if (!lead) return apiError("NOT_FOUND", "Lead not found.", 404);

    const siteVisit = await SiteVisit.create({
      lead_id: body.lead_id,
      assigned_sales_rep: lead.assigned_sales_rep,
      date: body.preferred_date || "TBD",
      time: body.preferred_time,
      location: body.location || body.address || lead.location || "Not captured",
      address: body.address,
      google_maps_link: body.google_maps_link,
      property_stage: body.property_stage,
      builder: body.builder,
      architect: body.architect,
      remarks: body.remarks,
      status: "Scheduled"
    });

    await Lead.updateOne({ _id: body.lead_id }, { status: "site_visit_requested", last_activity: new Date() });
    await recordTimeline({
      leadId: body.lead_id,
      siteVisitId: siteVisit._id.toString(),
      eventName: "site_visit_scheduled",
      title: "Site visit scheduled",
      metadata: body
    });
    await notifyRevenue({
      type: "site_visit_scheduled",
      leadId: body.lead_id,
      title: "Site visit scheduled",
      body: `${lead.name} requested a site visit.`,
      recipientRole: "sales",
      recipientId: lead.assigned_sales_rep
    });

    return apiOk({ siteVisit }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
