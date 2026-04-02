"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [follower, setFollower] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let followerX = 0;
    let followerY = 0;
    let animFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleHoverStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[data-cursor='pointer']")
      ) {
        setIsHovering(true);
      }
    };

    const handleHoverEnd = () => setIsHovering(false);

    function animateFollower() {
      followerX += (position.x - followerX) * 0.12;
      followerY += (position.y - followerY) * 0.12;
      setFollower({ x: followerX, y: followerY });
      animFrame = requestAnimationFrame(animateFollower);
    }

    animFrame = requestAnimationFrame(animateFollower);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleHoverStart);
    document.addEventListener("mouseout", handleHoverEnd);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleHoverStart);
      document.removeEventListener("mouseout", handleHoverEnd);
    };
  }, [isMobile, position.x, position.y]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Main dot cursor */}
      <div
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          width: isClicking ? "6px" : "8px",
          height: isClicking ? "6px" : "8px",
          backgroundColor: "var(--color-primary)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "width 0.1s, height 0.1s",
        }}
      />

      {/* Follower ring */}
      <div
        style={{
          position: "fixed",
          left: follower.x,
          top: follower.y,
          width: isHovering ? "48px" : isClicking ? "28px" : "36px",
          height: isHovering ? "48px" : isClicking ? "28px" : "36px",
          border: "1.5px solid var(--color-primary)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: isHovering ? 0.6 : 0.4,
          transition: "width 0.2s, height 0.2s, opacity 0.2s",
          backgroundColor: isHovering
            ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
            : "transparent",
        }}
      />
    </>
  );
}