import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Ambassador } from "@/lib/models/Ambassador";
import { AmbassadorVisit } from "@/lib/models/AmbassadorVisit";
import { Lead } from "@/lib/models/Lead";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDb();
    const amb = await Ambassador.findOne({ showcase_slug: params.slug });
    if (!amb) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const lead = await Lead.findById(amb.lead_id);
    // log visit
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.ip ||
      request.headers.get("x-real-ip") ||
      "";
    await AmbassadorVisit.create({
      ambassador_id: amb._id.toString(),
      visitor_ip: ip,
      user_agent: request.headers.get("user-agent") || ""
    });
    await Ambassador.updateOne(
      { _id: amb._id },
      { $inc: { total_visits: 1 } }
    );
    return NextResponse.json({ ambassador: amb, lead });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

