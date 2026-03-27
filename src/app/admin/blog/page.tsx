"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, FileText, Clock } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  views: number;
  readingTime: string;
  tags: string[];
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    await fetch("/api/blog/" + id, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const togglePublished = async (id: string, published: boolean) => {
    await fetch("/api/blog/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Blog Posts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your blog content</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Posts", value: posts.length },
          { label: "Published", value: posts.filter((p) => p.published).length },
          { label: "Drafts", value: posts.filter((p) => !p.published).length },
          { label: "Total Views", value: posts.reduce((a, p) => a + p.views, 0).toLocaleString() },
        ].map((stat) => (
          <div key={stat.label} className="bg-background rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="grid grid-cols-12 gap-4 px-6 py-3 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="col-span-4">Post</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Tags</div>
          <div className="col-span-1">Views</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-2">Actions</div>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No posts found.</div>
          ) : (
            filtered.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-4">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => togglePublished(post.id, post.published)}
                    className="text-xs px-2 py-1 rounded-full transition-colors"
                    style={{
                      backgroundColor: post.published ? "rgb(34 197 94 / 0.1)" : "rgb(234 179 8 / 0.1)",
                      color: post.published ? "rgb(34 197 94)" : "rgb(234 179 8)",
                    }}
                  >
                    {post.published ? "Published" : "Draft"}
                  </button>
                </div>
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{post.tags.length - 2}</span>
                    )}
                  </div>
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views > 0 ? post.views.toLocaleString() : "0"}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime ? post.readingTime.replace(" read", "") : "—"}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Link
                    href={"/blog/" + post.slug}
                    target="_blank"
                    className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={"/admin/blog/" + post.id + "/edit"}
                    className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteId(post.id)}
                    className="p-1.5 rounded hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl border p-6 max-w-sm w-full mx-4 shadow-xl"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3 className="text-lg font-bold mb-2">Delete Post</h3>
            <p className="text-muted-foreground text-sm mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                style={{ borderColor: "var(--color-border)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}