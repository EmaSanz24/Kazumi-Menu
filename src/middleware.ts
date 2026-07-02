import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  isAuthenticatedRequest,
  verifyAuthToken,
} from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/upload")) {
    const authenticated = await isAuthenticatedRequest(request);
    if (!authenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const response = NextResponse.next();

    if (token && !(await verifyAuthToken(token))) {
      response.cookies.set(AUTH_COOKIE_NAME, "", { ...getAuthCookieOptions(0), maxAge: 0 });
    }

    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload"],
};
