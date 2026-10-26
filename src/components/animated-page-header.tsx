"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const headerItem = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

interface AnimatedPageHeaderProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function AnimatedPageHeader({
  icon,
  title,
  children,
  action,
}: AnimatedPageHeaderProps) {
  return (
    <motion.div
      className="max-w-3xl mx-auto text-center"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.08,
          },
        },
      }}
    >
      <motion.div
        className="relative"
        variants={headerItem}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="px-3 pb-1 bg-[#393939]/28 border border-white/20 text-xl md:text-4xl w-fit rounded-lg pt-0">
          {icon}
        </span>
      </motion.div>
      <motion.h1
        className="mt-6 md:mt-10 text-2xl md:text-3xl"
        variants={headerItem}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-gradient" data-text={title}>
          {title}
        </span>
      </motion.h1>
      <motion.p
        className="text-sm sm:text-base transition-colors bg-gradient-to-r from-gray-400/[35%] via-gray-400/90 to-gray-400/[35%] bg-clip-text text-transparent text-center"
        variants={headerItem}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.p>
      {action ? (
        <motion.div
          variants={headerItem}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {action}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
