import { NextRequest } from "next/server";
import { ApiError } from "@/lib/errors/api";
import { getSessionFromRequest } from "@/lib/auth/session";
import { hasAnyRole, type UserRole } from "@/lib/auth/roles";

export async function requireSession(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new ApiError("UNAUTHENTICATED", "Authentication required.", 401);
  }
  return session;
}

export async function requireRole(request: NextRequest, roles: readonly UserRole[]) {
  const session = await requireSession(request);
  if (!hasAnyRole(session.user.role, roles)) {
    throw new ApiError("FORBIDDEN", "You do not have permission to perform this action.", 403);
  }
  return session;
}
