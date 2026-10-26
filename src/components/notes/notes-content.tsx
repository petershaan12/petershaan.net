"use client";
import NoteItem from "./note-item";
import { Badge } from "@/components/ui/badge";
import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sortTagsByCount } from "@/lib/utils";
import AnimatedPageHeader from "@/components/animated-page-header";

interface NotesContentProps {
  notes: Array<{
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: Array<string>;
    views: number;
  }>;
}

export default function NotesContent({ notes }: NotesContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [notesPerPage] = useState(9);
  // Seeded from props so the server HTML lists notes — an empty first render reads as a soft 404 to crawlers
  const [displayedNotes, setDisplayedNotes] = useState<NotesContentProps["notes"]>(() => notes.slice(0, 9));
  const loaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const tags = useMemo(() => {
    const tagsMap: Record<string, number> = {};
    notes.forEach((note) => {
      note.tags?.forEach((tag) => {
        tagsMap[tag] = (tagsMap[tag] ?? 0) + 1;
      });
    });
    return tagsMap;
  }, [notes]);

  const sortedTags = useMemo(() => sortTagsByCount(tags), [tags]);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.description.toLowerCase().includes(query)
      );
    }

    if (selectedTag) {
      result = result.filter((note) =>
        note.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    return result;
  }, [searchQuery, selectedTag, notes]);

  useEffect(() => {
    setDisplayedNotes(filteredNotes.slice(0, notesPerPage));
  }, [filteredNotes, notesPerPage]);

  const isLastPage = displayedNotes.length >= filteredNotes.length;

  const loadMoreNotes = useCallback(() => {
    if (isLoading || displayedNotes.length >= filteredNotes.length) return;

    setIsLoading(true);
    setTimeout(() => {
      setDisplayedNotes((prev) => [
        ...prev,
        ...filteredNotes.slice(prev.length, prev.length + notesPerPage),
      ]);
      setIsLoading(false);
    }, 300);
  }, [displayedNotes.length, filteredNotes, isLoading, notesPerPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreNotes();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 10px 0px" }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) observer.observe(currentLoaderRef);
    return () => {
      if (currentLoaderRef) observer.unobserve(currentLoaderRef);
    };
  }, [loadMoreNotes]);

  const handleTagClick = useCallback((tagName: string) => {
    setSelectedTag((prev) => (prev === tagName ? "" : tagName));
  }, []);

  return (
    <>
      <section className="mt-16 md:mt-40 mb-10 md:mb-16 container">
        <AnimatedPageHeader
          icon="📝"
          title="Notes"
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
          short notes, quick thoughts, things i find useful
        </AnimatedPageHeader>
      </section>

      <section>
        <hr className="border-[#ACACAC]/20 mt-10 text-center mx-auto" />
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 container">
          <aside className={`w-full md:w-1/4 order-1 md:order-2 ${!isLastPage && "border-b"} md:border-b-0 md:border-l border-[#ACACAC]/20 px-0 md:px-8 pb-6 md:pb-0`}>
            <div className="py-6 md:py-12 md:sticky md:top-24">
              <h2 className="font-bold text-xl font-rethink">Topics</h2>
              <div className="flex flex-wrap items-baseline justify-start gap-2 mt-8">
                {sortedTags.map((tag, index) => (
                  <Badge
                    key={index}
                    className={`border cursor-pointer font-bebas-neue text-sm sm:text-base tracking-wide px-3 py-1 transition-all duration-300 ${
                      selectedTag === tag
                        ? "border-white bg-[#393939]/80 text-white"
                        : "border-white/5 hover:border-white/20 bg-[#393939]/40 text-white/30 hover:text-white"
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>

          <main className="w-full md:w-3/4 order-2 md:order-1 pt-0 -mt-5 md:mt-0 md:pt-10 pb-20">
            {displayedNotes.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {displayedNotes.map((note, i) => (
                    <NoteItem
                      key={note.slug}
                      index={i}
                      title={note.title}
                      date={new Date(note.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      tags={note.tags}
                      description={note.description}
                      slug={note.slug}
                      views={note.views}
                      faded={hoveredSlug !== null && hoveredSlug !== note.slug}
                      isActive={hoveredSlug === note.slug}
                      onHover={setHoveredSlug}
                    />
                  ))}
                </div>

                <div ref={loaderRef} className={isLastPage ? "h-10" : "h-20 flex items-center justify-center mt-8"}>
                  {!isLastPage && displayedNotes.length < filteredNotes.length && (
                    <div className="w-8 h-8 border-t-2 border-b-2 border-white/20 rounded-full animate-spin" />
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl text-white/80 mb-2 font-bold font-rethink">No notes found 🧐</h2>
                  <p className="text-base text-white/50 text-center max-w-md">We couldn&apos;t find any notes matching your current search criteria.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex flex-col justify-between rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] p-5 min-h-[200px]">
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-3/4 rounded-lg bg-[#393939]/40" />
                        <div className="h-3 rounded bg-[#393939]/30" />
                        <div className="h-3 w-5/6 rounded bg-[#393939]/30" />
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
                        <div className="flex gap-2">
                          <div className="h-5 w-12 rounded-md bg-[#393939]/40" />
                          <div className="h-5 w-16 rounded-md bg-[#393939]/30" />
                        </div>
                        <div className="h-3 w-10 rounded bg-[#393939]/30" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </section>
    </>
  );
}
