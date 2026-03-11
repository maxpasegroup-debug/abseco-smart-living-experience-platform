import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Campaign } from "@/lib/models/Campaign";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, message, media, segment, send_time, status } = body;
    await connectDb();
    const update: Record<string, unknown> = {};
    if (title !== undefined) update.title = title;
    if (message !== undefined) update.message = message;
    if (media !== undefined) update.media = media;
    if (segment !== undefined) update.segment = segment;
    if (send_time !== undefined) update.send_time = new Date(send_time);
    if (status !== undefined) update.status = status;
    const campaign = await Campaign.findByIdAndUpdate(params.id, { $set: update }, { new: true });
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    return NextResponse.json({ campaign });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
