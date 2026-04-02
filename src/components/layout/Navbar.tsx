"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Code2, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/config";
import { useTheme } from "@/components/providers/ThemeProvider";
import CommandPalette from "@/components/ui/CommandPalette";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "border-b" : "bg-transparent border-transparent"
      )}
      style={{
        backgroundColor: scrolled ? "var(--color-background)" : "transparent",
        borderColor: scrolled ? "var(--color-border)" : "transparent",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-mono font-bold text-lg"
          >
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-gradient">Mark.dev</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}

            <div
              className="w-px h-4"
              style={{ backgroundColor: "var(--color-border)" }}
            />

            <CommandPalette />

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <Link
              href="/admin"
              className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Right */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <button
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div
            className="md:hidden py-4 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div
                className="pt-2 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Link
                  href="/admin"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity inline-block"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}