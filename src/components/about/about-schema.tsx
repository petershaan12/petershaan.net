import React from "react";
import { siteConfig } from "@/config/site";

export default function AboutSchema() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    headline: "About " + siteConfig.author,
    description:
      "Learn more about " + siteConfig.author + ". " + siteConfig.description,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.url,
      jobTitle: "Software Engineer",
      sameAs: [
        siteConfig.links.youtube,
        siteConfig.links.instagram,
        siteConfig.links.linkedin,
        siteConfig.links.github,
        siteConfig.links.facebook,
        siteConfig.links.pinterest,
      ],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/about`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${siteConfig.url}/about`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
