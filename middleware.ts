import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/control"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isLogin = pathname.startsWith("/admin/login");

  if (!isProtected || isLogin) {
    return NextResponse.next();
  }

  const isAdmin = request.cookies.get("abseco_admin")?.value === "1";
  if (!isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/control/:path*"]
};

