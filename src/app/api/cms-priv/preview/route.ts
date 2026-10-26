import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-auth";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!verifyAdminToken(token ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();

  try {
    const body = content.replace(/^---[\s\S]*?---\n?/, "");
    const { compile } = await import("@mdx-js/mdx");
    const compiled = await compile(body, {
      outputFormat: "function-body",
      rehypePlugins: [
        rehypeSlug,
        [rehypeShiki, { theme: "github-dark", addLanguageClass: true }],
        [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["subheading-anchor"] } }],
      ],
    });
    return NextResponse.json({ code: String(compiled) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
