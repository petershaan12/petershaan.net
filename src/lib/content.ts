import { connectDB, getDB } from "@/lib/mongodb";

export type ContentPost = {
  slug: string;
  slugAsParams: string;
  title: string;
  description?: string;
  date: string;
  published: boolean;
  tags?: string[];
  thumbnail?: string;
  body: string;
  body_source?: string;
};

export type ContentNote = {
  slug: string;
  slugAsParams: string;
  title: string;
  description?: string;
  date: string;
  published: boolean;
  tags?: string[];
  body: string;
  body_source?: string;
};

export type ContentProject = {
  slug: string;
  slugAsParams: string;
  title: string;
  description?: string;
  date: string;
  type?: string;
  repository?: string;
  live?: string;
  tech?: string[];
  image?: string;
  logo?: string;
  detail: boolean;
  published: boolean;
  body: string;
  body_source?: string;
};

const POSTS_COLLECTION = "content_posts";
const PROJECTS_COLLECTION = "content_projects";
const NOTES_COLLECTION = "content_notes";

async function getCollection<T extends object>(collection: string) {
  await connectDB();
  const db = getDB();

  return db.collection<T>(collection);
}

const contentProjection = {
  _id: 0,
  createdAt: 0,
  updatedAt: 0,
};

export function sortByNewest<T extends { date: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPosts(options: { publishedOnly?: boolean } = {}) {
  const collection = await getCollection<ContentPost>(POSTS_COLLECTION);
  const filter = options.publishedOnly ? { published: true } : {};
  const posts = await collection.find(filter, { projection: contentProjection }).toArray();

  return sortByNewest(posts);
}

export async function getPostBySlug(slug: string) {
  const normalizedSlug = slug.replace(/^blog\//, "");
  const collection = await getCollection<ContentPost>(POSTS_COLLECTION);

  return collection.findOne(
    { slugAsParams: normalizedSlug },
    { projection: contentProjection }
  );
}

export async function getProjects(options: { publishedOnly?: boolean } = {}) {
  const collection = await getCollection<ContentProject>(PROJECTS_COLLECTION);
  const filter = options.publishedOnly ? { published: true } : {};
  const projects = await collection.find(filter, { projection: contentProjection }).toArray();

  return sortByNewest(projects);
}

export async function getProjectBySlug(slug: string) {
  const normalizedSlug = slug.replace(/^project\//, "");
  const collection = await getCollection<ContentProject>(PROJECTS_COLLECTION);

  return collection.findOne(
    { slugAsParams: normalizedSlug },
    { projection: contentProjection }
  );
}

export async function getNotes(options: { publishedOnly?: boolean } = {}) {
  const collection = await getCollection<ContentNote>(NOTES_COLLECTION);
  const filter = options.publishedOnly ? { published: true } : {};
  const notes = await collection
    .find(filter, { projection: { ...contentProjection, updatedAt: 0 } })
    .sort({ updatedAt: -1 })
    .toArray();

  return notes;
}

export async function getNoteBySlug(slug: string) {
  const normalizedSlug = slug.replace(/^notes\//, "");
  const collection = await getCollection<ContentNote>(NOTES_COLLECTION);

  return collection.findOne(
    { slugAsParams: normalizedSlug },
    { projection: contentProjection }
  );
}
