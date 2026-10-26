import { notFound } from "next/navigation";
import { MDXContent } from "@/components/blog/mdx-component";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { LuArrowLeft, LuEye } from "react-icons/lu";
import ReportView from "./view";
import { getNoteBySlug } from "@/lib/content";
import Link from "next/link";
import { connectDB, getDB } from "@/lib/mongodb";
import LikeButton from "@/components/blog/like-button";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TableOfContentsMobile } from "@/components/blog/table-of-contents-mobile";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function getNoteFromParams({ slug }: { slug: string[] }) {
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
  const normalizedSlug = slugPath.replace(/^notes\//, "");

  return getNoteBySlug(normalizedSlug);
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const note = await getNoteFromParams({ slug });

  if (!note) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", note.title);

  return {
    title: note.title,
    description: note.description,
    authors: { name: siteConfig.author },
    keywords: [
      "peter shaan",
      "petershaan notes",
      note.title,
      ...(note.tags ?? []),
    ],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `/notes/${note.slugAsParams}`,
    },
    openGraph: {
      title: note.title,
      description: note.description,
      type: "article",
      url: `${siteConfig.url}/notes/${note.slugAsParams}`,
      images: [
        {
          url: `/api/og?${ogSearchParams.toString()}`,
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getNoteFromParams({ slug });

  if (!note || !note.published) {
    notFound();
  }

  const noteViews = { countViews: 0 };
  const noteLikes = { countLikes: 0 };
  try {
    await connectDB();
    const db = getDB();
    const doc = await db.collection("posts").findOne({ slug: note.slug });
    if (doc) {
      noteViews.countViews = doc.viewCount ?? 0;
      noteLikes.countLikes = doc.likeCount ?? 0;
    }
  } catch (error) {
    console.error("Failed to fetch note views/likes:", error);
  }

  return (
    <>
      <ReportView slug={note.slug} />
      <Navbar />
      <div className="absolute inset-0 -z-40 pointer-events-none select-none">
        <Image
          src="/bg-paper.svg"
          alt="Background paper texture"
          className="hidden md:block"
          quality={75}
          draggable="false"
          width={1920}
          height={1080}
          style={{ height: "100vh", width: "100vw", objectFit: "cover", objectPosition: "left" }}
        />
        <Image
          src="/bg-paper-mobile.svg"
          alt="Background paper texture mobile"
          className="block md:hidden"
          quality={75}
          draggable="false"
          width={768}
          height={1024}
          style={{ height: "100vh", width: "100vw", objectFit: "cover", objectPosition: "left" }}
        />
      </div>
      <main className="mt-36 md:mt-48 container">
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags?.map((tag, index) => (
            <Badge
              key={index}
              className="border border-white/20 bg-[#393939]/40 text-white/40 font-bebas-neue text-xs sm:text-sm tracking-wide px-2 py-1"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="mb-2 text-2xl font-extrabold sm:text-3xl md:text-4xl font-rethink">
          {note.title}
        </h1>
        {note.description && (
          <p className="mt-0 text-gray-400 text-sm sm:text-base">
            {note.description}
          </p>
        )}
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
            <p className="font-semibold text-xs sm:text-sm">{siteConfig.author}</p>
            <p className="text-gray-400 text-xs sm:text-sm">
              {note.date
                ? new Date(note.date).toLocaleDateString(undefined, {
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
              <LuEye className="text-primary" /> {noteViews.countViews} Views
            </div>
            <LikeButton slug={note.slug} initialLikes={noteLikes.countLikes} />
          </div>
          <hr className="my-3 text-[#ACACAC]/40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-10">
          <article className="mt-4 prose prose-invert prose-base max-w-full">
            <MDXContent code={note.body} />
          </article>

          <div className="hidden lg:block">
            <TableOfContents />
          </div>
        </div>

        <hr className="my-8 text-[#ACACAC]/40" />
        <Link href="/notes" className="mt-4 flex items-center gap-2 underline hover:text-primary text-gray-400">
          <LuArrowLeft /> Back to Notes
        </Link>

        <div className="lg:hidden block">
          <TableOfContentsMobile />
        </div>
      </main>
      <Footer />
    </>
  );
}
