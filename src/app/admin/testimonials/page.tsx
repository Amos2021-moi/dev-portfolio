"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Check, Trash2, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetch("/api/testimonials?all=true")
      .then(r => r.json())
      .then(d => {
        setTestimonials(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string, approved: boolean) => {
    await fetch("/api/testimonials/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    setTestimonials(prev =>
      prev.map(t => t.id === id ? { ...t, approved } : t)
    );
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/testimonials/" + id, { method: "DELETE" });
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const filtered = testimonials.filter(t => {
    if (filter === "pending") return !t.approved;
    if (filter === "approved") return t.approved;
    return true;
  });

  const pending = testimonials.filter(t => !t.approved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Quote className="w-6 h-6 text-primary" />
            Testimonials
            {pending > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {pending} pending
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage visitor testimonials
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "approved"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              backgroundColor: filter === f ? "var(--color-primary)" : "var(--color-muted)",
              color: filter === f ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
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
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No testimonials found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background rounded-xl border p-6"
              style={{
                borderColor: !t.approved
                  ? "rgb(234 179 8 / 0.5)"
                  : "var(--color-border)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role}{t.company ? " at " + t.company : ""}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className="w-3 h-3"
                          style={{
                            fill: s <= t.rating ? "rgb(234 179 8)" : "none",
                            color: s <= t.rating ? "rgb(234 179 8)" : "var(--color-muted-foreground)",
                          }}
                        />
                      ))}
                    </div>
                    {!t.approved && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600">
                        Pending
                      </span>
                    )}
                    {t.approved && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                        Approved
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{t.content}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(t.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!t.approved ? (
                    <button
                      onClick={() => handleApprove(t.id, true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors text-sm"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(t.id, false)}
                      className="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors text-sm"
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}