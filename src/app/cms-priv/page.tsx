import Link from "next/link";
import NewDraftButton from "./new-draft-button";
import DuplicateButton from "./duplicate-button";
import DeleteButton from "./delete-button";
import { connectDB, getDB } from "@/lib/mongodb";
import { CmsType, COLLECTION_MAP } from "@/lib/cms";

export const dynamic = "force-dynamic";

async function readCollection(type: CmsType, collection: string) {
  await connectDB();
  const db = getDB();
  const docs = await db
    .collection(collection)
    .find({}, { projection: { _id: 0, slug: 1, slugAsParams: 1, title: 1, published: 1 } })
    .sort({ createdAt: -1, updatedAt: -1 })
    .toArray();
  return docs.map((d) => ({ slug: d.slugAsParams as string, title: d.title as string, published: d.published as boolean, type }));
}

export default async function AdminPage() {
  const adminPath = process.env.PETER_ADMIN ?? "cms-priv";
  const [notes, blog, projects] = await Promise.all([
    readCollection("notes", COLLECTION_MAP.notes),
    readCollection("blog", COLLECTION_MAP.blog),
    readCollection("project", COLLECTION_MAP.project),
  ]);

  const sections = [
    { label: "Notes", items: notes, color: "text-yellow-400", type: "notes" },
    { label: "Blog", items: blog, color: "text-blue-400", type: "blog" },
    { label: "Projects", items: projects, color: "text-green-400", type: "project" },
  ];

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold font-rethink mb-1">Admin CMS</h1>
          <p className="text-gray-500 text-sm">Hello admin 👋, what would you like to do today?</p>
        </div>
        <NewDraftButton adminPath={adminPath} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map(({ label, items, color, type }) => (
          <div key={label}>
            <h2 className={`text-lg font-bold mb-4 ${color}`}>
              {label} <span className="text-gray-500 font-normal">({items.length})</span>
            </h2>
            <div className="space-y-2">
              {items.length === 0 && (
                <p className="text-sm text-gray-600">No content found.</p>
              )}
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[#2a2a2a] bg-[#111] hover:border-[#4a4a4a] transition-colors group"
                >
                  <Link
                    href={`/${adminPath}/${type}/${item.slug}`}
                    className="min-w-0 flex-1 text-sm truncate group-hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center gap-3 shrink-0">
                    <DuplicateButton adminPath={adminPath} slug={item.slug} type={type} />
                    <DeleteButton adminPath={adminPath} slug={item.slug} type={type} />
                    <span className={`text-xs ${item.published ? "text-green-400" : "text-gray-600"}`}>
                      {item.published ? "live" : "draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
