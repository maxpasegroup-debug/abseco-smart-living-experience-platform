import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { MessageQueue } from "@/lib/models/MessageQueue";

export async function GET() {
  try {
    await connectDb();
    const pending = await MessageQueue.countDocuments({ status: "pending" });
    return NextResponse.json({ pending });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
