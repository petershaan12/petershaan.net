import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ContentPost } from "@/lib/content";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function sortPosts<T extends { date: string }>(posts: Array<T>) {
  return posts.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });
}

export function sortTagsByCount(tags: Record<string, number>) {
  return Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPostsByTagSlug(posts: Array<ContentPost>, tag: string) {
  return posts.filter((post) => {
    if (!post.tags) return false;
    const slugifiedTags = post.tags.map((tag) => slugify(tag));
    return slugifiedTags.includes(tag);
  });
}

export const PAGE_LOADING_START_EVENT = "page-loading:start";
export const PAGE_LOADING_DONE_EVENT = "page-loading:done";

export function pageAnimation(): Promise<void> {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PAGE_LOADING_START_EVENT));
  }

  return Promise.resolve();
}

export function openPageAnimation(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PAGE_LOADING_DONE_EVENT));
  }
}
