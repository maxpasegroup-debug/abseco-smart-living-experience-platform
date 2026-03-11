import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { AutomationRule } from "@/lib/models/AutomationRule";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, trigger, condition, action, action_payload, delay_minutes, enabled } = body;
    await connectDb();
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (trigger !== undefined) update.trigger = trigger;
    if (condition !== undefined) update.condition = condition;
    if (action !== undefined) update.action = action;
    if (action_payload !== undefined) update.action_payload = action_payload;
    if (delay_minutes !== undefined) update.delay_minutes = delay_minutes;
    if (enabled !== undefined) update.enabled = enabled;
    const rule = await AutomationRule.findByIdAndUpdate(params.id, { $set: update }, { new: true });
    if (!rule) return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    return NextResponse.json({ rule });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
