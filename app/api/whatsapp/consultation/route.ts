import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { ConsultationRequest } from "@/lib/models/ConsultationRequest";
import { createConsultationRequest } from "@/lib/services/whatsapp-engine";

export async function GET() {
  try {
    await connectDb();
    const requests = await ConsultationRequest.find().sort({ created_at: -1 }).limit(100);
    return NextResponse.json({ requests });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, phone, name, city, property_type, construction_stage } = body;
    if (!lead_id || !phone || !city || !property_type || !construction_stage) {
      return NextResponse.json({ error: "lead_id, phone, city, property_type, construction_stage required" }, { status: 400 });
    }
    await createConsultationRequest({
      lead_id,
      phone,
      name,
      city,
      property_type,
      construction_stage
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
