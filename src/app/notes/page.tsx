import NotesContent from "@/components/notes/notes-content";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { getNotes } from "@/lib/content";
import { connectDB, getDB } from "@/lib/mongodb";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", siteConfig.name + " Notes");

  return {
    title: "Notes",
    description: `Short notes, quick thoughts, and things ${siteConfig.author} finds useful.`,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/notes",
    },
    authors: { name: siteConfig.author },
    openGraph: {
      title: "Notes | " + siteConfig.name,
      description: `Short notes, quick thoughts, and things ${siteConfig.author} finds useful.`,
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
      title: "Notes | " + siteConfig.name,
      description: `Short notes, quick thoughts, and things ${siteConfig.author} finds useful.`,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  } as Metadata;
}

export default async function NotesPage() {
  const notes = await getNotes({ publishedOnly: true });

  let noteViews: { slug: string; views: number }[] = [];
  try {
    await connectDB();
    const db = getDB();
    const docs = await db.collection("posts").find({
      slug: { $in: notes.map((n) => n.slug) },
    }).toArray();
    noteViews = docs.map((doc) => ({ slug: doc.slug, views: doc.viewCount ?? 0 }));
  } catch (error) {
    console.error("Failed to fetch note views:", error);
  }

  return (
    <>
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
        <NotesContent
          notes={notes.map((note) => ({
            title: note.title,
            date: note.date,
            tags: note.tags ?? [],
            description: note.description ?? "",
            slug: note.slug,
            views: noteViews.find((v) => v.slug === note.slug)?.views ?? 0,
          }))}
        />
      </main>
      <Footer />
    </>
  );
}
