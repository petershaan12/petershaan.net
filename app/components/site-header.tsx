import { cn } from "~/lib/utils";
import { NavLink } from "@remix-run/react";
import { MainNav } from "./main-nav";
import { ModeToogle } from "./mode-toogle";
import { MobileNav } from "./mobile-nav";
import { DownloadIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
export function SiteHeader() {

  return (
    <header className="mt-10">
      <div className="container flex h-14 max-w-2xl items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center space-x-6">
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary hidden sm:inline-flex",
                  isActive ? "text-foreground" : "text-foreground/60"
                )
              }
            >
              blog
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary hidden sm:inline-flex",
                  isActive ? "text-foreground" : "text-foreground/60"
                )
              }
            >
              projects
            </NavLink>

            <NavLink
              to="/tools"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary hidden sm:inline-flex",
                  isActive ? "text-foreground" : "text-foreground/60"
                )
              }
            >
              tools
            </NavLink>

            <div className="flex items-center space-x-1">
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-10 px-0 ">
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem >
                    <a href="/cv-petershaan.pdf" download>Download My CV</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToogle />
            </div>
            <MobileNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
