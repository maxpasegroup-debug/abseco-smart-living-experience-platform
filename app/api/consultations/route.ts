import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Consultation } from "@/lib/models/Consultation";
import { Lead } from "@/lib/models/Lead";
import { queueMessage } from "@/lib/services/whatsapp-engine";

export async function GET() {
  try {
    await connectDb();
    const consultations = await Consultation.find().sort({ date: 1, time: 1 }).limit(200);
    return NextResponse.json({ consultations });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lead_id,
      name,
      phone,
      city,
      property_type,
      construction_stage,
      consultation_type,
      date,
      time
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
      return NextResponse.json({ error: "lead_id or phone is required" }, { status: 400 });
    }

    const consultation = await Consultation.create({
      lead_id: leadId,
      consultation_type: consultation_type === "site_visit" ? "site_visit" : "online",
      date,
      time,
      city,
      property_type,
      construction_stage,
      status: "Scheduled"
    } as never);

    if (phone) {
      const msg =
        "Your ABSECO smart home consultation has been scheduled.\n\n" +
        `Date: ${date || "TBD"}, Time: ${time || "TBD"}. Our representative will contact you.`;
      await queueMessage({ to: phone, message: msg, lead_id: leadId });
    }

    return NextResponse.json({ consultation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

