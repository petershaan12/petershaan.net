import { NextRequest, NextResponse } from "next/server";
import { connectDB, getDB } from "@/lib/mongodb";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const title = body?.title || "default";

    if (!title) {
      return NextResponse.json(
        { error: "Title parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const db = getDB();
    const post = await db.collection("page").findOne({ title: title });

    let views;
    if (post) {
      await db
        .collection("page")
        .updateOne({ title: title }, { $inc: { viewCount: 1 } });
      views = (post.viewCount || 0) + 1;
    } else {
      await db.collection("page").insertOne({ title: title, viewCount: 1 });
    }
    return NextResponse.json({ views }, { status: 200 });
  } catch (error) {
    console.log("Error incrementing views:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "default";

    await connectDB();
    const db = getDB();
    const post = await db.collection("page").findOne({ title: title });

    const views = post?.viewCount || 0;

    return NextResponse.json({ views }, { status: 200 });
  } catch (error) {
    console.log("Error fetching views:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
