"use client";

import { useEffect, useRef } from "react";
import AnimatedPageHeader from "@/components/animated-page-header";

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "petershaan12/petershaan.net");
    script.setAttribute("data-repo-id", "R_kgDOL82pnw");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOL82pn84C0K7f");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");

    ref.current.appendChild(script);
  }, []);

  return (
    <>
      <section className="mt-16 md:mt-40 mb-10 md:mb-16 container">
        <AnimatedPageHeader icon="👋" title="Guest Book">
          Leave a message! I&apos;d love to hear from you! 😊
        </AnimatedPageHeader>
      </section>
      <section className="container">
        <div ref={ref} className="giscus" />
      </section>
    </>
  );
}
