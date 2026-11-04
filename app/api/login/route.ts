import { NextResponse } from "next/server";
import { checkCredentials, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { homeFor } from "@/lib/user";

export async function POST(req: Request) {
  let body: { username?: unknown; password?: unknown; role?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role === "faculty" ? "faculty" : "student";

  const session = checkCredentials(username, password, role);
  if (!session) {
    return NextResponse.json(
      { error: `That ${role} username and password don't match. Check you've picked the right login.` },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true, home: homeFor[session.role] });
  res.cookies.set(SESSION_COOKIE, createSessionToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
