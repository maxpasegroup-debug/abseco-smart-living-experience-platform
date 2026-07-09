import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Consultation } from "@/lib/models/Consultation";
import { Lead } from "@/lib/models/Lead";
import { SiteVisit } from "@/lib/models/SiteVisit";
import { queueMessage } from "@/lib/services/whatsapp-engine";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth/session";
import { notifyRevenue, recordTimeline } from "@/lib/services/revenue-engine";

const consultationSchema = z.object({
  lead_id: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  property_type: z.string().optional(),
  construction_stage: z.string().optional(),
  consultation_type: z.enum(["online", "video", "phone", "whatsapp", "showroom_visit", "site_visit"]).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  remarks: z.string().optional(),
  address: z.string().optional(),
  google_maps_link: z.string().optional(),
  property_stage: z.enum(["existing", "construction", "renovation"]).optional(),
  builder: z.string().optional(),
  architect: z.string().optional()
});

export async function GET() {
  try {
    await connectDb();
    const consultations = await Consultation.find().sort({ date: 1, time: 1 }).limit(200);
    return apiOk({ consultations });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, consultationSchema);
    const {
      lead_id,
      name,
      phone,
      city,
      property_type,
      construction_stage,
      consultation_type,
      date,
      time,
      remarks,
      address,
      google_maps_link,
      property_stage,
      builder,
      architect
    } = body;

    await connectDb();

    let leadId = lead_id;
    if (!leadId && phone) {
      const existing = await Lead.findOne({ phone }).sort({ created_at: -1 });
      if (existing) {
        leadId = existing._id.toString();
      } else {
        const created = await Lead.create({
          name: name || "Consultation Lead",
          phone,
          location: city || "",
          home_type: property_type || "Consultation",
          budget: "TBD",
          interest_level: "warm",
          referral_source: "consultation-page"
        });
        leadId = created._id.toString();
      }
    }

    if (!leadId) {
      return apiError("BAD_REQUEST", "lead_id or phone is required.", 400);
    }

    const consultation = await Consultation.create({
      lead_id: leadId,
      consultation_type: consultation_type || "online",
      date: date || "TBD",
      time: time || "TBD",
      city,
      property_type,
      construction_stage,
      preferred_date: date,
      preferred_time: time,
      remarks,
      booking_status: "pending",
      status: "Scheduled"
    } as never);

    let siteVisit = null;
    if (consultation_type === "site_visit") {
      const lead = await Lead.findById(leadId);
      siteVisit = await SiteVisit.create({
        lead_id: leadId,
        consultation_id: consultation._id.toString(),
        assigned_sales_rep: lead?.assigned_sales_rep,
        date: date || "TBD",
        time,
        location: city || address || "Not captured",
        address,
        google_maps_link,
        property_stage,
        builder,
        architect,
        remarks,
        status: "Scheduled"
      });
      await Lead.updateOne({ _id: leadId }, { status: "site_visit_requested", last_activity: new Date() });
      await recordTimeline({
        leadId,
        consultationId: consultation._id.toString(),
        siteVisitId: siteVisit._id.toString(),
        eventName: "site_visit_scheduled",
        title: "Site visit scheduled",
        metadata: { date, time, city, property_stage }
      });
      await notifyRevenue({
        type: "site_visit_scheduled",
        leadId,
        title: "Site visit scheduled",
        body: `${lead?.name || "Customer"} requested a site visit.`,
        recipientRole: "sales",
        recipientId: lead?.assigned_sales_rep
      });
    } else {
      await Lead.updateOne({ _id: leadId }, { status: "consultation_booked", last_activity: new Date() });
      await recordTimeline({
        leadId,
        consultationId: consultation._id.toString(),
        eventName: "consultation_booked",
        title: "Consultation booked",
        metadata: { consultation_type: consultation_type || "online", date, time, city }
      });
      await notifyRevenue({
        type: "consultation_request",
        leadId,
        title: "Consultation booked",
        body: `${name || "Customer"} booked a ${consultation_type || "online"} consultation.`,
        recipientRole: "sales"
      });
    }

    if (phone) {
      const msg =
        "Your ABSECO smart home consultation has been scheduled.\n\n" +
        `Date: ${date || "TBD"}, Time: ${time || "TBD"}. Our representative will contact you.`;
      await queueMessage({ to: phone, message: msg, lead_id: leadId });
    }

    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "consultation_update",
      target_type: "consultation",
      target_id: consultation._id.toString(),
      metadata: { event: "created", lead_id: leadId }
    });
    return apiOk({ consultation, siteVisit: siteVisit || undefined }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

