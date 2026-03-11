import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Message } from "@/lib/models/Message";

export async function GET(request: NextRequest) {
  try {
    const lead_id = request.nextUrl.searchParams.get("lead_id");
    if (!lead_id) {
      return NextResponse.json({ error: "lead_id is required" }, { status: 400 });
    }
    await connectDb();
    const messages = await Message.find({ lead_id }).sort({ timestamp: 1 }).limit(200);
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

