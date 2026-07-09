import { NextRequest } from "next/server";
import { apiOk, handleApiError, apiError } from "@/lib/errors/api";
import { issueOtp } from "@/lib/auth/otp";
import { parseJson, z } from "@/lib/validation";
import { logger } from "@/lib/logger";

const otpRequestSchema = z.object({
  phone: z.string().min(7).max(20)
});

export async function POST(request: NextRequest) {
  try {
    const { phone } = await parseJson(request, otpRequestSchema);
    const otp = issueOtp(phone);

    if (process.env.NODE_ENV === "production" && !process.env.AUTH_OTP_PROVIDER) {
      logger.security("OTP requested without production OTP provider", { phone: otp.phone });
      return apiError("SERVER_ERROR", "OTP provider is not configured.", 501);
    }

    logger.info("OTP issued", {
      phone: otp.phone,
      devCode: process.env.NODE_ENV === "production" ? undefined : otp.code
    });

    return apiOk({
      phone: otp.phone,
      otpSent: true,
      expiresAt: otp.expiresAt,
      devCode: process.env.NODE_ENV === "production" ? undefined : otp.code
    });
  } catch (error) {
    return handleApiError(error);
  }
}
