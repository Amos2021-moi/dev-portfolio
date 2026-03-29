"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  FolderKanban,
  RefreshCw,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  views: number;
  stars: number;
  techStack: string[];
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.some((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      )
  );

  const handleDelete = async (id: string) => {
    await fetch("/api/projects/" + id, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    await fetch("/api/projects/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, featured: !p.featured } : p
      )
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-primary" />
            Projects
            <span className="text-sm font-normal text-muted-foreground ml-1">
              ({projects.length})
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
            className="p-2 rounded-lg border hover:bg-accent transition-colors"
            style={{ borderColor: "var(--color-border)" }}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none"
          style={{ borderColor: "var(--color-border)" }}
        />
      </div>

      {/* Projects Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--color-border)" }}
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-12 gap-4 px-6 py-3 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="col-span-4">Project</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Tech Stack</div>
          <div className="col-span-1">Views</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse">
                <div className="col-span-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="col-span-2">
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
                <div className="col-span-3">
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
                <div className="col-span-1">
                  <div className="h-4 bg-muted rounded w-8" />
                </div>
                <div className="col-span-2">
                  <div className="h-4 bg-muted rounded w-16" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {projects.length === 0 ? (
                <div>
                  <p className="mb-2">No projects yet.</p>
                  <Link
                    href="/admin/projects/new"
                    className="text-primary hover:opacity-80 transition-opacity text-sm"
                  >
                    Add your first project
                  </Link>
                </div>
              ) : (
                "No projects match your search."
              )}
            </div>
          ) : (
            filtered.map((project) => (
              <div
                key={project.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors"
              >
                {/* Title */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    {project.featured && (
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium truncate">
                        {project.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        project.status === "ACTIVE"
                          ? "rgb(34 197 94 / 0.1)"
                          : "rgb(59 130 246 / 0.1)",
                      color:
                        project.status === "ACTIVE"
                          ? "rgb(34 197 94)"
                          : "rgb(59 130 246)",
                    }}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Tech Stack */}
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{project.techStack.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Views */}
                <div className="col-span-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {project.views}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(project.id, project.featured)}
                    className="p-1.5 rounded hover:bg-accent transition-colors"
                    title={project.featured ? "Unfeature" : "Feature"}
                  >
                    <Star
                      className="w-4 h-4"
                      style={{
                        fill: project.featured ? "rgb(234 179 8)" : "none",
                        color: project.featured
                          ? "rgb(234 179 8)"
                          : "var(--color-muted-foreground)",
                      }}
                    />
                  </button>
                  <Link
                    href={"/projects/" + project.slug}
                    target="_blank"
                    className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    title="View public page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={"/admin/projects/" + project.id + "/edit"}
                    className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    title="Edit project"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteId(project.id)}
                    className="p-1.5 rounded hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl border p-6 max-w-sm w-full mx-4 shadow-xl"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3 className="text-lg font-bold mb-2">Delete Project</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Are you sure? This cannot be undone.
            </p>
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