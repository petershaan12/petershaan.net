import { Icons } from "./icons";
import { siteConfig } from "~/config/site";

export function SiteFooter() {
  return (
    <footer>
      <div className="my-12 flex flex-col items-center">
        <div className="py-7 flex  gap-10  text-xl text-gray-400 dark:text-white dark:opacity-50">
          <a target="_blank" rel="noreferrer" href={siteConfig.links.youtube}>
            <span className="sr-only">Youtube</span>
            <Icons.youtube />
          </a>
          <a target="_blank" rel="noreferrer" href={siteConfig.links.instagram}>
            <span className="sr-only">Instagram</span>
            <Icons.instagram />
          </a>
          <a target="_blank" rel="noreferrer" href={siteConfig.links.linkedin}>
            <span className="sr-only">Linkedin</span>
            <Icons.linkedin />
          </a>

          <a target="_blank" rel="noreferrer" href={siteConfig.links.github}>
            <span className="sr-only">Github</span>
            <Icons.gitHub />
          </a>
        </div>
        <div className="gradient-text text-xs -mt-2 mb-5 text-gray-500 dark:text-white opacity-50">
          ©2024 Peter Shaan, All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
