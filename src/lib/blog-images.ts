import { connectDB, getDB } from "@/lib/mongodb";
import type { ContentPost } from "@/lib/content";

export type BlogImageAsset = {
  source: string;
  url: string;
  alt?: string;
};

export type BlogImageDoc = {
  slug: string;
  thumbnail?: string;
  thumbnailSource?: string;
  images?: BlogImageAsset[];
};

export type BlogImageOverrides = {
  thumbnailBySlug: Map<string, string>;
  imageMapBySlug: Map<string, Record<string, string>>;
};

const BLOG_IMAGES_COLLECTION = "blog_images";

export function normalizeBlogSlug(slug: string) {
  return slug.replace(/^blog\//, "");
}

function buildImageMap(images: BlogImageAsset[] = []) {
  return images.reduce<Record<string, string>>((acc, image) => {
    if (image.source && image.url) {
      acc[image.source] = image.url;
    }

    return acc;
  }, {});
}

export async function getBlogImageOverrides(
  slugs: string[]
): Promise<BlogImageOverrides> {
  const normalizedSlugs = slugs.map(normalizeBlogSlug);
  const thumbnailBySlug = new Map<string, string>();
  const imageMapBySlug = new Map<string, Record<string, string>>();

  try {
    await connectDB();
    const db = getDB();
    const docs = await db
      .collection<BlogImageDoc>(BLOG_IMAGES_COLLECTION)
      .find({ slug: { $in: normalizedSlugs } })
      .toArray();

    docs.forEach((doc) => {
      if (doc.thumbnail) {
        thumbnailBySlug.set(doc.slug, doc.thumbnail);
      }

      imageMapBySlug.set(doc.slug, buildImageMap(doc.images));
    });
  } catch (error) {
    console.error("Failed to fetch blog image overrides:", error);
  }

  return { thumbnailBySlug, imageMapBySlug };
}

export async function getBlogImageOverride(slug: string) {
  const overrides = await getBlogImageOverrides([slug]);
  const normalizedSlug = normalizeBlogSlug(slug);

  return {
    thumbnail: overrides.thumbnailBySlug.get(normalizedSlug),
    imageMap: overrides.imageMapBySlug.get(normalizedSlug) ?? {},
  };
}

export function getPostThumbnail(post: ContentPost, overrides: BlogImageOverrides) {
  const normalizedSlug = normalizeBlogSlug(post.slug);

  return overrides.thumbnailBySlug.get(normalizedSlug) ?? post.thumbnail ?? "";
}
