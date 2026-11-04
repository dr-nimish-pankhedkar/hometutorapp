import { createHmac, timingSafeEqual } from "node:crypto";
import type { Role } from "./user";

export const SESSION_COOKIE = "tutoriq_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Demo accounts: one student, one faculty member. Server-only — never shown in the public UI.
 * Passwords can be changed on Vercel with DEMO_STUDENT_PASSWORD / DEMO_FACULTY_PASSWORD.
 */
const accounts: { username: string; role: Role; password: () => string }[] = [
  { username: "aarav", role: "student", password: () => process.env.DEMO_STUDENT_PASSWORD || "tutoriq2026" },
  { username: "nimish", role: "faculty", password: () => process.env.DEMO_FACULTY_PASSWORD || "tutoriq2026" },
];

const secret = () => process.env.AUTH_SECRET || "tutoriq-demo-secret-change-me";

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Returns the account if username, password and the chosen portal all match. */
export function checkCredentials(username: string, password: string, role: Role) {
  const u = username.trim().toLowerCase();
  const acct = accounts.find((a) => a.username === u && a.role === role);
  if (!acct) return null;
  return safeEqual(password, acct.password()) ? { username: acct.username, role: acct.role } : null;
}

export interface Session {
  username: string;
  role: Role;
}

/** Token = username.role.expiry.signature */
export function createSessionToken(s: Session) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${s.username}.${s.role}.${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): Session | null {
  if (!token) return null;
  const [username, role, exp, sig] = token.split(".");
  if (!username || !exp || !sig || (role !== "student" && role !== "faculty")) return null;
  const expected = createHmac("sha256", secret()).update(`${username}.${role}.${exp}`).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  return { username, role };
}
