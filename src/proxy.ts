import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-auth";

// Real route folder is /cms-priv — PETER_ADMIN is the secret URL slug from env
const PETER_ADMIN = process.env.PETER_ADMIN ?? "";

function toCmsPath(pathname: string): string {
  return pathname
    .replace(new RegExp(`^/${PETER_ADMIN}(/|$)`), "/cms-priv$1")
    .replace(new RegExp(`^/api/${PETER_ADMIN}(/|$)`), "/api/cms-priv$1");
}

function rewrite(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = toCmsPath(url.pathname);
  return NextResponse.rewrite(url);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block direct access to /cms-priv pages — must go through secret path
  // Allow /api/cms-priv/auth so the login form can POST without knowing the secret path
  if (
    (pathname.startsWith("/cms-priv") || pathname.startsWith("/api/cms-priv")) &&
    !pathname.startsWith("/api/cms-priv/auth")
  ) {
    return new NextResponse(null, { status: 404 });
  }

  if (!PETER_ADMIN) return NextResponse.next();

  const isAdmin =
    pathname.startsWith(`/${PETER_ADMIN}`) ||
    pathname.startsWith(`/api/${PETER_ADMIN}`);

  if (!isAdmin) return NextResponse.next();

  // Login page and auth API: just rewrite, no cookie needed
  if (
    pathname === `/${PETER_ADMIN}/login` ||
    pathname.startsWith(`/api/${PETER_ADMIN}/auth`)
  ) {
    return rewrite(req);
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!verifyAdminToken(token ?? "")) {
    const loginUrl = new URL(`/${PETER_ADMIN}/login`, req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return rewrite(req);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
