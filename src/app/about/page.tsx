import AboutContent from "@/components/about/about-content";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import AboutSchema from "@/components/about/about-schema";
import PaperBackground from "@/components/paper-background";

export function generateMetadata(): Metadata {
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", siteConfig.name);

  return {
    title: {
      default: "About",
      template: `%s`,
    },
    keywords: [
      "Peter Shaan",
      "fullstack developer",
      "web developer",
      "software engineer",
      "about peter shaan",
      "peter shaan portfolio",
    ],
    description:
      "Learn more about " + siteConfig.author + ". " + siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/about",
    },
    authors: { name: siteConfig.author },
    openGraph: {
      title: "About | " + siteConfig.name,
      description:
        "Learn more about " + siteConfig.author + ". " + siteConfig.description,
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
      title: "About | " + siteConfig.name,
      description:
        "Learn more about " + siteConfig.author + ". " + siteConfig.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

export default function page() {
  return (
    <>
      <AboutSchema />
      <Navbar />
      <main id="page-content">
        <PaperBackground label="Notes" title="Peter About" date="03 / Des / 2002" />
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
