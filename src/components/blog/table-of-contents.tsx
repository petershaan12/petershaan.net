"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  title: string;
  level: number;
  active?: boolean;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headingsFrame = requestAnimationFrame(() => {
      const elements = Array.from(
        document.querySelectorAll("article h2, article h3")
      );

      const items: TOCItem[] = elements.map((element) => ({
        id: element.id,
        title: element.textContent || "",
        level: element.tagName === "H2" ? 2 : 3,
      }));

      setHeadings(items);
    });

    const handleScroll = () => {
      let ticking = false;
      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const headingElements = Array.from(
              document.querySelectorAll("article h2, article h3")
            );

            const scrollPosition = window.scrollY;
            const offset = 100;

            for (let i = headingElements.length - 1; i >= 0; i--) {
              const headingElement = headingElements[i] as HTMLElement;
              if (headingElement.offsetTop <= scrollPosition + offset) {
                setActiveId(headingElement.id);
                break;
              }
            }
            ticking = false;
          });
          ticking = true;
        }
      };
    };

    const throttledScrollHandler = handleScroll();
    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
    throttledScrollHandler();
    return () => {
      cancelAnimationFrame(headingsFrame);
      window.removeEventListener("scroll", throttledScrollHandler);
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="toc-container sticky top-24 border border-[#3A3A3A] rounded-lg bg-[#0A0A0A] mt-5 shadow-lg py-4 font-rethink">
      <div className="p-4 max-h-96 scrollbar overflow-y-auto">
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(
                "text-sm transition-colors",
                heading.level === 3 ? "ml-3" : "",
                activeId === heading.id
                  ? "text-primary font-bold"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <Link
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const safeId = CSS.escape(heading.id);
                  document.querySelector(`#${safeId}`)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                {heading.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
