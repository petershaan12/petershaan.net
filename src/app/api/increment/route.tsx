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

    const post = await db.collection("posts").findOne({ slug: slug.replace(/^blog\//, "") });

    let views;
    if (post) {
      await db.collection("posts").updateOne({ slug: slug.replace(/^blog\//, "") }, { $inc: { viewCount: 1 } });
      views = (post.viewCount || 0) + 1;
    } else {
      await db.collection("posts").insertOne({ slug: slug.replace(/^blog\//, ""), viewCount: 1 });
    }

    return NextResponse.json({ views }, { status: 202 });
  } catch (error) {
    console.log("Error incrementing views:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
