import { notFound } from "next/navigation";
import { MDXContent } from "@/components/blog/mdx-component";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { LuEye, LuGithub, LuExternalLink, LuArrowLeft } from "react-icons/lu";
import ReportView from "./view";
import { connectDB, getDB } from "@/lib/mongodb";
import BlogComments from "@/components/blog/blog-comments";
import LikeButton from "@/components/blog/like-button";
import { MdOutlinePersonOutline } from "react-icons/md";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TableOfContentsMobile } from "@/components/blog/table-of-contents-mobile";
import Link from "next/link";
import PaperBackground from "@/components/paper-background";
import { getProjectBySlug } from "@/lib/content";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

async function getProjectFromParams({ slug }: { slug: string[] }) {
    const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
    const normalizedSlug = slugPath.replace(/^project\//, "");

    return getProjectBySlug(normalizedSlug);
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProjectFromParams({ slug });

    if (!project || !project.published || !project.detail) {
        return {};
    }

    const ogSearchParams = new URLSearchParams();
    ogSearchParams.set("title", project.title);

    return {
        title: project.title,
        description: project.description,
        authors: { name: siteConfig.author },
        keywords: [
            "peter shaan",
            "petershaan project",
            "peter shaan portfolio",
            project.title,
            ...(project.tech ?? []),
        ],
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: `/projects/${project.slugAsParams}`,
        },
        openGraph: {
            title: project.title,
            description: project.description,
            type: "article",
            url: `/projects/${project.slugAsParams}`,
            images: [
                {
                    url: `/api/og?${ogSearchParams.toString()}`,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: project.title,
            description: project.description,
            images: [`/api/og?${ogSearchParams.toString()}`],
        },
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProjectFromParams({ slug });

    if (!project || !project.published || !project.detail) {
        notFound();
    }

    const postViews = { countViews: 0 };
    const postLikes = { countLikes: 0 };

    try {
        await connectDB();
        const db = getDB();
        const postDoc = await db
            .collection("posts")
            .findOne({ slug: `project/${project.slugAsParams}` });
        if (postDoc) {
            postViews.countViews = postDoc.viewCount ?? postDoc.views ?? 0;
            postLikes.countLikes = postDoc.likeCount ?? 0;
        }
    } catch (error) {
        console.error("Failed to fetch project views/likes:", error);
    }

    return (
        <>
            <ReportView slug={`project/${project.slugAsParams}`} />
            <Navbar />
            <PaperBackground
                label="Projects"
                title={project.title}
                date={project.date ? new Date(project.date).toLocaleDateString() : ""}
                className="[mask-image:linear-gradient(to_bottom,black_0%,black_26%,transparent_72%)]"
            />
            <main className="mt-36 md:mt-48 container">
                {/* Tech Stack */}
                {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech, index) => (
                            <Badge
                                key={index}
                                className="border border-white/20 bg-[#393939]/50 text-white/50 backdrop-blur-sm font-bebas-neue text-xs sm:text-sm tracking-wide px-2 py-1 cursor-pointer transition-all duration-300"
                            >
                                {tech}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="mb-2 text-2xl sm:text-3xl font-extrabold  md:text-4xl font-rethink">
                    {project.title}
                </h1>

                {/* Description */}
                {project.description && (
                    <p className="mt-0 text-gray-400 text-sm sm:text-base">
                        {project.description}
                    </p>
                )}

                {/* Views and Likes */}
                <div className="mt-6">
                    <hr className="my-3 text-[#ACACAC]/40" />
                    <div className="flex flex-wrap gap-2 items-center md:justify-between ">
                        <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
                            {
                                project.type && (
                                    <div className="flex items-center gap-1">
                                        <MdOutlinePersonOutline className="text-primary" /> {project.type}
                                    </div>
                                )
                            }
                            <div className="flex items-center gap-1">
                                <LuEye className="text-primary" /> {postViews.countViews} Views
                            </div>
                            <LikeButton
                                slug={`project/${project.slugAsParams}`}
                                initialLikes={postLikes.countLikes}
                            />
                        </div>
                        <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
                            {project.repository && (
                                <a
                                    href={`https://github.com/${project.repository}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                                >
                                    <LuGithub className="w-4 h-4" />
                                    <span>{project.repository}</span>
                                </a>
                            )}
                            {project.live && (
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                                >
                                    <LuExternalLink className="w-4 h-4" />
                                    <span>Live Demo</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <hr className="my-3 text-[#ACACAC]/40" />
                </div>

                {/* MDX Content with Table of Contents */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-10">
                    <article className="mt-4 prose prose-invert prose-base mx-auto max-w-full prose-project">
                        <MDXContent code={project.body} />
                    </article>

                    <div className="hidden lg:block">
                        <TableOfContents />
                    </div>
                </div>

                {/* Comments */}
                <BlogComments slug={`project/${project.slugAsParams}`} />

                <Link href="/projects" className="mt-4 flex items-center gap-2 underline hover:text-primary text-gray-400">
                    <LuArrowLeft />   Back to Projects
                </Link>

                <div className="lg:hidden block">
                    <TableOfContentsMobile />
                </div>
            </main>
            <Footer />
        </>
    );
}
