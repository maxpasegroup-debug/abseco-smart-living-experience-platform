import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { partner: string } }) {
  const referral = params.partner;
  const redirectUrl = new URL(`/?ref=${encodeURIComponent(referral)}`, request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("abseco_referral_source", referral, { maxAge: 60 * 60 * 24 * 45, path: "/" });
  response.cookies.set("abseco_partner_id", referral.toUpperCase(), { maxAge: 60 * 60 * 24 * 45, path: "/" });
  return response;
}
