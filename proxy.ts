import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { homeFor, type Role } from "@/lib/user";

const studentAreas = ["/dashboard", "/tests", "/results"];
const facultyAreas = ["/faculty"];

function areaRole(pathname: string): Role | null {
  const under = (p: string) => pathname === p || pathname.startsWith(p + "/");
  if (studentAreas.some(under)) return "student";
  if (facultyAreas.some(under)) return "faculty";
  return null;
}

/**
 * Everything inside the platform needs a login, and each portal only opens for its own role.
 * The public site (/) and /login stay open.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/login") {
    return session ? NextResponse.redirect(new URL(homeFor[session.role], request.url)) : NextResponse.next();
  }

  const needed = areaRole(pathname);
  if (!needed) return NextResponse.next();

  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("as", needed);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (session.role !== needed) {
    return NextResponse.redirect(new URL(homeFor[session.role], request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/tests/:path*", "/results/:path*", "/faculty/:path*"],
};
