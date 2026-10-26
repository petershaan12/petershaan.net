"use client";
import BlogItem from "./blog-item";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDownIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sortTagsByCount } from "@/lib/utils";
import AnimatedPageHeader from "@/components/animated-page-header";

interface BlogContentProps {
  posts: Array<{
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: Array<string>;
    views: number;
    thumbnail: string;
  }>;
}

export default function BlogContent({ posts }: BlogContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [postsPerPage] = useState(4);
  // Seeded from props so the server HTML lists posts — an empty first render reads as a soft 404 to crawlers
  const [displayedPosts, setDisplayedPosts] = useState<
    BlogContentProps["posts"]
  >(() => posts.slice(0, 4));
  const [sortOrder, setSortOrder] = useState("date");
  const loaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const tags = useMemo(() => {
    const tagsMap: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        tagsMap[tag] = (tagsMap[tag] ?? 0) + 1;
      });
    });
    return tagsMap;
  }, [posts]);

  const sortedTags = useMemo(() => sortTagsByCount(tags), [tags]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (sortOrder === "date") {
      result = result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortOrder === "views") {
      result = result.sort((a, b) => b.views - a.views);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
      );
    }

    if (selectedTag) {
      result = result.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    return result;
  }, [searchQuery, selectedTag, posts, sortOrder]);

  useEffect(() => {
    setDisplayedPosts(filteredPosts.slice(0, postsPerPage));
  }, [filteredPosts, postsPerPage]);

  const isLastPage = displayedPosts.length >= filteredPosts.length;

  const loadMorePosts = useCallback(() => {
    if (isLoading || displayedPosts.length >= filteredPosts.length) return;

    setIsLoading(true);
    setTimeout(() => {
      setDisplayedPosts((prev) => [
        ...prev,
        ...filteredPosts.slice(prev.length, prev.length + postsPerPage),
      ]);
      setIsLoading(false);
    }, 300);
  }, [displayedPosts.length, filteredPosts, isLoading, postsPerPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 10px 0px" }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [loadMorePosts]);

  const handleTagClick = useCallback((tagName: string) => {
    setSelectedTag((prev) => (prev === tagName ? "" : tagName));
  }, []);

  return (
    <>
      <section className="mt-16 md:mt-40 mb-10 md:mb-16 container">
        <AnimatedPageHeader
          icon="📖"
          title="The Blog"
          action={
            <div className="relative w-full max-w-[550px] mt-5 mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <input
                className="bg-[#111111] w-full font-bebas-neue border-[#3A3A3A] border rounded-full py-2 pl-10 sm:pl-12 pr-4 text-base sm:text-lg placeholder:text-[#888] focus:outline-none focus:border-[#4A4A4A] transition-colors"
                placeholder="SEARCH...."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          }
        >
            please read if you need, I made 3-5 minutes reader for you
        </AnimatedPageHeader>
      </section>

      <section>
        <hr className="border-[#ACACAC]/20 mt-10 text-center mx-auto" />
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 container">
          <aside className={`w-full md:w-1/4 order-1 md:order-2 ${!isLastPage && "border-b"} md:border-b-0 md:border-l border-[#ACACAC]/20 px-0 md:px-8 pb-6 md:pb-0`}>
            <div className="py-6 md:py-12 md:sticky md:top-24">
              <div className="relative w-full md:w-54">
                <select
                  className="bg-[#111111] border-[#3A3A3A] border-2 rounded-lg py-3 pl-3 pr-10 transition-colors placeholder:text-[#888] focus:outline-none ring-offset-background focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-neutral-950 appearance-none w-full"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="date">📅 Sort by Date</option>
                  <option value="views">👁️ Sort by Views</option>
                </select>
                <ChevronsUpDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>

              <div className="mt-5">
                <h2 className="font-bold text-xl font-rethink">Choose Topics</h2>
                <div className="flex flex-wrap items-baseline justify-start gap-2 mt-8">
                  {sortedTags.map((tag, index) => (
                    <Badge
                      key={index}
                      className={`border ${selectedTag === tag ? "border-white bg-[#393939]/80 text-white" : "border-white/5 hover:border-white/20 bg-[#393939]/40 text-white/30 hover:text-white"} font-bebas-neue text-sm sm:text-base tracking-wide px-3 py-1 cursor-pointer transition-all duration-300`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="w-full md:w-3/4 order-2 md:order-1 pt-0 -mt-5 md:mt-0 md:pt-10">
            {displayedPosts.length > 0 ? (
              <div>
                {displayedPosts.map((post) => (
                  <div key={post.slug}>
                    <BlogItem
                      title={post.title}
                      date={new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      tags={post.tags}
                      description={post.description}
                      views={post.views}
                      image={post.thumbnail}
                      slug={post.slug}
                    />
                  </div>
                ))}

                <div ref={loaderRef} className={isLastPage ? "h-10" : "h-20 flex items-center justify-center my-8"}>
                  {!isLastPage && displayedPosts.length < filteredPosts.length && (
                    <div className="w-8 h-8 border-t-2 border-b-2 border-white/20 rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl text-white/80 mb-2 font-bold font-rethink">No posts found 🧐</h2>
                  <p className="text-base text-white/50 text-center max-w-md">We couldn&apos;t find any blog posts matching your current search criteria.</p>
                </div>
                <div className="w-full max-w-2xl mx-auto rounded-xl border border-[#3A3A3A] bg-[#111111]/60 p-6 ">
                  <div className="flex animate-pulse space-x-4">
                    <div className="w-full space-y-6">
                      <div className="h-4 w-3/4 rounded bg-[#393939]/40"></div>
                      <div className="h-2 rounded bg-[#393939]/30"></div>
                      <div className="h-2 rounded bg-[#393939]/30"></div>
                      <div className="h-2 w-2/3 rounded bg-[#393939]/30"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 w-16 rounded-full bg-[#393939]/40"></div>
                        <div className="h-6 w-16 rounded-full bg-[#393939]/40"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>
    </>
  );
}
