import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, CONTROL_ROLES, CUSTOMER_ROLES, hasAnyRole, type UserRole } from "@/lib/auth/roles";
import { getSessionFromRequest, maybeRefreshSession } from "@/lib/auth/session";
import { applySecurityHeaders } from "@/lib/security/headers";
import { rateLimit } from "@/lib/security/rate-limit";

const PROTECTED_PREFIXES = ["/admin", "/control"];
const PUBLIC_API_PREFIXES = [
  "/api/auth",
  "/api/admin/login",
  "/api/journey/event",
  "/api/partner",
  "/api/ambassadors"
];

const PROTECTED_API_RULES: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: "/api/admin", roles: ADMIN_ROLES },
  { prefix: "/api/whatsapp", roles: CONTROL_ROLES },
  { prefix: "/api/messages", roles: CONTROL_ROLES },
  { prefix: "/api/planner", roles: CUSTOMER_ROLES },
  { prefix: "/api/revenue", roles: CUSTOMER_ROLES },
  { prefix: "/api/commerce", roles: CUSTOMER_ROLES },
  { prefix: "/api/customer", roles: CUSTOMER_ROLES },
  { prefix: "/api/projects", roles: CONTROL_ROLES },
  { prefix: "/api/leads", roles: CONTROL_ROLES },
  { prefix: "/api/consultations", roles: CONTROL_ROLES },
  { prefix: "/api/contacts", roles: CONTROL_ROLES },
  { prefix: "/api/templates", roles: CONTROL_ROLES },
  { prefix: "/api/proposals", roles: CONTROL_ROLES },
  { prefix: "/api/journey", roles: CONTROL_ROLES }
];

function isPublicApi(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/api/whatsapp/webhook") return true;
  if (pathname === "/api/leads" && request.method === "POST") return true;
  if (pathname === "/api/consultations" && request.method === "POST") return true;
  if (pathname === "/api/commerce/checkout") return true;
  if (pathname === "/api/commerce/payments/verify") return true;
  if (pathname === "/api/commerce/payments/failure") return true;
  if (pathname === "/api/commerce/payments/webhook") return true;
  if (pathname.startsWith("/api/proposals/") && pathname.endsWith("/activity") && request.method === "POST") return true;
  if (pathname.startsWith("/api/proposals/") && request.method === "GET") return true;
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getRateLimitKey(pathname: string) {
  if (pathname.startsWith("/api/auth") || pathname === "/api/admin/login") {
    return { key: "auth", limit: 10, windowMs: 60 * 1000 };
  }
  if (pathname === "/api/leads" || pathname === "/api/consultations" || pathname.startsWith("/api/revenue")) {
    return { key: pathname, limit: 20, windowMs: 60 * 1000 };
  }
  if (pathname.startsWith("/api/whatsapp")) {
    return { key: "whatsapp", limit: 60, windowMs: 60 * 1000 };
  }
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/proposals") || pathname.startsWith("/api/projects")) {
    return { key: pathname, limit: 120, windowMs: 60 * 1000 };
  }
  return { key: "public", limit: 180, windowMs: 60 * 1000 };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const limit = rateLimit(request, getRateLimitKey(pathname));
  if (!limit.allowed) {
    return applySecurityHeaders(
      NextResponse.json(
        { ok: false, error: { code: "RATE_LIMITED", message: "Too many requests." } },
        { status: 429 }
      )
    );
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isLogin = pathname.startsWith("/admin/login");
  const session = await getSessionFromRequest(request);

  if (pathname.startsWith("/api/")) {
    if (!isPublicApi(request)) {
      const rule = PROTECTED_API_RULES.find((item) => pathname.startsWith(item.prefix));
      if (rule && !hasAnyRole(session?.user.role, rule.roles)) {
        return applySecurityHeaders(
          NextResponse.json(
            {
              ok: false,
              error: {
                code: session ? "FORBIDDEN" : "UNAUTHENTICATED",
                message: session ? "You do not have permission to perform this action." : "Authentication required."
              }
            },
            { status: session ? 403 : 401 }
          )
        );
      }
    }
    const response = NextResponse.next();
    await maybeRefreshSession(request, response, session);
    return applySecurityHeaders(response);
  }

  if (!isProtected || isLogin) {
    const response = NextResponse.next();
    await maybeRefreshSession(request, response, session);
    return applySecurityHeaders(response);
  }

  const allowedRoles = pathname.startsWith("/admin") ? ADMIN_ROLES : CONTROL_ROLES;
  if (!hasAnyRole(session?.user.role, allowedRoles)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  const response = NextResponse.next();
  await maybeRefreshSession(request, response, session);
  return applySecurityHeaders(response);
}

export const config = {
  matcher: ["/admin/:path*", "/control/:path*", "/api/:path*", "/((?!_next/static|_next/image|favicon.ico|icons).*)"]
};

