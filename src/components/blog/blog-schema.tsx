
import { siteConfig } from '@/config/site';
import type { ContentPost } from '@/lib/content';

interface BlogSchemaProps {
  posts: ContentPost[];
}

export default function BlogSchema({ posts }: BlogSchemaProps) {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    headline: `${siteConfig.name} Blog`,
    description: `Read the latest articles and insights by ${siteConfig.author}. ${siteConfig.description}`,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description || '',
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: siteConfig.author,
        url: siteConfig.url
      },
      url: `${siteConfig.url}/blog/${post.slugAsParams}`,
      ...(post.thumbnail && {
        image: `${siteConfig.url}${post.thumbnail}`
      })
    }))
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
    />
  );
}
