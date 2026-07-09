import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { connectDb } from "@/lib/db/connect";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { buildCustomerDashboard } from "@/lib/services/customer-dashboard";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    await connectDb();
    const dashboard = await buildCustomerDashboard(session);
    return apiOk({ dashboard });
  } catch (error) {
    return handleApiError(error);
  }
}
