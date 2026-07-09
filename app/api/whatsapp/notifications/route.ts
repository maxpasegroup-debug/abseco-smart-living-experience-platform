import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { SalesNotification } from "@/lib/models/SalesNotification";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth/session";

const notificationPatchSchema = z.object({
  id: z.string().min(1),
  read: z.boolean().optional()
});

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const unreadOnly = request.nextUrl.searchParams.get("unread") === "true";
    const query = unreadOnly ? { read: false } : {};
    const notifications = await SalesNotification.find(query).sort({ created_at: -1 }).limit(50);
    return apiOk({ notifications });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await parseJson(request, notificationPatchSchema);
    const { id, read } = body;
    await connectDb();
    await SalesNotification.updateOne({ _id: id }, { read: read !== false });
    await writeAuditLog({
      request,
      session: await getSessionFromRequest(request),
      action: "customer_change",
      target_type: "sales_notification",
      target_id: id,
      metadata: { event: "notification_updated", read: read !== false }
    });
    return apiOk({});
  } catch (e) {
    return handleApiError(e);
  }
}
