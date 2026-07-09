import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { connectDb } from "@/lib/db/connect";
import { JourneyEvent } from "@/lib/models/JourneyEvent";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";

const analyticsSchema = z.object({
  event_name: z.enum([
    "dashboard_visit",
    "proposal_view",
    "invoice_download",
    "payment_click",
    "document_download",
    "consultation_request",
    "support_request"
  ]),
  metadata: z.record(z.unknown()).optional()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    const body = await parseJson(request, analyticsSchema);
    await connectDb();
    await JourneyEvent.create({
      lead_id: session.user.id,
      event_name: body.event_name,
      metadata: { ...(body.metadata || {}), customer_id: session.user.id },
      timestamp: new Date()
    });
    return apiOk({});
  } catch (error) {
    return handleApiError(error);
  }
}
