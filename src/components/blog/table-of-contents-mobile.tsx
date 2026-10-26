"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IoMdClose } from "react-icons/io";
import { CiBoxList } from "react-icons/ci";

interface TOCItem {
  id: string;
  title: string;
  level: number;
  active?: boolean;
}

export function TableOfContentsMobile() {
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const toggleTOCMobile = () => setIsTOCOpen(!isTOCOpen);
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
    <>
      {/* Toggle button */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl px-3 py-2 fixed right-5 bottom-5 w-auto border border-[#3A3A3A] hover:cursor-pointer rounded-lg z-39 transition-transform duration-300 ease-in-out font-rethink">
        <button
          onClick={toggleTOCMobile}
          className="focus:outline-none flex items-center gap-2 text-xs hover:cursor-pointer"
        >
          <CiBoxList /> Table Of Contents
        </button>
      </div>

      {/* Bottom slide-up TOC container */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 bg-[#0A0A0A]/90 border-t border-[#3A3A3A] backdrop-blur-2xl rounded-t-lg shadow-lg transition-transform duration-300 ease-in-out transform font-rethink",
          isTOCOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex justify-between items-center px-10 py-4">
          <h3 className="font-bold text-white">Table of Contents</h3>
          <button
            onClick={toggleTOCMobile}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <IoMdClose className="text-xl" />
          </button>
        </div>

        <div className="px-10 max-h-96 pb-5 scrollbar overflow-y-auto">
          <ul className="space-y-3">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={cn(
                  "text-sm transition-colors",
                  heading.level === 3 ? "ml-6" : "",
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
                    setIsTOCOpen(false); // Close TOC after clicking
                  }}
                >
                  {heading.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
