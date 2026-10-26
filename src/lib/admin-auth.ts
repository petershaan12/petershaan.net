import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.PETER_KEY ?? "";

export function createAdminToken(): string {
  return createHmac("sha256", SECRET).update("admin-session").digest("hex");
}

export function verifyAdminToken(token: string): boolean {
  if (!SECRET || !token) return false;
  const expected = createHmac("sha256", SECRET).update("admin-session").digest("hex");
  try {
    return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export const COOKIE_NAME = "admin_token";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// In-memory brute force protection (resets on cold start, sufficient for single-admin use)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}
