import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { connectDb } from "@/lib/db/connect";
import { CustomerProfile } from "@/lib/models/CustomerProfile";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { getOrCreateCustomerProfile } from "@/lib/services/customer-dashboard";

const profileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  preferred_language: z.string().optional(),
  communication_preferences: z
    .object({
      whatsapp: z.boolean().optional(),
      email: z.boolean().optional(),
      phone: z.boolean().optional()
    })
    .optional(),
  saved_homes: z
    .array(z.object({ label: z.string(), home_type: z.string().optional(), address: z.string().optional() }))
    .optional(),
  family_members: z
    .array(z.object({ name: z.string().optional(), relationship: z.string().optional(), phone: z.string().optional() }))
    .optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    await connectDb();
    const profile = await getOrCreateCustomerProfile(session);
    return apiOk({ profile });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    const body = await parseJson(request, profileSchema);
    await connectDb();
    const profile = await CustomerProfile.findOneAndUpdate(
      { customer_id: session.user.id },
      { $set: body, $setOnInsert: { customer_id: session.user.id } },
      { upsert: true, new: true }
    );
    return apiOk({ profile });
  } catch (error) {
    return handleApiError(error);
  }
}
