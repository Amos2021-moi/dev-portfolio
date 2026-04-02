"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  FolderKanban,
  FileText,
  Mail,
  Settings,
  BarChart2,
  Heart,
  X,
} from "lucide-react";

const staticCommands = [
  { id: "home", label: "Go to Home", icon: Home, action: "/" },
  { id: "projects", label: "View Projects", icon: FolderKanban, action: "/projects" },
  { id: "blog", label: "Read Blog", icon: FileText, action: "/blog" },
  { id: "contact", label: "Contact Me", icon: Mail, action: "/#contact" },
  { id: "donate", label: "Support / Donate", icon: Heart, action: "/donate" },
  { id: "admin", label: "Admin Dashboard", icon: Settings, action: "/admin" },
  { id: "analytics", label: "View Analytics", icon: BarChart2, action: "/admin/analytics" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [projects, setProjects] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [posts, setPosts] = useState<{ id: string; title: string; slug: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setProjects(d.slice(0, 5));
    }).catch(() => {});
    fetch("/api/blog").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPosts(d.filter((p: { published: boolean }) => p.published).slice(0, 5));
    }).catch(() => {});
  }, []);

  const dynamicCommands = [
    ...projects.map(p => ({
      id: "project-" + p.id,
      label: "Project: " + p.title,
      icon: FolderKanban,
      action: "/projects/" + p.slug,
    })),
    ...posts.map(p => ({
      id: "post-" + p.id,
      label: "Blog: " + p.title,
      icon: FileText,
      action: "/blog/" + p.slug,
    })),
  ];

  const allCommands = [...staticCommands, ...dynamicCommands];

  const filtered = query
    ? allCommands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const cmd = filtered[selectedIndex];
      if (cmd) {
        router.push(cmd.action);
        setIsOpen(false);
      }
    }
  };

  const handleSelect = (action: string) => {
    router.push(action);
    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <>
      {/* Trigger button in navbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Search className="w-3 h-3" />
        <span>Search</span>
        <kbd
          className="px-1.5 py-0.5 rounded text-xs font-mono"
          style={{ backgroundColor: "var(--color-muted)" }}
        >
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg bg-background rounded-2xl border shadow-2xl overflow-hidden"
              style={{ borderColor: "var(--color-border)" }}
            >
              {/* Search Input */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search pages, projects, blog posts..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-accent transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-8">
                    No results found for "{query}"
                  </p>
                ) : (
                  filtered.map((cmd, i) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd.action)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                        style={{
                          backgroundColor:
                            i === selectedIndex
                              ? "var(--color-muted)"
                              : "transparent",
                        }}
                        onMouseEnter={() => setSelectedIndex(i)}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              i === selectedIndex
                                ? "var(--color-primary)"
                                : "var(--color-muted)",
                          }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{
                              color:
                                i === selectedIndex
                                  ? "var(--color-primary-foreground)"
                                  : "var(--color-muted-foreground)",
                            }}
                          />
                        </div>
                        <span className="text-sm">{cmd.label}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center gap-4 px-4 py-2 border-t text-xs text-muted-foreground"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>Esc Close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}