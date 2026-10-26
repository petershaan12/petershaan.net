import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPosts, getProjects, getNotes } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || siteConfig.url;
  const [posts, projects, notes] = await Promise.all([
    getPosts({ publishedOnly: true }),
    getProjects({ publishedOnly: true }),
    getNotes({ publishedOnly: true }),
  ]);

  // Main routes
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Add all blog posts
  const blogPosts = posts
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slugAsParams}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // Add all project pages
  const projectPages = projects
    .filter((project) => project.detail)
    .map((project) => ({
      url: `${baseUrl}/projects/${project.slugAsParams}`,
      lastModified: new Date(project.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const notePages = notes.map((note) => ({
    url: `${baseUrl}/notes/${note.slugAsParams}`,
    lastModified: new Date(note.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...blogPosts, ...projectPages, ...notePages];
}
