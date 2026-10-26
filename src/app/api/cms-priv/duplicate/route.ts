import { NextRequest, NextResponse } from "next/server";
import { connectDB, getDB } from "@/lib/mongodb";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-auth";
import { COLLECTION_MAP, SLUG_PREFIX, isCmsType, slugify } from "@/lib/cms";

function makeDuplicateTitle(title: string) {
  return title.endsWith(" (Copy)") ? title : `${title} (Copy)`;
}

function updateFrontmatterTitle(source: string, title: string) {
  if (!source.match(/^---\r?\n/)) return source;
  if (source.match(/^title:\s.*$/m)) {
    return source.replace(/^title:\s.*$/m, `title: ${title}`);
  }
  return source.replace(/^---\r?\n/, `---\ntitle: ${title}\n`);
}

async function getUniqueSlug(collectionName: string, prefix: string, baseSlug: string) {
  const db = getDB();

  for (let index = 0; index < 1000; index += 1) {
    const slug = index === 0 ? `${baseSlug}-copy` : `${baseSlug}-copy-${index + 1}`;
    const existing = await db.collection(collectionName).findOne(
      { slug: `${prefix}/${slug}` },
      { projection: { _id: 1 } }
    );
    if (!existing) return slug;
  }

  throw new Error("Unable to create unique slug");
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!verifyAdminToken(token ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, slug } = await req.json();
  if (!isCmsType(type) || typeof slug !== "string" || !slugify(slug)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const collectionName = COLLECTION_MAP[type];
  const slugPrefix = SLUG_PREFIX[type];
  const normalizedSlug = slugify(slug);

  await connectDB();
  const db = getDB();

  const existing = await db.collection(collectionName).findOne({ slug: `${slugPrefix}/${normalizedSlug}` });
  if (!existing) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const duplicateSlug = await getUniqueSlug(collectionName, slugPrefix, normalizedSlug);
  const duplicateTitle = makeDuplicateTitle(String(existing.title ?? normalizedSlug));
  const now = new Date();
  const bodySource = updateFrontmatterTitle(String(existing.body_source ?? ""), duplicateTitle);

  const { _id: _ignoredId, ...existingWithoutId } = existing;
  const duplicateDoc = {
    ...existingWithoutId,
    slug: `${slugPrefix}/${duplicateSlug}`,
    slugAsParams: duplicateSlug,
    title: duplicateTitle,
    body_source: bodySource,
    published: false,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(collectionName).insertOne(duplicateDoc);

  return NextResponse.json({ success: true, slug: duplicateSlug, type });
}
