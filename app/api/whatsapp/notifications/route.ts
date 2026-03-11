import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { SalesNotification } from "@/lib/models/SalesNotification";

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const unreadOnly = request.nextUrl.searchParams.get("unread") === "true";
    const query = unreadOnly ? { read: false } : {};
    const notifications = await SalesNotification.find(query).sort({ created_at: -1 }).limit(50);
    return NextResponse.json({ notifications });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await connectDb();
    await SalesNotification.updateOne({ _id: id }, { read: read !== false });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
