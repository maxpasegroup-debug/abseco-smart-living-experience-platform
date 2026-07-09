import { NextRequest } from "next/server";
import { CONTROL_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { getSessionFromRequest } from "@/lib/auth/session";
import { connectDb } from "@/lib/db/connect";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { buildCustomerDashboard } from "@/lib/services/customer-dashboard";

function getCustomerHealth(dashboard: Awaited<ReturnType<typeof buildCustomerDashboard>>) {
  if (dashboard.paymentStatus === "paid") return "healthy";
  if (dashboard.orderStatus === "payment_failed") return "attention";
  if (dashboard.proposalStatus === "revision_requested") return "needs_follow_up";
  return "active";
}

export async function GET(request: NextRequest, { params }: { params: { customerId: string } }) {
  try {
    const session = await getSessionFromRequest(request);
    if (!hasAnyRole(session?.user.role, CONTROL_ROLES)) {
      return apiError(session ? "FORBIDDEN" : "UNAUTHENTICATED", session ? "Forbidden." : "Authentication required.", session ? 403 : 401);
    }
    await connectDb();
    const dashboard = await buildCustomerDashboard({
      sid: `admin-view-${params.customerId}`,
      user: { id: params.customerId, role: "customer" },
      issuedAt: Date.now(),
      expiresAt: Date.now()
    });
    return apiOk({ dashboard, customerHealth: getCustomerHealth(dashboard), notes: [] });
  } catch (error) {
    return handleApiError(error);
  }
}
