import { NextRequest } from "next/server";
import { clearSessionCookie, getSessionFromRequest } from "@/lib/auth/session";
import { apiOk, handleApiError } from "@/lib/errors/api";
import { writeAuditLog } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    const response = apiOk({ loggedOut: true });
    clearSessionCookie(response);
    if (session?.user.role === "admin" || session?.user.role === "super_admin") {
      await writeAuditLog({
        request,
        session,
        action: "admin_logout",
        target_type: "user",
        target_id: session.user.id
      });
    }
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
