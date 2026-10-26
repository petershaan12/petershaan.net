"use client";

import { useState, useEffect } from "react";
import { LuHeart } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
    slug: string;
    initialLikes: number;
}

export default function LikeButton({ slug, initialLikes }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(false);
    const [displayText, setDisplayText] = useState(`${initialLikes} Likes`);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const liked = localStorage.getItem(`liked_${slug}`);
        if (liked) {
            const t = setTimeout(() => setHasLiked(true), 0);
            return () => clearTimeout(t);
        }
    }, [slug]);

    const typeWriterEffect = async (newText: string) => {
        setIsAnimating(true);
        let currentText = displayText;

        while (currentText.length > 0) {
            currentText = currentText.slice(0, -1);
            setDisplayText(currentText);
            await new Promise((resolve) => setTimeout(resolve, 50));
        }

        for (let i = 0; i <= newText.length; i++) {
            setDisplayText(newText.slice(0, i));
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
        setIsAnimating(false);
    };

    const handleLike = async () => {
        if (hasLiked || isAnimating) return;
        try {
            const res = await fetch("/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug }),
            });

            if (res.ok) {
                const data = await res.json();
                const newLikes = data.likes;

                setLikes(newLikes);
                setHasLiked(true);
                localStorage.setItem(`liked_${slug}`, "true");

                // Trigger animation
                await typeWriterEffect(`${newLikes} Likes`);
            }
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={hasLiked || isAnimating}
            className={cn(
                "flex items-center gap-1 text-xs sm:text-sm font-semibold transition-colors duration-200",
                hasLiked ? "cursor-default" : "text-white/60 hover:text-red-400 cursor-pointer"
            )}
            aria-label={`Like post (${likes} likes)`}
        >
            <LuHeart className={cn(hasLiked && "fill-current text-red-500")} />
            <span>{displayText}</span>
        </button>
    );
}
