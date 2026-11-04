import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/** Student area is login-only; the login page bounces signed-in students to their dashboard. */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const user = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/login") {
    return user ? NextResponse.redirect(new URL("/dashboard", request.url)) : NextResponse.next();
  }
  if (!user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/tests/:path*", "/results/:path*"],
};
