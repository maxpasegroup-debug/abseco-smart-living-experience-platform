import { NextRequest } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { verifyOtp } from "@/lib/auth/otp";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";

const otpVerifySchema = z.object({
  phone: z.string().min(7).max(20),
  otp: z.string().min(4).max(8)
});

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await parseJson(request, otpVerifySchema);
    if (!verifyOtp(phone, otp)) {
      return apiError("UNAUTHENTICATED", "Invalid or expired OTP.", 401);
    }

    const normalizedPhone = phone.replace(/\D/g, "");
    const session = await createSession({
      id: `customer:${normalizedPhone}`,
      phone: normalizedPhone,
      role: "customer"
    });
    const response = apiOk({ user: session.user });
    await setSessionCookie(response, session);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
