import { createHmac, timingSafeEqual } from "node:crypto";
import { demoCredentials } from "./user";

export const SESSION_COOKIE = "tutoriq_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Demo platform: one hard-coded student. AUTH_SECRET can be set on Vercel to rotate sessions.
const secret = () => process.env.AUTH_SECRET || "tutoriq-demo-secret-change-me";

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkCredentials(username: string, password: string) {
  return (
    safeEqual(username.trim().toLowerCase(), demoCredentials.username) &&
    safeEqual(password, demoCredentials.password)
  );
}

/** Token = username.expiry.signature */
export function createSessionToken(username: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${username}.${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [username, exp, sig] = token.split(".");
  if (!username || !exp || !sig) return null;
  const expected = createHmac("sha256", secret()).update(`${username}.${exp}`).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  return username;
}
