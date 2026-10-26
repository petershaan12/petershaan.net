import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Giscus from "@/components/guestbook/giscus";
import Image from "next/image";

export function generateMetadata(): Metadata {
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", "Guest Book");

  return {
    title: "Guest Book",
    description: "Leave a message in Peter Shaan's guest book. Share your thoughts, feedback, or just say hello!",
    keywords: [
      "Peter Shaan",
      "guest book",
      "guestbook",
      "feedback",
      "comments",
    ],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/guestbook",
    },
    authors: { name: siteConfig.author },
    openGraph: {
      title: "Guest Book | " + siteConfig.name,
      description: "Leave a message in Peter Shaan's guest book.",
      type: "website",
      url: siteConfig.url + "/guestbook",
      images: [
        {
          url: `/api/og?${ogSearchParams.toString()}`,
          width: 1200,
          height: 630,
          alt: "Guest Book",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Guest Book | " + siteConfig.name,
      description: "Leave a message in Peter Shaan's guest book.",
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

export default function GuestBookPage() {
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
        <Giscus />
      </main>
      <Footer />
    </>
  );
}
