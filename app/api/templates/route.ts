import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Template } from "@/lib/models/Template";

export async function GET() {
  try {
    await connectDb();
    const templates = await Template.find().sort({ created_at: -1 });
    return NextResponse.json({ templates });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel = "whatsapp", name, title, body: messageBody, media_url, category } = body;
    if (!name || !title || !messageBody) {
      return NextResponse.json({ error: "name, title, body are required" }, { status: 400 });
    }
    await connectDb();
    const template = await Template.create({
      channel,
      name,
      title,
      body: messageBody,
      media_url,
      category
    });
    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

