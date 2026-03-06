import { NextRequest, NextResponse } from "next/server";

// Placeholder verification endpoint for progressive auth integration.
export async function POST(request: NextRequest) {
  const { phone, otp } = await request.json();
  if (!phone || !otp) {
    return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    token: "demo-token-replace-with-jwt",
    user: { phone, role: "customer" }
  });
}
