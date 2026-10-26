
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import Link from "next/link";
import ViewLikes from "./viewlikes";

export function generateMetadata(): Metadata {
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", siteConfig.name);

  return {
    title: {
      default: "Playground",
      template: `%s`,
    },
    description: "Learn more about " + siteConfig.author + ". " + siteConfig.description,
    authors: { name: siteConfig.author },
    openGraph: {
      title: "Playground | " + siteConfig.name,
      description: "Learn more about " + siteConfig.author + ". " + siteConfig.description,
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
      title: "Playground | " + siteConfig.name,
      description: "Learn more about " + siteConfig.author + ". " + siteConfig.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}


export default function Page() {
  return (
    <>
      <div className="text-center">
        <p>Hi👋 This is a page for view or likes as a dummy</p>
        <small className="text-center italic text-gray-500">
          *Reload for views and press the thumbs up button for likes
        </small>
      </div>

      <ViewLikes />

      <p className="text-center text-sm text-gray-500">
        Made with 💖 as illustration by {" "}
        <Link
          href="https://petershaan.net"
          className="text-primary hover:underline"
        >
          Peter Shaan
        </Link>
      </p>
    </>
  );
}
