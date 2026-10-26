export const CMS_TYPES = ["notes", "blog", "project"] as const;

export type CmsType = (typeof CMS_TYPES)[number];

export const COLLECTION_MAP: Record<CmsType, string> = {
  notes: "content_notes",
  blog: "content_posts",
  project: "content_projects",
};

export const SLUG_PREFIX: Record<CmsType, string> = {
  notes: "notes",
  blog: "blog",
  project: "project",
};

export function isCmsType(value: string): value is CmsType {
  return CMS_TYPES.includes(value as CmsType);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
