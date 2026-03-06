import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Lead } from "@/lib/models/Lead";

export async function GET() {
  try {
    await connectDb();
    const leads = await Lead.find().sort({ created_at: -1 }).limit(50);
    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads", details: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    await connectDb();
    const lead = await Lead.create(payload);
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead", details: String(error) }, { status: 500 });
  }
}
