"use client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { LuEye } from "react-icons/lu";
import { MdDateRange } from "react-icons/md";
import { useState } from "react";
import Link from "next/link";
import { pageAnimation } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface BlogItemProps {
  title: string;
  date: string;
  tags?: Array<string>;
  description: string;
  views?: number;
  image: string;
  slug: string;
}
export default function BlogItem({
  title,
  date,
  tags,
  description,
  views,
  image,
  slug,
}: BlogItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    pageAnimation();
    setTimeout(() => {
      router.push(path);
    }, 700);
  };

  return (
    <Link
      href={`/${slug}`}
      onClick={(e) => {
        e.preventDefault();
        handleNavigation(`/${slug}`);
      }}
    >
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b mt-5 border-[#ACACAC]/40 pb-6 sm:pb-10 hover:cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full sm:w-3/4 order-2 md:order-1">
          <h2
            className="w-fit text-lg sm:text-xl transition-all duration-300 py-0.5 font-rethink font-bold"
            style={{
              background: isHovered
                ? "radial-gradient(circle, rgba(228,255,118, 0.5) 0%, rgba(16,16,26,0.7) 100%)"
                : "transparent",
            }}
          >
            {title}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.isArray(tags) &&
              tags.map((tag, index) => (
                <Badge
                  key={index}
                  className="border border-white/20 bg-[#393939]/40 font-bebas-neue text-white text-sm sm:text-base tracking-wide"
                >
                  {tag}
                </Badge>
              ))}
          </div>
          <p className="mb-2 sm:mb-3 mt-2 text-gray-400 text-sm sm:text-base">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
              <MdDateRange className="text-primary" />
              <p> {date}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
              <LuEye className="text-primary" /> {views} Views
            </div>
          </div>
        </div>
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          unoptimized
          className="rounded-xl w-full sm:w-32 md:w-64 mt-4 h-32 sm:mt-0 object-cover order-1 md:order-2"
          style={{ objectFit: "cover" }}
        />
      </div>
    </Link>
  );
}
