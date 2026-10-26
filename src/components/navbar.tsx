"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  LuBook,
  LuFolderOpen,
  LuCircleUserRound,
  LuHouse,
  LuNotebookPen,
} from "react-icons/lu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { pageAnimation, openPageAnimation } from "@/lib/utils";
import { Badge } from "./ui/badge";


export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const controlNavbar = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (Math.abs(currentScrollY - lastScrollY) > 5) {
      setIsMenuVisible(currentScrollY <= lastScrollY || currentScrollY <= 20);
      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        setIsMenuOpen(false);
      }
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  const throttledControlNavbar = useCallback(() => {
    let ticking = false;
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlNavbar();
          ticking = false;
        });
        ticking = true;
      }
    };
  }, [controlNavbar]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const throttledHandler = throttledControlNavbar();
      window.addEventListener("scroll", throttledHandler, { passive: true });

      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("scroll", throttledHandler);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [throttledControlNavbar]);

  // Handle page transitions
  const handleNavigation = async (path: string) => {
    setIsMenuOpen(false);
    if (pathname === path) {
      await pageAnimation();
      openPageAnimation();
      return;
    }
    await pageAnimation();
    router.push(path);
  };

  return (
    <nav>
      <div
        className="hidden container md:flex justify-between items-end md:items-center bg-[#7B7C85]/10 backdrop-blur-2xl sm:px-8 py-5 fixed left-1/2 top-10 border border-[#53545f] rounded-xl tracking-wide sm:w-[80%] md:w-3/4 lg:w-1/2 transform -translate-x-1/2 z-50"
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Loading..."
            width={50}
            height={50}
            className="w-12 h-10"
          />
          <div className="overflow-hidden">
            <motion.p
              className="font-light uppercase"
              style={{ fontSize: "0.5rem", letterSpacing: "0.2rem" }}
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            >
              Peter Shaan
            </motion.p>
          </div>
        </Link>

        <ul className="hidden md:flex gap-6 font-bebas-neue">
          <li
            className={`cursor-pointer transition-colors ${pathname === "/blog" ? "text-primary" : "hover:text-primary"
              }`}
          >
            <Link
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/blog");
              }}
            >
              Blog
            </Link>
          </li>
          <li
            className={`cursor-pointer transition-colors ${pathname === "/notes" ? "text-primary" : "hover:text-primary"
              }`}
          >
            <Link
              href="/notes"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/notes");
              }}
            >
              Notes
            </Link>
          </li>
          <li
            className={`cursor-pointer transition-colors ${pathname === "/projects" ? "text-primary" : "hover:text-primary"
              }`}
          >
            <Link
              href="/projects"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/projects");
              }}
            >
              Projects
            </Link>
          </li>
          <li
            className={`cursor-pointer transition-colors ${pathname === "/about" ? "text-primary" : "hover:text-primary"
              }`}
          >
            <Link
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/about");
              }}
            >
              About
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden relative">
        <div
          className={`bg-[#393939]/20 backdrop-blur-2xl px-3 py-2 fixed right-5 top-5 w-auto border border-[#3A3A3A] hover:cursor-pointer rounded-lg z-50 transition-transform duration-300 ease-in-out ${isMenuVisible ? "translate-y-0" : "-translate-y-20"
            }`}
        >
          <button
            onClick={toggleMenu}
            className="focus:outline-none flex items-center gap-2 text-xs hover:cursor-pointer"
          >
            Menu
            {isMenuOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </div>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="fixed top-15 right-5 z-50 rounded-lg bg-[#0A0A0A]/90 shadow-lg outline-none backdrop-blur-2xl border border-[#3A3A3A] p-3 grid gap-2 w-[320px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          >
            <div className="flex flex-col gap-2">
              <Link
                className="group p-3 relative rounded-xl bg-[#111111] w-full flex items-start gap-3 transition-colors hover:text-primary hover:bg-[#181818]"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/");
                }}
              >
                <div className="mt-0.5 p-3 bg-[#0A0A0A] text-[#A3A3A3] rounded-xl">
                  <LuHouse className="w-4 h-4 stroke-2" />
                </div>
                <div className="grow">
                  <div className="flex items-center gap-2 justify-between">
                    <p className="font-bold font-rethink *:underline decoration-transparent group-hover:decoration-[#A3A3A3] transition-colors">
                      Home
                    </p>
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">
                    Start page again
                  </p>
                </div>
                {
                  pathname === "/" && (
                    <Badge variant="menu" className="absolute top-2 right-2 font-base">Current</Badge>
                  )
                }
              </Link>

              <Link
                className="group p-3 relative rounded-xl bg-[#111111] w-full flex items-start gap-3 transition-colors hover:text-primary hover:bg-[#181818]"
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/blog");
                }}
              >
                <div className="mt-0.5 p-3 bg-[#0A0A0A] text-[#A3A3A3] rounded-xl">
                  <LuBook className="w-4 h-4 stroke-2" />
                </div>
                <div className="grow">
                  <div className="flex items-center gap-2 justify-between">
                    <p className="font-bold font-rethink *:underline decoration-transparent group-hover:decoration-[#A3A3A3] transition-colors">
                      Blog
                    </p>
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">
                    Please read if you want
                  </p>
                </div>
                {
                  pathname === "/blog" && (
                    <Badge variant="menu" className="absolute top-2 right-2 font-base">Current</Badge>
                  )
                }
              </Link>

              <Link
                className="group p-3 relative rounded-xl bg-[#111111] w-full flex items-start gap-3 transition-colors hover:text-primary hover:bg-[#181818]"
                href="/notes"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/notes");
                }}
              >
                <div className="mt-0.5 p-3 bg-[#0A0A0A] text-[#A3A3A3] rounded-xl">
                  <LuNotebookPen className="w-4 h-4 stroke-2" />
                </div>
                <div className="grow">
                  <div className="flex items-center gap-2 justify-between">
                    <p className="font-bold font-rethink *:underline decoration-transparent group-hover:decoration-[#A3A3A3] transition-colors">
                      Notes
                    </p>
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">
                    Quick thoughts & useful stuff
                  </p>
                </div>
                {pathname === "/notes" && (
                  <Badge variant="menu" className="absolute top-2 right-2 font-base">Current</Badge>
                )}
              </Link>

              <Link
                className="group p-3 relative rounded-xl bg-[#111111] w-full flex items-start gap-3 transition-colors hover:text-primary hover:bg-[#181818]"
                href="/projects"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/projects");
                }}
              >
                <div className="mt-0.5 p-3 bg-[#0A0A0A] text-[#A3A3A3] rounded-xl">
                  <LuFolderOpen className="w-4 h-4 stroke-2" />
                </div>
                <div className="grow">
                  <div className="flex items-center gap-2 justify-between">
                    <p className="font-bold font-rethink underline decoration-transparent group-hover:decoration-[#A3A3A3] transition-colors">
                      Projects
                    </p>
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">
                    A collection of what i did
                  </p>
                </div>
                {
                  pathname === "/projects" && (
                    <Badge variant="menu" className="absolute top-2 right-2 font-base">Current</Badge>
                  )
                }
              </Link>

              <Link
                className="group p-3 relative rounded-xl bg-[#111111] w-full flex items-start gap-3 transition-colors hover:text-primary hover:bg-[#181818]"
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/about");
                }}
              >
                <div className="mt-0.5 p-3 bg-[#0A0A0A] text-[#A3A3A3] rounded-xl">
                  <LuCircleUserRound className="w-4 h-4 stroke-2" />
                </div>
                <div className="grow">
                  <div className="flex items-center gap-2 justify-between">
                    <p className="font-bold font-rethink underline decoration-transparent group-hover:decoration-[#A3A3A3] transition-colors">
                      About
                    </p>
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">Knowing me</p>
                </div>
                {
                  pathname === "/about" && (
                    <Badge variant="menu" className="absolute top-2 right-2 font-base">Current</Badge>
                  )
                }
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
