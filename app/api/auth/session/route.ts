import { NextRequest } from "next/server";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { getSessionFromRequest, setSessionCookie } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    return apiOk({ user: session.user, expiresAt: session.expiresAt });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return apiError("UNAUTHENTICATED", "Authentication required.", 401);
    const refreshed = { ...session, issuedAt: Date.now(), expiresAt: Date.now() + 1000 * 60 * 60 * 8 };
    const response = apiOk({ user: refreshed.user, expiresAt: refreshed.expiresAt });
    await setSessionCookie(response, refreshed);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
