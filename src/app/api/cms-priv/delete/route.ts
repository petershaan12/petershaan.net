import { NextRequest, NextResponse } from "next/server";
import { connectDB, getDB } from "@/lib/mongodb";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-auth";
import { COLLECTION_MAP, SLUG_PREFIX, isCmsType, slugify } from "@/lib/cms";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!verifyAdminToken(token ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, slug } = await req.json();
  if (!isCmsType(type) || typeof slug !== "string" || !slugify(slug)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await connectDB();
  const db = getDB();
  const result = await db
    .collection(COLLECTION_MAP[type])
    .deleteOne({ slug: `${SLUG_PREFIX[type]}/${slugify(slug)}` });

  if (!result.deletedCount) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
