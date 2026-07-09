import { NextRequest } from "next/server";
import { getAdminCredentials } from "@/lib/env";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { apiError, apiOk, handleApiError } from "@/lib/errors/api";
import { parseJson, z } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await parseJson(request, loginSchema);
    const credentials = getAdminCredentials();

    if (!credentials) {
      logger.security("Admin login attempted without configured credentials", { email });
      return apiError("SERVER_ERROR", "Admin authentication is not configured.", 500);
    }

    if (email !== credentials.email || password !== credentials.password) {
      logger.security("Invalid admin login", { email });
      return apiError("UNAUTHENTICATED", "Invalid credentials.", 401);
    }

    const session = await createSession({
      id: `admin:${credentials.email}`,
      email: credentials.email,
      role: credentials.role
    });
    const response = apiOk({ user: session.user });
    await setSessionCookie(response, session);
    await writeAuditLog({
      request,
      session,
      action: "admin_login",
      target_type: "user",
      target_id: session.user.id
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

