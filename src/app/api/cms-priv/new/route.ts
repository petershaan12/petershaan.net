import { NextRequest, NextResponse } from "next/server";
import { connectDB, getDB } from "@/lib/mongodb";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-auth";
import { COLLECTION_MAP, SLUG_PREFIX, isCmsType, slugify } from "@/lib/cms";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!verifyAdminToken(token ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, title, slug } = await req.json();
  if (!isCmsType(type) || !title?.trim()) {
    return NextResponse.json({ error: "Invalid type or title" }, { status: 400 });
  }
  const collectionName = COLLECTION_MAP[type];

  const normalizedSlug = slugify(typeof slug === "string" && slug.trim() ? slug : title);
  if (!normalizedSlug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  const fullSlug = `${SLUG_PREFIX[type]}/${normalizedSlug}`;

  await connectDB();
  const db = getDB();
  const existing = await db.collection(collectionName).findOne({ slug: fullSlug });
  if (existing) {
    return NextResponse.json({ error: "Already exists" }, { status: 409 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const body_source = `---\ntitle: ${title}\ndescription:\ndate: ${today}\ntags: ["tips"]\npublished: false\n---\n\nWrite your content here.\n`;
  const now = new Date();

  await db.collection(collectionName).insertOne({
    slug: fullSlug,
    slugAsParams: normalizedSlug,
    title,
    description: "",
    date: new Date(today).toISOString(),
    published: false,
    tags: ["tips"],
    body: "",
    body_source,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ success: true, slug: normalizedSlug, type });
}
