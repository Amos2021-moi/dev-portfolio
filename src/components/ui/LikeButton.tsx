"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LikeButtonProps {
  projectId: string;
  initialLikes: number;
}

export default function LikeButton({ projectId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const key = "liked_project_" + projectId;
    if (localStorage.getItem(key)) setLiked(true);
  }, [projectId]);

  const handleLike = async () => {
    if (liked || animating) return;

    setAnimating(true);
    setLiked(true);
    setLikes(prev => prev + 1);

    const key = "liked_project_" + projectId;
    localStorage.setItem(key, "1");

    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
    } catch {
      setLiked(false);
      setLikes(prev => prev - 1);
      localStorage.removeItem(key);
    }

    setTimeout(() => setAnimating(false), 600);
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className="relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all"
      style={{
        borderColor: liked ? "rgb(239 68 68 / 0.5)" : "var(--color-border)",
        backgroundColor: liked ? "rgb(239 68 68 / 0.1)" : "transparent",
        color: liked ? "rgb(239 68 68)" : "var(--color-muted-foreground)",
      }}
    >
      <AnimatePresence>
        {animating && (
          <motion.div
            initial={{ scale: 0, opacity: 1, y: 0 }}
            animate={{ scale: 1.5, opacity: 0, y: -30 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <Heart
        className="w-4 h-4 transition-all"
        style={{ fill: liked ? "currentColor" : "none" }}
      />
      <span className="text-sm font-medium">{likes}</span>
    </button>
  );
}