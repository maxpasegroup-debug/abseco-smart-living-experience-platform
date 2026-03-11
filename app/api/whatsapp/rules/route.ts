import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { AutomationRule } from "@/lib/models/AutomationRule";

export async function GET() {
  try {
    await connectDb();
    const rules = await AutomationRule.find().sort({ createdAt: -1 });
    return NextResponse.json({ rules });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, trigger, condition, action, action_payload, delay_minutes, enabled } = body;
    if (!name || !trigger || !action) {
      return NextResponse.json({ error: "name, trigger, action required" }, { status: 400 });
    }
    await connectDb();
    const rule = await AutomationRule.create({
      name,
      trigger,
      condition: condition || undefined,
      action,
      action_payload: action_payload || undefined,
      delay_minutes: delay_minutes ?? 0,
      enabled: enabled !== false
    });
    return NextResponse.json({ rule }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
