"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Save, Eye } from "lucide-react";

const tagSuggestions = [
  "Next.js", "React", "TypeScript", "JavaScript", "Node.js",
  "PostgreSQL", "Prisma", "Tailwind CSS", "Docker", "DevOps",
];

export default function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    featured: false,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/blog/" + params.id)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          coverImage: data.coverImage || "",
          published: data.published || false,
          featured: data.featured || false,
        });
        setTags(data.tags || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      setError("Title and content are required.");
      return;
    }
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("/api/blog/" + params.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tags }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save post.");
        setIsSaving(false);
        return;
      }

      router.push("/admin/blog");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Blog Post</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {wordCount} words · {readingTime} min read
            </p>
          </div>
        </div>
        <button
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Eye className="w-4 h-4" />
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {preview ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background rounded-xl border p-8 max-w-3xl"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground"
                style={{ opacity: 0.8 }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {formData.title || "Untitled Post"}
          </h1>
          {formData.excerpt && (
            <p
              className="text-muted-foreground text-lg mb-6 leading-relaxed border-l-4 pl-4"
              style={{ borderColor: "var(--color-primary)" }}
            >
              {formData.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span>{readingTime} min read</span>
            <span>·</span>
            <span>{wordCount} words</span>
          </div>
          <div>
            {formData.content ? (
              formData.content.split("\n").map((line, i) =>
                line.trim() ? (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                    {line}
                  </p>
                ) : (
                  <br key={i} />
                )
              )
            ) : (
              <p className="text-muted-foreground italic">No content yet...</p>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div
            className="bg-background rounded-xl border p-6 space-y-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-semibold">Post Details</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none resize-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image URL</label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/cover.jpg"
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
          </div>

          <div
            className="bg-background rounded-xl border p-6 space-y-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Content</h2>
              <span className="text-xs text-muted-foreground font-mono">
                Markdown supported
              </span>
            </div>
            <div
              className="flex flex-wrap gap-2 p-2 rounded-lg border bg-muted/30"
              style={{ borderColor: "var(--color-border)" }}
            >
              {[
                { label: "H1", insert: "# " },
                { label: "H2", insert: "## " },
                { label: "H3", insert: "### " },
                { label: "Bold", insert: "**text**" },
                { label: "Code", insert: "`code`" },
                { label: "List", insert: "- item" },
              ].map((tool) => (
                <button
                  key={tool.label}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      content: prev.content + "\n" + tool.insert,
                    }))
                  }
                  className="px-3 py-1.5 rounded text-xs font-mono hover:bg-accent transition-colors border"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {tool.label}
                </button>
              ))}
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={20}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none resize-none font-mono leading-relaxed"
              style={{ borderColor: "var(--color-border)" }}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <span>{readingTime} min read</span>
            </div>
          </div>

          <div
            className="bg-background rounded-xl border p-6 space-y-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-semibold">Tags</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag(tagInput)}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2.5 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
              <button
                onClick={() => addTag(tagInput)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {tagSuggestions
                  .filter((t) => !tags.includes(t))
                  .slice(0, 8)
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
              </div>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary/60 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div
            className="bg-background rounded-xl border p-6 space-y-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-semibold">Publish Settings</h2>
            <div className="space-y-3">
              {[
                { key: "published", label: "Publish Post", desc: "Make this post visible to visitors" },
                { key: "featured", label: "Featured Post", desc: "Show in featured section" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev],
                      }))
                    }
                    className="relative w-11 h-6 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: formData[item.key as keyof typeof formData]
                        ? "var(--color-primary)"
                        : "var(--color-muted)",
                    }}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                      style={{
                        transform: formData[item.key as keyof typeof formData]
                          ? "translateX(20px)"
                          : "translateX(0)",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
            <Link
              href="/admin/blog"
              className="px-6 py-3 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
              style={{ borderColor: "var(--color-border)" }}
            >
              Cancel
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}