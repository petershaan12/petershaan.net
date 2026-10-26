"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuPlus, LuX } from "react-icons/lu";
import { slugify } from "@/lib/cms";

export default function NewDraftButton({ adminPath }: { adminPath: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("notes");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !slugify(slug)) return setError("Title and slug are required");
    setLoading(true);
    setError("");

    const res = await fetch(`/api/${adminPath}/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title, slug }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setOpen(false);
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      router.push(`/${adminPath}/${data.type}/${data.slug}`);
      router.refresh();
    } else {
      setError(data.error ?? "Failed to create");
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setError("");
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <LuPlus className="w-4 h-4" /> New
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold font-rethink text-lg">New Draft</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white">
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <div className="flex gap-2">
                  {["notes", "blog", "project"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-4 py-2 rounded-lg border text-sm capitalize transition-colors ${
                        type === t
                          ? "border-primary text-primary"
                          : "border-[#3a3a3a] text-gray-400 hover:border-[#5a5a5a]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => {
                    const nextTitle = e.target.value;
                    setTitle(nextTitle);
                    if (!slugTouched) {
                      setSlug(slugify(nextTitle));
                    }
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="My New Note"
                  className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#5a5a5a] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                    setError("");
                  }}
                  onBlur={() => {
                    const nextSlug = slugify(slug);
                    setSlug(nextSlug);
                    setSlugTouched(nextSlug.length > 0);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="my-new-note"
                  className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#5a5a5a] transition-colors"
                  spellCheck={false}
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from title, but you can edit it.</p>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setOpen(false);
                  setError("");
                }}
                className="px-4 py-2 rounded-lg border border-[#3a3a3a] text-sm text-gray-400 hover:border-[#5a5a5a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-primary text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
