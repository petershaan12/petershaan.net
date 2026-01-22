import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getAllTags, sortPosts, sortTagsByCount } from "~/lib/utils";
import { posts } from ".velite";
import { Tag } from "~/components/tag";
import { PostItem } from "~/components/post-item";
import { QueryPagination } from "~/components/query-pagination";
import { connectDB, getDB } from "~/lib/db.server.";

const POSTS_PER_PAGE = 5;

export const meta: MetaFunction = () => {
  return [
      { title: "My Blog" },
      { description: "All My blog" },
  ]
};

export const loader = async ({ request }: { request: Request }) => {
  await connectDB();
  const db = getDB();
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");

  const sortedPosts = sortPosts(posts.filter((post) => post.published));
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const tags = getAllTags(posts);
  const sortedTags = sortTagsByCount(tags);

  const displayPosts = sortedPosts.slice(
    POSTS_PER_PAGE * (page - 1),
    POSTS_PER_PAGE * page
  );
  
  const postViews = await db.collection("posts").find().toArray();

  return json({ displayPosts, totalPages, sortedTags, tags, currentPage: page, postViews });
};

export default function Blog() {
  const { displayPosts, totalPages, sortedTags, tags, currentPage, postViews } =
    useLoaderData<typeof loader>();

  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <p className="prose prose-neutral dark:prose-invert">
          please read if you need, I made 3-5 minutes reader for you
        </p>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-8">
        <div className="col-span-12 col-start-1 sm:col-span-8">
          <hr />
          {displayPosts?.length > 0 ? (
            <ul className="flex flex-col">
              {displayPosts.map((post) => {
                const { slug, date, title, description, tags } = post;
                return (
                    <li key={slug}>
                    <PostItem
                      slug={slug}
                      date={date}
                      title={title}
                      description={description}
                      tags={tags}
                      views={postViews.find((view: any) => view.slug === slug.replace(/^blog\//, ""))?.viewCount || 0}
                    />
                    </li>
                );
              })}
            </ul>
          ) : (
            <p>Nothing to see here yet</p>
          )}
          <QueryPagination
            totalPages={totalPages}
            currentPage={currentPage}
            className="justify-end mt-4"
          />
        </div>
        <Card className="col-span-12 row-start-3 h-fit sm:col-span-4 sm:col-start-9 sm:row-start-1">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {sortedTags?.map((tag) => (
              <Tag tag={tag} key={tag} count={tags[tag]} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
