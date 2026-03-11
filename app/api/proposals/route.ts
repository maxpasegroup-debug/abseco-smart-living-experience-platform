import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Proposal } from "@/lib/models/Proposal";

export async function GET() {
  try {
    await connectDb();
    const proposals = await Proposal.find().sort({ created_at: -1 }).limit(100);
    return NextResponse.json({ proposals });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lead_id,
      property_type,
      rooms = [],
      automation_categories = [],
      estimated_cost_min,
      estimated_cost_max,
      currency
    } = body;
    if (!lead_id || !property_type) {
      return NextResponse.json({ error: "lead_id and property_type are required" }, { status: 400 });
    }
    await connectDb();
    const slug = `${lead_id.slice(-6)}-${Date.now().toString(36)}`;
    const proposal = await Proposal.create({
      lead_id,
      property_type,
      rooms,
      automation_categories,
      estimated_cost_min,
      estimated_cost_max,
      currency: currency || "INR",
      proposal_url_slug: slug
    });
    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

