"use client";

import { useEffect, useRef } from "react";

interface BlogCommentsProps {
    slug: string;
}

export default function BlogComments({ slug }: BlogCommentsProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        // Clear existing comments when slug changes
        ref.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://giscus.app/client.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.setAttribute("data-repo", "petershaan12/petershaan.net");
        script.setAttribute("data-repo-id", "R_kgDOL82pnw");
        script.setAttribute("data-category", "Q&A");
        script.setAttribute("data-category-id", "DIC_kwDOL82pn84C0K7g");
        script.setAttribute("data-mapping", "specific");
        script.setAttribute("data-term", slug);
        script.setAttribute("data-strict", "0");
        script.setAttribute("data-reactions-enabled", "0");
        script.setAttribute("data-emit-metadata", "0");
        script.setAttribute("data-input-position", "bottom");
        script.setAttribute("data-theme", "dark");
        script.setAttribute("data-lang", "en");
        script.setAttribute("data-loading", "lazy");

        ref.current.appendChild(script);
    }, [slug]);

    return (
        <div className="mt-16 pt-8 border-t border-[#ACACAC]/20">
            <div ref={ref} className="giscus" />
        </div>
    );
}
