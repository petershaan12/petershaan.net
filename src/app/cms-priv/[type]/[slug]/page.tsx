import { notFound } from "next/navigation";
import Editor from "./editor";
import { connectDB, getDB } from "@/lib/mongodb";
import { COLLECTION_MAP, SLUG_PREFIX, isCmsType } from "@/lib/cms";

interface PageProps {
  params: Promise<{ type: string; slug: string }>;
}

export default async function EditPage({ params }: PageProps) {
  const { type, slug } = await params;
  if (!isCmsType(type)) notFound();

  const collectionName = COLLECTION_MAP[type];
  if (!collectionName) notFound();

  await connectDB();
  const db = getDB();
  const doc = await db.collection(collectionName).findOne(
    { slug: `${SLUG_PREFIX[type]}/${slug}` },
    { projection: { _id: 0, body_source: 1 } }
  );

  if (!doc) notFound();

  const content = (doc.body_source as string | undefined) ?? "";
  const adminPath = process.env.PETER_ADMIN ?? "cms-priv";
  return <Editor type={type} slug={slug} initialContent={content} adminPath={adminPath} />;
}
