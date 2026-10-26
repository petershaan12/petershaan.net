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

    let likes;

    if (post) {
      await db
        .collection("page")
        .updateOne({ title: title }, { $inc: { likeCount: 1 } });
      likes = (post.likeCount || 0) + 1;
    } else {
      await db.collection("page").insertOne({
        title: title,
        likeCount: 1,
        viewCount: 0,
      });
      likes = 1;
    }

    return NextResponse.json({ likes }, { status: 200 });
  } catch (error) {
    console.log("Error incrementing likes:", error);

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

    const likes = post?.likeCount || 0;
    const views = post?.viewCount || 0;

    return NextResponse.json({ likes, views }, { status: 200 });
  } catch (error) {
    console.log("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
