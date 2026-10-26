"use client";

import { useState, useRef, useCallback } from "react";

export default function SubscriptionForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (buttonRef.current && buttonRect) {
          setCoords({
            x: e.clientX - buttonRect.left,
            y: e.clientY - buttonRect.top,
          });
        }
      }, 16);
    },
    [buttonRect]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe");
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-wrap md:flex-nowrap gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-full bg-[#111111] border border-[#3A3A3A]/70 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-sm"
          disabled={status === "loading"}
          required
        />
        <button
          ref={buttonRef}
          type="submit"
          disabled={status === "loading"}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          className="relative group px-6 py-3 rounded-full backdrop-blur-sm border border-transparent inline-flex items-center gap-2 cursor-custom bg-[#0A0A0A] transition-opacity min-h-[48px] disabled:opacity-50"
          style={{
            ["--cursorX" as string]: `${coords.x}px`,
            ["--cursorY" as string]: `${coords.y}px`,
          }}
        >
          {/* Gradient border effect */}
          <div className="pointer-events-none select-none absolute inset-[-2px] overflow-hidden rounded-full">
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(to right, #0A0A0A 0%, #5A5A5A 44%, #0A0A0A 100%)",
                borderRadius: "9999px",
              }}
            ></div>
          </div>

          {/* Inner black background */}
          <div className="pointer-events-none select-none absolute inset-0 bg-[#0A0A0A] rounded-full z-[1]"></div>

          {/* Hover effects */}
          <div className="pointer-events-none select-none absolute inset-0 overflow-hidden rounded-full opacity-0 group-hover:opacity-60 transition-opacity z-[2]">
            <div
              className="absolute top-0 left-0 w-[150%] h-[150%]"
              style={{
                background:
                  "radial-gradient(rgba(110, 110, 110, 0.2), transparent 70%)",
                transform:
                  "translateX(calc(var(--cursorX) - 50%)) translateY(calc(var(--cursorY) - 50%)) scale(1) translateZ(0)",
              }}
            ></div>
          </div>

          <span className="relative z-10 text-sm">
            {status === "loading" ? "..." : "Subscribe"}
          </span>
        </button>
      </div>

      {message && (
        <p
          className={`text-sm ${status === "success" ? "text-primary" : "text-red-400"
            }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
