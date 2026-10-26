import BlogContent from "@/components/blog/blog-content";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { connectDB, getDB } from "@/lib/mongodb";
import { sortPosts } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import BlogSchema from "@/components/blog/blog-schema";
import { getBlogImageOverrides, getPostThumbnail } from "@/lib/blog-images";
import { getPosts } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const sortedPosts = await getPosts({ publishedOnly: true });
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", siteConfig.name + " Blog");

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Blog`,
    description: `Read the latest articles and insights by ${siteConfig.author}. ${siteConfig.description}`,
    url: `${siteConfig.url}/blog`,
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    blogPost: sortedPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${siteConfig.url}/${post.slug}`,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: siteConfig.author,
      },
    })),
  };

  return {
    title: {
      default: "Blog",
      template: `%s`,
    },
    keywords: [
      "Peter Shaan",
      "fullstack developer",
      "web developer",
      "software engineer",
      "article peter shaan",
      "peter shaan portfolio",
    ],
    description:
      "Read the latest articles and insights by " +
      siteConfig.author +
      ". " +
      siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/blog",
    },
    authors: { name: siteConfig.author },
    openGraph: {
      title: "Blog | " + siteConfig.name,
      description:
        "Read the latest articles and insights by " +
        siteConfig.author +
        ". " +
        siteConfig.description,
      type: "website",
      url: siteConfig.url,
      images: [
        {
          url: `/api/og?${ogSearchParams.toString()}`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | " + siteConfig.name,
      description:
        "Read the latest articles and insights by " +
        siteConfig.author +
        ". " +
        siteConfig.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
    other: {
      "script:ld+json": JSON.stringify(blogSchema),
    },
  } as Metadata;
}

type PostView = { slug: string; views?: number; viewCount?: number };

export default async function page() {
  const sortedPosts = sortPosts(await getPosts({ publishedOnly: true }));
  const blogImages = await getBlogImageOverrides(
    sortedPosts.map((post) => post.slug)
  );

  let postViews: PostView[] = [];
  try {
    await connectDB();
    const db = getDB();
    const postDocs = await db.collection("posts").find().toArray();
    postViews = postDocs.map((doc) => ({
      slug: doc.slug,
      views: doc.viewCount,
    }));
    console.log("Post views fetched successfully:", postViews);
  } catch (error) {
    console.error("Failed to fetch post views:", error);
  }

  return (
    <>
      <BlogSchema posts={sortedPosts} />
      <Navbar />
      <main id="page-content">
        <div className="absolute inset-0 -z-40 pointer-events-none select-none">
          <Image
            src="/bg-paper.svg"
            alt="Background paper texture"
            className="hidden md:block"
            quality={75}
            draggable="false"
            width={1920}
            height={1080}
            style={{
              height: "100vh",
              width: "100vw",
              objectFit: "cover",
              objectPosition: "left",
            }}
          />
          <Image
            src="/bg-paper-mobile.svg"
            alt="Background paper texture mobile"
            className="block md:hidden"
            quality={75}
            draggable="false"
            width={768}
            height={1024}
            style={{
              height: "100vh",
              width: "100vw",
              objectFit: "cover",
              objectPosition: "left",
            }}
          />
        </div>
        <BlogContent
          posts={sortedPosts.map((post) => ({
            title: post.title,
            date: post.date,
            name: post.title,
            tags: post.tags ?? [],
            description: post.description ?? "",
            slug: post.slug,
            thumbnail: getPostThumbnail(post, blogImages),
            views:
              postViews.find(
                (view) => view.slug === post.slug.replace(/^blog\//, "")
              )?.views || 0,
          }))}
        />
      </main>
      <Footer />
    </>
  );
}
