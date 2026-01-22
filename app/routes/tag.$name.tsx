import { posts } from ".velite";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PostItem } from "~/components/post-item";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tag } from "~/components/tag";
import { getAllTags, getPostsByTagSlug, sortTagsByCount } from "~/lib/utils";
import { slug } from "github-slugger";
import NotFound from "~/components/not-found";
import { connectDB, getDB } from "~/lib/db.server.";
import { useEffect } from "react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {  
  if(!data) {
    return [
      { title: "Tag: Not Found" },
      { description: "Tag of my blog" },
    ]
  }

  const { tag } = data;
  return [
    { title: `Tag: ${tag}` },
  ]
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await connectDB();
  const db = getDB();

  const tag = params.name as string;
  const title = tag.split("-").join(" ");
  const displayPosts = getPostsByTagSlug(posts, tag);

  const tags = getAllTags(posts);
  const sortedTags = sortTagsByCount(tags);
  const postViews = await db.collection("posts").find().toArray();


  return json({
    tag,
    title,
    displayPosts,
    sortedTags,
    tags,
    postViews
  });
};


export default function TagPage() {
  const { tag, title, displayPosts, sortedTags, tags, postViews } = useLoaderData<typeof loader>();



  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-black text-2xl font-helvetica capitalize">
            Tag: {title}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-8">
        <div className="col-span-12 col-start-1 sm:col-span-8">
          <hr />
          {displayPosts?.length > 0 ? (
            <ul className="flex flex-col">
              {displayPosts.map((post: any) => {
                const { slug, date, title, description, tags } = post;
                return (
                  <li key={slug}>
                    <PostItem
                      slug={slug}
                      date={date}
                      title={title}
                      description={description}
                      tags={tags}
                      views={postViews.find((view: any) => view.slug === post.slug.replace(/^blog\//, ""))?.viewCount || 0}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Nothing to see here yet</p>
          )}
        </div>
        <Card className="col-span-12 row-start-3 h-fit sm:col-span-4 sm:col-start-9 sm:row-start-1">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {sortedTags?.map((t) => (
              <Tag tag={t} key={t} count={tags[t]} current={slug(t) === tag} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <NotFound />;
}
