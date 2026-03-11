import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { JourneyEvent } from "@/lib/models/JourneyEvent";
import { Lead } from "@/lib/models/Lead";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, event_name, metadata } = body;
    if (!event_name) {
      return NextResponse.json({ error: "event_name is required" }, { status: 400 });
    }

    await connectDb();
    await JourneyEvent.create({
      lead_id,
      event_name,
      metadata,
      timestamp: new Date()
    });

    if (lead_id) {
      await Lead.updateOne(
        { _id: lead_id },
        {
          $set: { last_activity: new Date() },
          $push: {
            engagement_events: {
              type: event_name,
              metadata,
              created_at: new Date()
            }
          }
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

