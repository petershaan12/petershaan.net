import { slug } from "github-slugger";
import { badgeVariants } from "./ui/badge";
import { Link } from "@remix-run/react";

interface TagProps {
  tag: string;
  current?: boolean;
  count?: number;
}
export function Tag({ tag, current, count }: TagProps) {
  return (
    <Link
      className={badgeVariants({
        variant: current ? "default" : "secondary",
        className:
          "rounded-full bg-green-200 px-3 py-1 text-xs text-green-800 font-semibold hover:text-white hover:bg-green-600 dark:hover:text-white dark:hover:bg-green-600  dark:bg-green-950 dark:text-green-400",
      })}
      to={`/tag/${slug(tag)}`}
    >
      {tag} {count ? `(${count})` : null}
    </Link>
  );
}