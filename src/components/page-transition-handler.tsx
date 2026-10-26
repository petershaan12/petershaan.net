"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  openPageAnimation,
  PAGE_LOADING_DONE_EVENT,
  PAGE_LOADING_START_EVENT,
} from "@/lib/utils";

export default function PageTransitionHandler() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const isVisibleRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => {
    openPageAnimation();
  }, [pathname]);

  useEffect(() => {
    const startLoading = () => {
      clearTimers();
      isVisibleRef.current = true;
      setIsVisible(true);
      setProgress(12);

      timersRef.current = [
        window.setTimeout(() => setProgress(45), 120),
        window.setTimeout(() => setProgress(72), 420),
        window.setTimeout(() => setProgress(88), 900),
      ];
    };

    const finishLoading = () => {
      if (!isVisibleRef.current) return;

      clearTimers();
      setProgress(100);

      timersRef.current = [
        window.setTimeout(() => {
          isVisibleRef.current = false;
          setIsVisible(false);
          setProgress(0);
        }, 260),
      ];
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      const target = link.getAttribute("target");
      const isDownload = link.hasAttribute("download");
      if (!href || target === "_blank" || isDownload) return;

      const url = new URL(href, window.location.href);
      const isSamePageHash =
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash;

      if (url.origin !== window.location.origin || isSamePageHash) return;

      startLoading();
    };

    window.addEventListener(PAGE_LOADING_START_EVENT, startLoading);
    window.addEventListener(PAGE_LOADING_DONE_EVENT, finishLoading);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      clearTimers();
      window.removeEventListener(PAGE_LOADING_START_EVENT, startLoading);
      window.removeEventListener(PAGE_LOADING_DONE_EVENT, finishLoading);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed left-0 top-0 z-[9999] h-[0.5px] w-full origin-left bg-primary brightness-75 transition-[transform,opacity] duration-300 ease-out ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}
