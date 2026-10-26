import { sortPosts } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Footer from "@/components/footer";
import SecondContent from "@/components/home/second-content";
import { connectDB, getDB } from "@/lib/mongodb";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import FirstContent from "@/components/home/first-content";
import { getPosts } from "@/lib/content";

type PostView = { slug: string; views?: number; viewCount?: number };

export const revalidate = 60;

export function generateMetadata(): Metadata {
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", siteConfig.name);

  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name} Portofolio`,
    },
    keywords: [
      "Peter Shaan",
      "fullstack developer",
      "web developer",
      "software engineer",
      "home peter shaan",
      "peter shaan portfolio",
    ],
    description: siteConfig.description,
    authors: { name: siteConfig.author },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
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
      title: siteConfig.name,
      description: siteConfig.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

export default async function Home() {
  const sortedPosts = sortPosts(await getPosts({ publishedOnly: true }));
  const latestPosts = sortedPosts.slice(0, 3);

  let postViews: PostView[] = [];
  try {
    await connectDB();
    const db = getDB();
    const postDocs = await db.collection("posts").find().toArray();
    postViews = postDocs.map((doc) => ({
      slug: doc.slug,
      views: doc.views,
      viewCount: doc.viewCount,
    }));
  } catch (error) {
    console.error("Failed to fetch post views:", error);
  }

  return (
    <>
      <Navbar />
      <main>
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

        <section className="min-h-screen place-content-center">
          <FirstContent />
        </section>

        <SecondContent
          posts={latestPosts.map((post) => ({
            title: post.title,
            date: post.date,
            name: post.title,
            views:
              postViews.find(
                (view) => view.slug === post.slug.replace(/^blog\//, "")
              )?.viewCount || 0,
            description: post.description ?? "",
            slug: post.slug,
            thumbnail: post.thumbnail ?? "",
            tags: post.tags ?? [],
          }))}
        />
      </main>
      <Footer />
    </>
  );
}
