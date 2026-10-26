import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import ProjectsContent from "@/components/projects/projects-content";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import ProjectsSchema from "@/components/projects/projects-schema";
import PaperBackground from "@/components/paper-background";
import { getProjects } from "@/lib/content";

export const revalidate = 60;

export function generateMetadata(): Metadata {
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", siteConfig.name);

  return {
    title: {
      default: "Projects",
      template: `%s`,
    },
    keywords: [
      "Peter Shaan",
      "fullstack developer",
      "web developer",
      "software engineer",
      "project peter shaan",
      "peter shaan portfolio",
    ],
    description:
      "Explore the latest projects by " +
      siteConfig.author +
      ". " +
      siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/projects",
    },
    authors: { name: siteConfig.author },
    openGraph: {
      title: "Projects | " + siteConfig.name,
      description:
        "Explore the latest projects by " +
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
      title: "Projects | " + siteConfig.name,
      description:
        "Explore the latest projects by " +
        siteConfig.author +
        ". " +
        siteConfig.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

function getToday() {
  const d = new Date();
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  return `${day} / ${month} / ${year}`;
}

export default async function Page() {
  const today = getToday();

  // Filter only published projects and sort by date (newest first)
  const publishedProjects = (await getProjects({ publishedOnly: true }))
    .map((p) => ({
      title: p.title,
      description: p.description,
      tech: p.tech,
      image: p.image,
      logo: p.logo,
      slugAsParams: p.slugAsParams,
      detail: p.detail,
      live: p.live
    }));

  return (
    <>
      <ProjectsSchema />
      <Navbar />
      <main>
        <PaperBackground label="Notes" title="Peter Projects" date={today} />
        <ProjectsContent projects={publishedProjects} />
      </main>
      <Footer />
    </>
  );
}
