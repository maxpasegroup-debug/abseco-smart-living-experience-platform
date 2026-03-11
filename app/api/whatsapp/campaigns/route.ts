import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Campaign } from "@/lib/models/Campaign";

export async function GET() {
  try {
    await connectDb();
    const campaigns = await Campaign.find().sort({ created_at: -1 }).limit(50);
    return NextResponse.json({ campaigns });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, media, segment, send_time, status } = body;
    if (!title || !message) {
      return NextResponse.json({ error: "title and message required" }, { status: 400 });
    }
    await connectDb();
    const campaign = await Campaign.create({
      title,
      message,
      media: media || undefined,
      segment: segment || "all_leads",
      send_time: send_time ? new Date(send_time) : undefined,
      status: status || "draft"
    });
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
