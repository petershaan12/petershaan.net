import React from 'react';
import { siteConfig } from '@/config/site';

export default function SchemaMarkup() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      siteConfig.links.youtube,
      siteConfig.links.instagram,
      siteConfig.links.linkedin,
      siteConfig.links.github,
      siteConfig.links.facebook,
      siteConfig.links.pinterest,
    ]
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author,
    url: siteConfig.url,
    sameAs: [
      siteConfig.links.youtube,
      siteConfig.links.instagram,
      siteConfig.links.linkedin,
      siteConfig.links.github,
      siteConfig.links.facebook,
      siteConfig.links.pinterest,
    ],
    jobTitle: 'Web Developer',
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.name
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: `${siteConfig.url}/about`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Blog',
        item: `${siteConfig.url}/blog`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Projects',
        item: `${siteConfig.url}/projects`
      }
    ]
  };

  const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: [
      'Home',
      'About',
      'Blog',
      'Projects'
    ],
    url: [
      siteConfig.url,
      `${siteConfig.url}/about`,
      `${siteConfig.url}/blog`,
      `${siteConfig.url}/projects`
    ]
  };

  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
    </>
  );
}
