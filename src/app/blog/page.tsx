"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Clock, Eye, Plus } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  views: number;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data.filter((p: BlogPost) => p.published) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allTags = ["All", ...Array.from(new Set(posts.flatMap((p) => p.tags)))];

  const filtered = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase()));
    const matchesTag = activeTag === "All" || p.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const featured = posts.filter((p) => p.featured);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="section-padding pt-32 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-primary font-mono text-sm mb-2">My Writing</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Thoughts, tutorials, and insights about web development and technology.
          </p>
        </motion.div>
      </section>

      {featured.length > 0 && (
        <section className="container-max px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-xl font-bold mb-6">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((post) => (
              <Link key={post.id} href={"/blog/" + post.slug}>
                <div
                  className="group bg-background rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground" style={{ opacity: 0.8 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views} views
                      </span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-max px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeTag === tag ? "var(--color-primary)" : "var(--color-muted)",
                  color: activeTag === tag ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-max px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background rounded-xl border p-6 animate-pulse" style={{ borderColor: "var(--color-border)" }}>
                <div className="h-4 bg-muted rounded mb-3 w-3/4" />
                <div className="h-3 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              {posts.length === 0 ? "No blog posts yet. Write your first post!" : "No posts match your search."}
            </p>
            {posts.length === 0 && (
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Write First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((post) => (
              <Link key={post.id} href={"/blog/" + post.slug}>
                <div
                  className="group bg-background rounded-xl border p-6 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-4"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views} views
                      </span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}