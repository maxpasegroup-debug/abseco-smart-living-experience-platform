import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { CommerceSettings } from "@/lib/models/CommerceSettings";
import { getBookingSettings } from "@/lib/services/commerce-engine";

const settingsSchema = z.object({
  booking_mode: z.enum(["fixed", "percentage"]),
  booking_value: z.number().min(0),
  gst_percentage: z.number().min(0).max(100).optional(),
  coupons_enabled: z.boolean().optional(),
  discounts_enabled: z.boolean().optional()
});

export async function GET() {
  try {
    await connectDb();
    const settings = await getBookingSettings();
    return apiOk({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!hasAnyRole(session?.user.role, CONTROL_ROLES)) {
      return apiError(session ? "FORBIDDEN" : "UNAUTHENTICATED", session ? "Forbidden." : "Authentication required.", session ? 403 : 401);
    }
    const body = await parseJson(request, settingsSchema);
    await connectDb();
    const settings = await CommerceSettings.findOneAndUpdate(
      { key: "default" },
      { $set: { ...body, active_provider: "razorpay" } },
      { upsert: true, new: true }
    );
    return apiOk({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}
