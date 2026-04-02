"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Loader2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; email: string };
}

interface CommentsProps {
  postId?: string;
  projectId?: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  if (hours < 24) return hours + "h ago";
  return days + "d ago";
}

export default function Comments({ postId, projectId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = postId
      ? "?postId=" + postId
      : "?projectId=" + projectId;

    fetch("/api/comments" + params)
      .then(r => r.json())
      .then(d => {
        setComments(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId, projectId]);

  const handleSubmit = async () => {
    if (!form.name || !form.content) {
      setError("Name and comment are required.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: form.content,
          postId: postId || null,
          projectId: projectId || null,
          authorName: form.name,
          authorEmail: form.email || null,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [newComment, ...prev]);
        setForm({ name: "", email: "", content: "" });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post comment.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 space-y-8">
      <h3 className="text-2xl font-bold flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-primary" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <div
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h4 className="font-semibold">Leave a Comment</h4>

        {error && (
          <p className="text-red-500 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-500 text-sm bg-green-500/10 px-3 py-2 rounded-lg">
            Comment posted successfully!
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email (optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Comment *</label>
          <textarea
            value={form.content}
            onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Post Comment
        </button>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div
              key={i}
              className="bg-background rounded-xl border p-6 animate-pulse"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="h-4 bg-muted rounded w-1/4 mb-3" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background rounded-xl border p-5"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {(comment.author.name || "A").charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {comment.author.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(comment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {comment.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}