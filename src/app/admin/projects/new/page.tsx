"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Save } from "lucide-react";

const statusOptions = ["ACTIVE", "COMPLETED", "ARCHIVED"];

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    githubUrl: "",
    liveUrl: "",
    status: "ACTIVE",
    featured: false,
  });
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack((prev) => [...prev, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setTechStack((prev) => prev.filter((t) => t !== tech));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      setError("Title and description are required.");
      return;
    }
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, techStack }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save project.");
        setIsSaving(false);
        return;
      }

      router.push("/admin/projects");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Project</h1>
          <p className="text-muted-foreground text-sm mt-1">Add a new project to your portfolio</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        <div className="bg-background rounded-xl border p-6 space-y-4" style={{ borderColor: "var(--color-border)" }}>
          <h2 className="font-semibold">Basic Information</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My Awesome Project"
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A brief description of your project..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none resize-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Detailed description, features, challenges..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none resize-none font-mono"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
        </div>

        <div className="bg-background rounded-xl border p-6 space-y-4" style={{ borderColor: "var(--color-border)" }}>
          <h2 className="font-semibold">Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Live URL</label>
              <input
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://myproject.vercel.app"
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl border p-6 space-y-4" style={{ borderColor: "var(--color-border)" }}>
          <h2 className="font-semibold">Tech Stack</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTech()}
              placeholder="e.g. Next.js"
              className="flex-1 px-4 py-2.5 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
            <button
              onClick={addTech}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-1.5 bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-sm font-mono"
                >
                  {tech}
                  <button onClick={() => removeTech(tech)} className="hover:text-foreground transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-background rounded-xl border p-6 space-y-4" style={{ borderColor: "var(--color-border)" }}>
          <h2 className="font-semibold">Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Featured</label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-muted/50"
                style={{ borderColor: "var(--color-border)" }}
              >
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="featured" className="text-sm text-muted-foreground cursor-pointer">
                  Show on homepage
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Project
              </>
            )}
          </button>
          <Link
            href="/admin/projects"
            className="px-6 py-3 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            style={{ borderColor: "var(--color-border)" }}
          >
            Cancel
          </Link>
        </div>

      </motion.div>
    </div>
  );
}