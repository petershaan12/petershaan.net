import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB, getDB } from "@/lib/mongodb";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-auth";
import { COLLECTION_MAP, SLUG_PREFIX, isCmsType, slugify } from "@/lib/cms";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

function parseFrontmatter(source: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { frontmatter: {}, body: source };

  const frontmatter = match[1].split(/\r?\n/).reduce((acc: Record<string, unknown>, line: string) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return acc;
    const key = line.slice(0, separatorIndex).trim();
    const raw = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (raw === "true") acc[key] = true;
    else if (raw === "false") acc[key] = false;
    else if (raw.startsWith("[") && raw.endsWith("]")) {
      acc[key] = raw.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else {
      acc[key] = raw;
    }
    return acc;
  }, {});

  return { frontmatter, body: source.slice(match[0].length) };
}

const transformerCopyButton = () => ({
  name: "copy-button",
  pre(node: { children: unknown[] }) {
    node.children.push({
      type: "element",
      tagName: "button",
      properties: { type: "button", className: "copy", title: "Copy to clipboard", "data-copy": "true" },
      children: [
        {
          type: "element",
          tagName: "svg",
          properties: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
          children: [
            { type: "element", tagName: "rect", properties: { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }, children: [] },
            { type: "element", tagName: "path", properties: { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }, children: [] },
            { type: "element", tagName: "path", properties: { className: "check", d: "m9 14 2 2 4-4" }, children: [] },
          ],
        },
      ],
    });
  },
});

async function compileMdx(source: string): Promise<string> {
  const { compile } = await import("@mdx-js/mdx");
  const compiled = await compile(source, {
    outputFormat: "function-body",
    rehypePlugins: [
      rehypeSlug,
      [rehypeShiki, { theme: "github-dark", addLanguageClass: true, transformers: [transformerCopyButton()] }],
      [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["subheading-anchor"], ariaLabel: "Link to section" } }],
    ],
  });
  return String(compiled);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!verifyAdminToken(token ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, slug, previousSlug, content, shouldPublish } = await req.json();
  if (!isCmsType(type)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const collectionName = COLLECTION_MAP[type];
  const safeSlug = typeof slug === "string" ? slugify(slug) : "";
  const safePreviousSlug = typeof previousSlug === "string" ? slugify(previousSlug) : "";
  if (!collectionName || !safeSlug || !safePreviousSlug || !content) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { frontmatter, body: mdxBody } = parseFrontmatter(content);

  // Sync published flag in the source text so reload shows correct state
  const finalSource = shouldPublish
    ? content.replace(/^(published:\s*)false$/m, "$1true")
    : content;

  let compiledBody: string;
  try {
    compiledBody = await compileMdx(mdxBody);
  } catch {
    return NextResponse.json({ error: "MDX compile error" }, { status: 400 });
  }

  const slugAsParams = safeSlug;
  const fullSlug = `${SLUG_PREFIX[type]}/${slugAsParams}`;
  const previousFullSlug = `${SLUG_PREFIX[type]}/${safePreviousSlug}`;
  const now = new Date();

  const doc: Record<string, unknown> = {
    slug: fullSlug,
    slugAsParams,
    title: String(frontmatter.title ?? slugAsParams),
    description: String(frontmatter.description ?? ""),
    date: frontmatter.date ? new Date(String(frontmatter.date)).toISOString() : now.toISOString(),
    published: shouldPublish ? true : Boolean(frontmatter.published),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    body: compiledBody,
    body_source: finalSource,
    updatedAt: now,
  };

  if (type === "blog") {
    if (frontmatter.thumbnail) doc.thumbnail = String(frontmatter.thumbnail);
  }
  if (type === "project") {
    if (frontmatter.repository) doc.repository = String(frontmatter.repository);
    if (frontmatter.live) doc.live = String(frontmatter.live);
    if (frontmatter.tech) doc.tech = frontmatter.tech;
    if (frontmatter.image) doc.image = String(frontmatter.image);
    if (frontmatter.logo) doc.logo = String(frontmatter.logo);
    doc.detail = Boolean(frontmatter.detail);
  }

  await connectDB();
  const db = getDB();
  if (fullSlug !== previousFullSlug) {
    const existing = await db.collection(collectionName).findOne({ slug: fullSlug }, { projection: { _id: 1 } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  const result = await db.collection(collectionName).updateOne(
    { slug: previousFullSlug },
    { $set: doc, $setOnInsert: { createdAt: now } },
    { upsert: false }
  );

  if (!result.matchedCount) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const adminPath = process.env.PETER_ADMIN;
  revalidatePath("/cms-priv");
  if (adminPath) {
    revalidatePath(`/${adminPath}`);
  }

  return NextResponse.json({ success: true, slug: slugAsParams });
}
