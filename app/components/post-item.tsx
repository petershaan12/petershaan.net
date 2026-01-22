import { Calendar } from "lucide-react";
import { formatDate } from "~/lib/utils";
import { Tag } from "./tag";
import { Link } from "@remix-run/react";

interface PostItemProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: Array<string>;
  views?: string;
}

export function PostItem({
  slug,
  title,
  description,
  date,
  tags,
  views,
}: PostItemProps) {
  return (
    <article className="flex flex-col gap-2 border-border border-b py-3">
      <div>
        <h2 className=" font-semibold ">
          <Link to={"/" + slug}>{title}</Link>
        </h2>
      </div>
      <div className="flex gap-2">
        {tags?.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
      <div className="max-w-none prose prose-neutral dark:prose-invert  ">
        {description}
      </div>
      <div className="flex justify-between items-center">
        <dl>
          <dt className="sr-only">Published On</dt>
          <dd className="prose prose-neutral dark:prose-invert text-sm flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={date}>{formatDate(date)}</time>
          </dd>
        </dl>
        <span className="flex items-center prose prose-neutral dark:prose-invert text-sm">
         {views} views
        </span>
      </div>
    </article>
  );
}
