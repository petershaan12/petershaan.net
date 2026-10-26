import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!verifyAdminToken(token ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await put(`content/${Date.now()}-${safeName}`, file, {
    access: "public",
    token: process.env.PETER_READ_WRITE_TOKEN,
  });

  return NextResponse.json({ url: blob.url });
}
