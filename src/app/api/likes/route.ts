import { NextRequest, NextResponse } from "next/server";
import { connectDB, getDB } from "@/lib/mongodb";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const slug = body?.slug;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await connectDB();
    const db = getDB();

    const normalizedSlug = slug.replace(/^blog\//, "");
    const post = await db.collection("posts").findOne({ slug: normalizedSlug });

    let likes;
    if (post) {
      await db
        .collection("posts")
        .updateOne({ slug: normalizedSlug }, { $inc: { likeCount: 1 } });
      likes = (post.likeCount || 0) + 1;
    } else {
      await db
        .collection("posts")
        .insertOne({ slug: normalizedSlug, viewCount: 0, likeCount: 1 });
      likes = 1;
    }

    return NextResponse.json({ likes }, { status: 200 });
  } catch (error) {
    console.error("Error incrementing likes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
