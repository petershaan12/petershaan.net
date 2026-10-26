"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LuArrowLeft, LuSave, LuUpload, LuEye, LuEyeOff, LuImage } from "react-icons/lu";
import { MDXContent } from "@/components/blog/mdx-component";
import { slugify } from "@/lib/cms";
import { siteConfig } from "@/config/site";

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm: Record<string, string | string[]> = {};
  for (const line of match[1].split("\n")) {
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    const val = line.slice(sep + 1).trim().replace(/^["']|["']$/g, "");
    if (val.startsWith("[")) {
      fm[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      fm[key] = val;
    }
  }
  return fm;
}

interface EditorProps {
  type: string;
  slug: string;
  initialContent: string;
  adminPath: string;
}

export default function Editor({ type, slug, initialContent, adminPath }: EditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [savedSlug, setSavedSlug] = useState(slug);
  const [slugInput, setSlugInput] = useState(slug);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewCode, setPreviewCode] = useState("");
  const [previewError, setPreviewError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slugInputRef = useRef<HTMLInputElement>(null);

  const api = (path: string) => `/api/${adminPath}/${path}`;

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(api("upload"), { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        setContent((prev) => prev + `\n![${file.name}](${data.url})\n`);
      } else {
        setStatus(`Upload error: ${data.error}`);
        setTimeout(() => setStatus(""), 3000);
      }
    } catch {
      setStatus("Upload failed");
      setTimeout(() => setStatus(""), 3000);
    }
    setUploading(false);
  };

  const canPublish = type === "notes" || type === "blog" || type === "project";

  useEffect(() => {
    if (isEditingSlug) slugInputRef.current?.focus();
  }, [isEditingSlug]);

  const commitSlugEdit = () => {
    const nextSlug = slugify(slugInput);
    if (nextSlug) {
      setCurrentSlug(nextSlug);
      setSlugInput(nextSlug);
    } else {
      setSlugInput(currentSlug);
    }
    setIsEditingSlug(false);
  };

  useEffect(() => {
    if (!showPreview) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(api("preview"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        const data = await res.json();
        if (data.code) {
          setPreviewCode(data.code);
          setPreviewError("");
        } else {
          setPreviewError(data.error ?? "Compile error");
        }
      } catch {
        setPreviewError("Preview failed");
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, showPreview]);

  const save = async (shouldPublish: boolean) => {
    setLoading(true);
    setStatus("Saving...");
    try {
      const res = await fetch(api("save"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug: currentSlug, previousSlug: savedSlug, content, shouldPublish }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(shouldPublish ? "Published!" : "Saved!");
        if (data.slug && data.slug !== savedSlug) {
          setSavedSlug(data.slug);
          setCurrentSlug(data.slug);
          setSlugInput(data.slug);
          router.replace(`/${adminPath}/${type}/${data.slug}`);
        }
        if (shouldPublish) {
          setContent((prev) => prev.replace(/^(published:\s*)false$/m, "$1true"));
        }
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch {
      setStatus("Error saving");
    }
    setLoading(false);
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/${adminPath}`} className="text-gray-400 hover:text-white transition-colors">
            <LuArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-gray-500 capitalize">{type}</p>
            {isEditingSlug ? (
              <input
                ref={slugInputRef}
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                onBlur={commitSlugEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitSlugEdit();
                  if (e.key === "Escape") {
                    setSlugInput(currentSlug);
                    setIsEditingSlug(false);
                  }
                }}
                className="font-bold font-rethink text-sm bg-transparent border-b border-primary focus:outline-none"
                spellCheck={false}
              />
            ) : (
              <h1
                className="font-bold font-rethink text-sm cursor-text"
                onDoubleClick={() => {
                  setSlugInput(currentSlug);
                  setIsEditingSlug(true);
                }}
                title="Double click to edit slug"
              >
                {currentSlug}
              </h1>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {status && (
            <span className={`text-xs ${status.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>
              {status}
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3a3a3a] text-sm hover:border-[#5a5a5a] transition-colors disabled:opacity-50"
          >
            <LuImage className="w-3.5 h-3.5" />
            {uploading ? "Uploading..." : "Image"}
          </button>
          <button
            onClick={() => setShowPreview((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              showPreview ? "border-primary text-primary" : "border-[#3a3a3a] text-gray-400 hover:border-[#5a5a5a]"
            }`}
          >
            {showPreview ? <LuEyeOff className="w-3.5 h-3.5" /> : <LuEye className="w-3.5 h-3.5" />}
            Preview
          </button>
          <button
            onClick={() => save(false)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3a3a3a] text-sm hover:border-[#5a5a5a] transition-colors disabled:opacity-50"
          >
            <LuSave className="w-3.5 h-3.5" /> Save
          </button>
          {canPublish && (
            <button
              onClick={() => save(true)}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <LuUpload className="w-3.5 h-3.5" /> Publish
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`bg-[#0a0a0a] text-gray-200 font-mono text-sm p-6 resize-none focus:outline-none leading-relaxed ${
            showPreview ? "w-1/2 border-r border-[#2a2a2a]" : "w-full"
          }`}
          spellCheck={false}
        />
        {showPreview && (
          <div className="w-1/2 overflow-y-auto">
            {(() => {
              const fm = parseFrontmatter(content);
              const title = fm.title as string | undefined;
              const description = fm.description as string | undefined;
              const thumbnail = fm.thumbnail as string | undefined;
              const tags = fm.tags as string[] | undefined;
              const date = fm.date as string | undefined;
              return (
                <>
                  {thumbnail && (
                    <div className="relative w-full h-52 overflow-hidden">
                      <Image
                        src={thumbnail}
                        alt={title ?? "thumbnail"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
                    </div>
                  )}
                  <div className="px-8 pt-6 pb-2">
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-white/20 bg-[#393939]/40 text-white/40 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {title && (
                      <h1 className="text-2xl font-extrabold font-rethink mb-1">{title}</h1>
                    )}
                    {description && (
                      <p className="text-gray-400 text-sm mb-4">{description}</p>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <Image
                        src="/me.webp"
                        alt="Author"
                        width={32}
                        height={32}
                        className="rounded-full w-8 h-8 object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold">{siteConfig.author}</p>
                        <p className="text-xs text-gray-400">
                          {date
                            ? new Date(date).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Draft"}
                        </p>
                      </div>
                    </div>
                    <hr className="border-white/10 mb-4" />
                  </div>
                  <div className="px-8 pb-8">
                    {previewError ? (
                      <pre className="text-red-400 text-xs">{previewError}</pre>
                    ) : previewCode ? (
                      <article className="prose prose-invert prose-base max-w-full">
                        <MDXContent code={previewCode} />
                      </article>
                    ) : (
                      <p className="text-gray-600 text-sm">Compiling preview...</p>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
