"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { pageAnimation } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { LuEye } from "react-icons/lu";

interface NoteItemProps {
  title: string;
  date: string;
  tags?: Array<string>;
  description: string;
  slug: string;
  index: number;
  views: number;
  faded: boolean;
  isActive: boolean;
  onHover: (slug: string | null) => void;
}

export default function NoteItem({
  title,
  date,
  tags,
  description,
  slug,
  index,
  views,
  faded,
  isActive,
  onHover,
}: NoteItemProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    pageAnimation();
    setTimeout(() => router.push(path), 700);
  };

  return (
    <Link
      href={`/${slug}`}
      onClick={(e) => {
        e.preventDefault();
        handleNavigation(`/${slug}`);
      }}
      onMouseEnter={() => onHover(slug)}
      onMouseLeave={() => onHover(null)}
      className="group relative flex flex-col justify-between rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] p-5 min-h-[200px] overflow-hidden cursor-pointer"
      style={{
        opacity: faded ? 0.35 : 1,
        transform: isActive
          ? "rotate(-1.5deg) scale(1.03)"
          : faded ? "scale(0.98)" : "none",
        filter: faded ? "blur(0.5px)" : "none",
        transition: "opacity 0.3s ease, transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), filter 0.3s ease",
        transformOrigin: "center center",
      }}
    >
      <span className="absolute top-4 right-4 text-xs text-white/10 font-bebas-neue tabular-nums select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex-1">
        <h2 className="text-base sm:text-lg font-bold font-rethink text-white/90 group-hover:text-primary transition-colors duration-300 pr-8 leading-snug">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-xs sm:text-sm text-white/40 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex items-end justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {Array.isArray(tags) &&
            tags.map((tag, i) => (
              <Badge
                key={i}
                className="border border-white/20 bg-[#1e1e1e] text-white font-bebas-neue text-sm tracking-wide px-3 py-1 transition-colors duration-300"
              >
                {tag}
              </Badge>
            ))}
        </div>
        <span className="flex items-center gap-1 text-[10px] sm:text-xs text-white">
          <LuEye className="w-3 h-3 text-primary" /> {views}
        </span>
      </div>
    </Link>
  );
}
