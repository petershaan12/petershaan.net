import { posts } from ".velite";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";  
import { useLoaderData, Meta, Links, useRouteError } from "@remix-run/react";  
import { MDXContent } from "~/components/mdx-component";
import NotFound from "~/components/not-found";
import { Tag } from "~/components/tag";
import { connectDB, getDB } from "~/lib/db.server.";
import "../../public/styles/mdx.css";

export const meta: MetaFunction<typeof loader> = ({ data }) => {  
  if (!data || !data.post) {    
    return [    
      { title: "Not Found" },    
      { name: "description", content: "The post you are looking for does not exist." },    
      { property: "og:title", content: "Not Found" },    
      { property: "og:description", content: "The post you are looking for does not exist." },    
      { property: "og:type", content: "website" },    
      { name: "twitter:card", content: "summary" },    
      { name: "twitter:title", content: "Not Found" },    
      { name: "twitter:description", content: "The post you are looking for does not exist." },    
    ];    
  }    
    
  const { post } = data;  
  const ogSearchParams = new URLSearchParams();  
  ogSearchParams.set("title", post.title);  
  
  return [    
    { title: post.title },    
    { name: "description", content: post.description || "No description available." },      
    { property: "og:title", content: post.title },    
    { property: "og:description", content: post.description || "No description available." },    
    { property: "og:type", content: "article" },    
    { property: "og:url", content: post.url },    
    { property: "og:image", content: `/api/og?${ogSearchParams.toString()}` },    
    { property: "og:image:width", content: "1920" },    
    { property: "og:image:height", content: "1080" },    
    { property: "og:image:alt", content: post.title },    
    { name: "twitter:card", content: "summary_large_image" },    
    { name: "twitter:title", content: post.title },    
    { name: "twitter:description", content: post.description || "No description available." },    
    { name: "twitter:image", content: `/api/og?${ogSearchParams.toString()}` },    
  ];    
};  

export const loader = async ({ params }: LoaderFunctionArgs) => {  
  await connectDB();
  const db = getDB();
  const slug = params.slug as string;
  const post = posts.find((post) => post.slugAsParams === slug);  

  if (!post || !post.published) {  
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });  
  }  

  const postViews = await db.collection("posts").findOne({ slug });  
  
  let views = 0;  
  if (postViews) {  
    views = postViews.viewCount;  
    await db.collection("posts").updateOne({ slug }, { $inc: { viewCount: 1 } });  
  } else {  
    await db.collection("posts").insertOne({ slug, viewCount: 1 });  
    views = 1;  
  }  
  
  return json<any>({post, views });  
};  
  
  
export default function PostPage() {  
  const { post, views } = useLoaderData<typeof loader>();  
  
  return (  
    <article className="container py-6 prose dark:prose-invert max-w-3xl mx-auto">  
      <Meta />  
      <Links />  
      <h1 className="mb-2 text-2xl font-semibold">{post.title}</h1>  
      <div className="flex gap-2 mb-2">  
        {post.tags?.map((tag: string) => (  
          <Tag tag={tag} key={tag} />  
        ))}  
      </div>  
      {post.description ? (  
        <p className="mt-0 prose prose-neutral dark:prose-invert ">  
          {post.description}  
        </p>  
      ) : null}  
      <div className="flex items-center space-x-4">  
        {views !== null ? `${views} views` : "Loading views..."}  
      </div>  
      <hr className="my-4" />  
      <MDXContent code={post.body} />  
    </article>  
  );  
}  

export function ErrorBoundary() {
  return <NotFound />;
}