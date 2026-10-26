import { notFound } from "next/navigation";
import { MDXContent } from "@/components/blog/mdx-component";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { LuArrowLeft, LuEye } from "react-icons/lu";
import ReportView from "./view";
import { connectDB, getDB } from "@/lib/mongodb";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TableOfContentsMobile } from "@/components/blog/table-of-contents-mobile";
import BlogPostSchema from "@/components/blog/blog-post-schema";
import BlogComments from "@/components/blog/blog-comments";
import LikeButton from "@/components/blog/like-button";
import Link from "next/link";
import { getBlogImageOverride } from "@/lib/blog-images";
import { getPostBySlug } from "@/lib/content";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function getPostFromParams({ slug }: { slug: string[] }) {
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
  const normalizedSlug = slugPath.replace(/^blog\//, "");

  return getPostBySlug(normalizedSlug);
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostFromParams({ slug });

  if (!post) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", post.title);

  return {
    title: post.title,
    description: post.description,
    authors: { name: siteConfig.author },
    keywords: [
      "peter shaan",
      "petershaan blog",
      "peter shaan blog",
      "petershaan articles",
      post.title,
      ...(post.tags ?? []), // tags akan jadi array terpisah
    ],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `/blog/${post.slugAsParams}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteConfig.url}/blog/${post.slugAsParams}`,
      images: [
        {
          url: `/api/og?${ogSearchParams.toString()}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostFromParams({ slug });

  if (!post || !post.published) {
    notFound();
  }

  const blogImage = await getBlogImageOverride(post.slug);
  const thumbnail = blogImage.thumbnail ?? post.thumbnail ?? "";
  const postViews = { countViews: 0 };
  const postLikes = { countLikes: 0 };

  try {
    await connectDB();
    const db = getDB();
    const postDoc = await db
      .collection("posts")
      .findOne({ slug: post.slug.replace(/^blog\//, "") });
    if (postDoc) {
      postViews.countViews = postDoc.viewCount ?? postDoc.views ?? 0;
      postLikes.countLikes = postDoc.likeCount ?? 0;
    }
  } catch (error) {
    console.error("Failed to fetch post views/likes:", error);
  }

  return (
    <>
      <BlogPostSchema post={post} />
      <ReportView slug={post.slug} />
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-52 md:h-96 -z-40 pointer-events-none select-none overflow-hidden flex">
        <Image
          src={thumbnail}
          alt="Background paper texture"
          className="object-cover w-full "
          quality={80}
          draggable="false"
          loading="eager"
          width={1920}
          height={384}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent h-[100%]" />
      </div>
      <main className="mt-36 md:mt-48 container">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag, index) => (
            <Badge
              key={index}
              className="border border-white/20 bg-[#393939]/40 text-white/40 font-bebas-neue text-xs sm:text-sm tracking-wide px-2 py-1 cursor-pointer transition-all duration-300"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="mb-2 text-2xl font-extrabold sm:text-3xl md:text-4xl font-rethink">
          {post.title}
        </h1>
        {post.description ? (
          <p className="mt-0 text-gray-400 text-sm sm:text-base">
            {post.description}
          </p>
        ) : null}
        <div className="flex items-center gap-2 mt-8 mb-8">
          <Image
            src="/me.webp"
            alt="Author avatar"
            width={40}
            height={40}
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
            style={{ objectFit: "cover" }}
          />
          <div>
            <p className="font-semibold text-xs sm:text-sm">
              {siteConfig.author}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              {post.date
                ? new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                : ""}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <hr className="my-3 text-[#ACACAC]/40" />
          <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-1">
              <LuEye className="text-primary" /> {postViews.countViews} Views
            </div>
            <LikeButton slug={post.slug} initialLikes={postLikes.countLikes} />
          </div>
          <hr className="my-3 text-[#ACACAC]/40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-10">
          <article className="mt-4 prose prose-invert prose-base mx-auto max-w-full">
            <MDXContent code={post.body} imageMap={blogImage.imageMap} />
          </article>

          <div className="hidden lg:block">
            <TableOfContents />
          </div>
        </div>

        <BlogComments slug={post.slugAsParams} />

        <Link href="/blog" className="mt-4 flex items-center gap-2 underline hover:text-primary text-gray-400">
          <LuArrowLeft /> Back to Blog
        </Link>

        <div className="lg:hidden block">
          <TableOfContentsMobile />
        </div>
      </main>
      <Footer />
    </>
  );
}
