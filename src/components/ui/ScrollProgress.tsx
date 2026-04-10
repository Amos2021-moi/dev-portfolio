"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setProgress(totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-0.5"
      style={{ backgroundColor: "var(--color-muted)" }}
    >
      <div
        className="h-full transition-all duration-75"
        style={{
          width: progress + "%",
          background: "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
        }}
      />
    </div>
  );
}