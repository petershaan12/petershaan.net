import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, COOKIE_NAME, COOKIE_MAX_AGE, checkRateLimit, resetRateLimit } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${retryAfterSeconds} seconds.` },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const { password } = await req.json();

  if (!process.env.PETER_KEY || password !== process.env.PETER_KEY) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  resetRateLimit(ip);

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
