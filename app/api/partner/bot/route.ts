import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const partnerSlug = body.partner_slug || "partnername";
  const message = String(body.message || "").toUpperCase().trim();

  if (message === "NEW LEAD") {
    return NextResponse.json({
      bot: "RIO",
      reply: `Share this link with customer: abseco.ai/r/${partnerSlug}`
    });
  }

  return NextResponse.json({
    bot: "RIO",
    reply: "Send NEW LEAD to get your referral link."
  });
}
