import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Message } from "@/lib/models/Message";

export async function GET(request: NextRequest) {
  try {
    const lead_id = request.nextUrl.searchParams.get("lead_id");
    if (!lead_id) {
      return NextResponse.json({ error: "lead_id required" }, { status: 400 });
    }
    await connectDb();
    const messages = await Message.find({ lead_id }).sort({ timestamp: 1 });
    return NextResponse.json({ messages });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
