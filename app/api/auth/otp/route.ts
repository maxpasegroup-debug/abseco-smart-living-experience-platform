import { NextRequest, NextResponse } from "next/server";

// Temporary OTP stub. Replace with SMS gateway provider.
export async function POST(request: NextRequest) {
  const { phone } = await request.json();
  if (!phone) {
    return NextResponse.json({ error: "Phone is required" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    phone,
    otpSent: true,
    message: "OTP flow initialized."
  });
}
