import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    referralLink: "abseco.ai/r/partnername",
    leadsGenerated: 48,
    conversions: 16,
    commissionEarned: 37500
  });
}
