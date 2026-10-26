"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { pageAnimation } from "@/lib/utils";
import AnimatedPageHeader from "@/components/animated-page-header";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description?: string;
  tech?: string[];
  image?: string;
  logo?: string;
  slugAsParams: string;
  detail?: boolean;
  live?: string;
}

interface ProjectsContentProps {
  projects: Project[];
}

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState("");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleNavigation = (path: string) => {
    pageAnimation();
    setTimeout(() => router.push(path), 700);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const rotateX = (y - 0.5) * -14;
    const rotateY = (x - 0.5) * 14;

    setTransform(
      `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
    );
    setGlowPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <a
      ref={cardRef}
      target={project.detail ? "_self" : "_blank"}
      onClick={(e) => {
        if (project.detail) {
          e.preventDefault();
          handleNavigation(`/projects/${project.slugAsParams}`);
        }
      }}
      href={project.detail ? `/projects/${project.slugAsParams}` : project.live}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl border border-[#4B4B4B] bg-[#0A0A0A]/60 p-6 flex h-full flex-col overflow-hidden hover:cursor-pointer
        ${project.image ? "min-h-[460px] md:row-span-2 md:min-h-0" : "min-h-[220px]"}`}
      style={{
        transform,
        transition: transform.includes("0deg")
          ? "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
          : "transform 0.1s ease-out",
        willChange: "transform",
      }}
    >
      {/* Mouse-follow glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          background: `radial-gradient(220px circle at ${glowPos.x}% ${glowPos.y}%, rgba(228,255,118,0.07), transparent 70%)`,
        }}
      />

      <div className="flex items-center justify-between relative">
        <div>
          <h2 className="font-bold text-lg sm:text-xl font-rethink">
            {project.title}
          </h2>
          <div className="flex gap-2 mt-2 flex-wrap pr-3">
            {project.tech?.map((tech: string, i: number) => (
              <Badge
                key={i}
                className="border border-white/20 bg-[#393939]/40 font-bebas-neue text-white text-sm sm:text-base tracking-wide"
              >
                {tech}
              </Badge>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4">{project.description}</p>
        </div>
        {project.logo && (
          <Image
            src={project.logo}
            alt={project.title}
            width={100}
            height={100}
            className="object-contain"
          />
        )}
      </div>

      {project.image && (
        <div className="flex-1 min-h-0 mt-5 p-0 overflow-hidden rounded-xl relative">
          <Image
            width={500}
            height={500}
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </a>
  );
}

export default function ProjectsContent({ projects }: ProjectsContentProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  const cardTransition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
  const cardViewport = { once: true, amount: 0.25 };

  return (
    <>
      <section className="mt-16 md:mt-40 mb-10 md:mb-16 container">
        <AnimatedPageHeader icon="💵" title="Projects">
          A collection of tools and sites <br /> I&apos;ve created, designed to
          be helpful, fun,
        </AnimatedPageHeader>
      </section>
      <section className="mt-20 px-4 sm:px-6 md:px-24 container">
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[220px] gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.slugAsParams}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={cardViewport}
              transition={{ ...cardTransition, delay: (idx % 3) * 0.12 }}
              className={`${project.image ? "min-h-[460px] md:row-span-2 md:min-h-0" : "min-h-[220px]"}`}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
