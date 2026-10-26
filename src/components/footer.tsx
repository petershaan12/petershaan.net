"use client";
import Link from "next/link";
import { FiFacebook, FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi";
import { TbBrandPinterest } from "react-icons/tb";
import { siteConfig } from "@/config/site";
import { openPageAnimation, pageAnimation } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import SubscriptionForm from "@/components/subscription-form";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = async (path: string) => {
    if (pathname === path) {
      await pageAnimation();
      openPageAnimation();
      return;
    }
    await pageAnimation();
    router.push(path);
  };

  return (
    <footer className="border-t border-[#ACACAC]/40 mt-16 md:mt-32">
      <div className="container flex flex-col md:flex-row gap-6 md:gap-8 py-6 md:py-16">
        <div className="w-full md:w-1/4">
          <h2 className="text-xl md:text-2xl mb-1 md:mb-2 font-rethink font-bold">
            {siteConfig.name}
          </h2>
          <p className="text-sm md:text-base text-gray-400 mb-3 md:mb-4">
            {siteConfig.description}
          </p>
          <div className="flex flex-wrap gap-4 md:gap-5 mt-4 md:mt-8">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Peter Shaan's GitHub profile"
            >
              <FiGithub className="text-xl md:text-2xl hover:text-primary cursor-custom" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Peter Shaan's LinkedIn profile"
            >
              <FiLinkedin className="text-xl md:text-2xl hover:text-primary cursor-custom" />
            </a>
            <a
              href={siteConfig.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Peter Shaan's Facebook profile"
            >
              <FiFacebook className="text-xl md:text-2xl hover:text-primary cursor-custom" />
            </a>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Peter Shaan's Instagram profile"
            >
              <FiInstagram className="text-xl md:text-2xl hover:text-primary cursor-custom" />
            </a>
            <a
              href={siteConfig.links.pinterest}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Peter Shaan's Pinterest profile"
            >
              <TbBrandPinterest className="text-xl md:text-2xl hover:text-primary cursor-custom" />
            </a>
          </div>
        </div>

        {/* Middle section - now larger */}
        <div className="md:w-1/2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <h6 className="mb-2 text-sm md:text-base text-gray-400">
                General
              </h6>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                <li>
                  <Link href="/" className="hover:text-primary cursor-custom">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-primary cursor-custom"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="hover:text-primary cursor-custom"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary cursor-custom"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="mb-2 text-sm md:text-base text-gray-400">
                My Website
              </h6>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                <li>
                  <Link
                    href="/guestbook"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/guestbook");
                    }}
                    className="hover:text-primary cursor-custom"
                  >
                    Guest Book
                  </Link>
                </li>
                <li>
                  <a
                    href="https://cloud.umami.is/share/umKuaNEUAOq8wkDm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary cursor-custom"
                  >
                    Analytics
                  </a>
                </li>

              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1 mt-4 sm:mt-0">
              <h6 className="mb-2 text-sm md:text-base text-gray-400">
                Resource
              </h6>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                <li>
                  <Link
                    href="/blog/update-website-v3"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/blog/update-website-v3");
                    }}
                    className="hover:text-primary cursor-custom "
                  >
                    Thanks Giving
                  </Link>
                </li>
                <li>
                  <a
                    href="https://petershaanv2.vercel.app/"
                    className="hover:text-primary cursor-custom"
                    aria-label="Visit Peter Shaan's portfolio v2.0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    portofolia-v2.0
                  </a>
                </li>
                <li>
                  <a
                    href="https://petershaanv1.vercel.app/"
                    className="hover:text-primary cursor-custom"
                    aria-label="Visit Peter Shaan's portfolio v1.0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    portofolia-v1.0
                  </a>
                </li>
                <li>
                  <a
                    href="/rss.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary cursor-custom flex items-center gap-1"
                  >
                    RSS Feed
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/4 mt-6 md:mt-0">
          <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
            Subscribe to my blog
          </h2>
          <p className="text-sm text-gray-400 mb-3 md:mb-4">
            Get notified when I publish new articles! 📬
          </p>

          <SubscriptionForm />
        </div>
      </div>

      <div className="container flex justify-center my-4 md:my-6 pt-4 md:pt-6 text-center text-gray-400">
        <div className="w-full sm:w-3/4 md:w-1/2 mx-auto px-4 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ACACAC]/40 to-transparent"></div>
          <p className="pt-4 md:pt-6 text-xs md:text-sm">
            ©2026 Peter Shaan, All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
