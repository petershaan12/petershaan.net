"use client";
import Image from "next/image";
import { useRef } from "react";
import BlogItem from "../blog/blog-item";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";

interface BlogContentProps {
  posts: Array<{
    title: string;
    date: string;
    name: string;
    tags: Array<string>;
    description: string;
    slug: string;
    thumbnail: string;
    views: number;
  }>;
}

export default function SecondContent({
  posts,
}: {
  posts: BlogContentProps["posts"];
}) {
  const marqueeRef = useRef(null);
  const techStacks = [
    { src: "/icon/next_dark.png", alt: "nextjs", name: "Next.js" },
    { src: "/icon/fastapi.svg", alt: "fastapi", name: "FastAPI" },
    { src: "/icon/go.png", alt: "golang", name: "Golang" },
    { src: "/icon/postgres.png", alt: "postgres", name: "Postgres" },
    { src: "/icon/remix.png", alt: "remix", name: "Remix" },
    { src: "/icon/tailwind.png", alt: "tailwind", name: "Tailwind" },
    { src: "/icon/react.webp", alt: "react", name: "React" },
    { src: "/icon/mongo.png", alt: "mongodb", name: "MongoDB" },
    { src: "/icon/laravel.png", alt: "laravel", name: "Laravel" },
    { src: "/icon/claude.png", alt: "claude", name: "Claude 3.7" },
    { src: "/icon/shadcn.png", alt: "shadcn", name: "Shadcn" },
    { src: "/icon/wordpress.webp", alt: "wordpress", name: "Wordpress" },
    { src: "/icon/figma.png", alt: "figma", name: "Figma" },
  ];

  interface TechItemProps {
    src: string;
    alt: string;
    name: string;
  }

  const TechItem = ({ src, alt, name }: TechItemProps) => (
    <div className="flex items-center gap-3 mx-6 sm:mx-8 md:mx-10">
      <Image
        src={src}
        alt={alt}
        width={100}
        height={100}
        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
      />
      <p className="text-xs sm:text-sm">{name}</p>
    </div>
  );

  const sectionVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -28, filter: "blur(8px)" },
    show: { opacity: 1, x: 0, filter: "blur(0px)" },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 28, filter: "blur(8px)" },
    show: { opacity: 1, x: 0, filter: "blur(0px)" },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
    show: { opacity: 1, scale: 1, filter: "blur(0px)" },
  };

  const viewport = { once: true, amount: 0.28 };
  const transition = { duration: 0.58, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return (
    <>
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-center mb-12 md:mb-16 container"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.p
          className="max-w-lg mx-auto md:mx-0 text-center md:text-left"
          variants={fadeLeft}
          transition={transition}
        >
          Hello guys! 👋, my name is peter and I am a software engineer,
          passionate about design, video editing, and also programming
        </motion.p>
        <motion.div
          className="flex justify-center md:justify-end"
          variants={fadeRight}
          transition={{ ...transition, duration: 0.72 }}
        >
          <Image
            src="/icon/cloud.webp"
            alt="cloud"
            width={500}
            height={500}
            className="rounded-full w-48 sm:w-56 md:w-64 lg:w-80 xl:w-96"
          />
        </motion.div>
      </motion.section>
      <motion.section
        className="mt-8 md:mt-12 container"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.h2
          className="text-base md:text-4xl"
          variants={fadeLeft}
          transition={transition}
        >
          <span className="judul">my stacks</span> 🚀
        </motion.h2>
        <motion.div
          className="w-full overflow-hidden relative my-12 sm:my-16 md:my-24"
          variants={scaleIn}
          transition={{ ...transition, duration: 0.72 }}
        >
          <div className="absolute left-0 top-0 h-full w-12 sm:w-16 md:w-24 z-10 pointer-events-none bg-gradient-to-r from-[#0A0A0A] to-transparent"></div>
          <div ref={marqueeRef} className="animate-marquee flex">
            {techStacks.map((tech, index) => (
              <TechItem key={`tech-${index}`} {...tech} />
            ))}
            {techStacks.map((tech, index) => (
              <TechItem key={`tech-${index}`} {...tech} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-12 sm:w-16 md:w-24 z-10 pointer-events-none bg-gradient-to-l from-[#0A0A0A] to-transparent"></div>
        </motion.div>
      </motion.section>
      <motion.section
        className="mt-8 md:mt-12 container"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.div variants={fadeUp} transition={transition}>
          <h2 className="text-base md:text-4xl">
            <span className="judul judul-blog">1% everyday</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:w-auto w-32">
            my blog that mybe you want to read
          </p>
        </motion.div>
        <motion.div
          className="my-16 sm:my-20 md:my-32"
          variants={sectionVariants}
        >
          {posts.map((post, index) => (
            <motion.div key={index} variants={fadeUp} transition={transition}>
              <BlogItem
                title={post.title}
                date={new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                tags={post.tags}
                description={post.description}
                views={post.views}
                image={post.thumbnail}
                slug={post.slug}
              />
            </motion.div>
          ))}
          <motion.div
            variants={fadeUp}
            transition={transition}
          >
            <Link
              href="/blog"
              className="flex items-center justify-center mt-5 gap-2 text-xs sm:text-sm "
            >
              <span>See more blog</span>
              <div className=" hover:underline bg-[#393939]/28 backdrop-blur-2xl py-1 px-2 text-base sm:text-lg border-1 border-white/20 rounded-lg tracking-widest flex items-center hover:bg-[#393939]/40 hover:border-white/30 transition-all duration-300">
                <FaArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
      <motion.section
        className="mt-8 md:mt-12 mb-12 md:mb-16 container"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.div variants={fadeUp} transition={transition}>
          <h2 className="text-base md:text-4xl">
            <span className="judul judul-sosmed">Don&#39;t be a Stranger</span>{" "}
            😁
          </h2>
          <p className="mt-2 text-xs sm:text-sm">
            connect with me online{" "}
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-7 font-bebas-neue text-lg sm:text-xl mt-6 sm:mt-10 max-w-md"
          variants={sectionVariants}
        >
          <motion.a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Peter Shaan's LinkedIn profile"
            className="flex items-center gap-2"
            variants={fadeLeft}
            transition={transition}
          >
            <span>💼</span> <span className="hover:underline">LINKEDIN</span>
          </motion.a>
          <motion.a
            href={siteConfig.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Peter Shaan's YouTube channel"
            className="flex items-center gap-2"
            variants={fadeLeft}
            transition={transition}
          >
            <span>🎬</span> <span className="hover:underline">YOUTUBE</span>
          </motion.a>
          <motion.a
            href={siteConfig.links.pinterest}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Peter Shaan's Pinterest profile"
            className="flex items-center gap-2"
            variants={fadeLeft}
            transition={transition}
          >
            <span>🎨</span> <span className="hover:underline">PINTEREST</span>
          </motion.a>
          <motion.a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Peter Shaan's GitHub profile"
            className="flex items-center gap-2"
            variants={fadeLeft}
            transition={transition}
          >
            <span>💻</span> <span className="hover:underline">GITHUB</span>
          </motion.a>
          <motion.a
            href={siteConfig.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Peter Shaan's Instagram profile"
            className="flex items-center gap-2"
            variants={fadeLeft}
            transition={transition}
          >
            <span>📸</span> <span className="hover:underline">INSTAGRAM</span>
          </motion.a>
        </motion.div>
      </motion.section>
    </>
  );
}
