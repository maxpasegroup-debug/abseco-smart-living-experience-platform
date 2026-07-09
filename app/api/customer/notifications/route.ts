import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { connectDb } from "@/lib/db/connect";
import { SalesNotification } from "@/lib/models/SalesNotification";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { getCustomerLeadIds } from "@/lib/services/customer-dashboard";

const notificationSchema = z.object({
  id: z.string().min(1),
  read: z.boolean().optional(),
  archived: z.boolean().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    await connectDb();
    const leadIds = await getCustomerLeadIds(session);
    const unreadOnly = request.nextUrl.searchParams.get("unread") === "true";
    const notifications = await SalesNotification.find({
      recipient_role: "customer",
      $or: [{ recipient_id: session.user.id }, { lead_id: { $in: leadIds } }],
      archived: { $ne: true },
      ...(unreadOnly ? { read: false } : {})
    })
      .sort({ created_at: -1 })
      .limit(100);
    return apiOk({ notifications, unreadCount: notifications.filter((notification) => !notification.read).length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    const body = await parseJson(request, notificationSchema);
    await connectDb();
    const leadIds = await getCustomerLeadIds(session);
    const notification = await SalesNotification.findOne({
      _id: body.id,
      recipient_role: "customer",
      $or: [{ recipient_id: session.user.id }, { lead_id: { $in: leadIds } }]
    });
    if (!notification) return apiError("NOT_FOUND", "Notification not found.", 404);
    if (typeof body.read === "boolean") notification.read = body.read;
    if (typeof body.archived === "boolean") notification.archived = body.archived;
    await notification.save();
    return apiOk({ notification });
  } catch (error) {
    return handleApiError(error);
  }
}
