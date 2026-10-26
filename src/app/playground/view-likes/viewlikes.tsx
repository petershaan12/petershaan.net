"use client";

import { useState, useEffect } from "react";
import { LuEye, LuThumbsUp } from "react-icons/lu";

export default function ViewLikes() {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    incrementView();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/playground/like?title=default");
      if (response.ok) {
        const data = await response.json();
        setViews(data.views);
        setLikes(data.likes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementView = async () => {
    try {
      const response = await fetch("/api/playground/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "default" }),
      });

      if (response.ok) {
        const data = await response.json();
        setViews(data.views);
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const incrementLike = async () => {
    try {
      const response = await fetch("/api/playground/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "default" }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
      }
    } catch (error) {
      console.error("Error incrementing likes:", error);
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 hover:text-primary p-2 rounded transition-colors">
              <LuEye className="w-6 h-6" />
              <p
                style={{ fontSize: "1.2rem" }}
                className="flex items-center gap-2"
              >
                <span>{views}</span>
                Views
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={incrementLike}
              className="flex items-center gap-2 hover:text-primary hover:cursor-pointer p-2 rounded transition-colors"
            >
              <LuThumbsUp className="w-6 h-6" />
              <p
                style={{ fontSize: "1.2rem" }}
                className="flex items-center gap-2"
              >
                <span>{likes}</span>
                Likes
              </p>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
