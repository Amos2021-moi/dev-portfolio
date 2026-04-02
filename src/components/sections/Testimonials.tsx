"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Plus, Loader2, CheckCircle } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  createdAt: string;
}

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className="w-5 h-5"
            style={{
              fill: star <= rating ? "rgb(234 179 8)" : "none",
              color: star <= rating ? "rgb(234 179 8)" : "var(--color-muted-foreground)",
            }}
          />
        </button>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(d => {
        setTestimonials(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.content) {
      setError("Name and message are required.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
        setForm({ name: "", role: "", company: "", content: "", rating: 5 });
      } else {
        setError("Failed to submit. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: "var(--color-muted)" }}
    >
      <div className="container-max">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary font-mono text-sm mb-2">Kind words</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Testimonials</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            What people say about working with me and my projects.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-background rounded-xl border p-6 animate-pulse"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                <div className="h-3 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 mb-8">
            <Quote className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">
              No testimonials yet. Be the first to leave a review!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-xl border p-6 space-y-4 relative"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Quote
                  className="w-8 h-8 text-primary absolute top-4 right-4 opacity-20"
                />
                <StarRating rating={t.rating} />
                <p className="text-muted-foreground leading-relaxed text-sm">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}{t.company ? " at " + t.company : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Submit testimonial */}
        <div className="text-center">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-green-500"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Thank you! Your testimonial is pending review.</span>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Leave a Testimonial
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto mt-8 bg-background rounded-xl border p-6 space-y-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3 className="font-bold text-lg">Share Your Experience</h3>

            {error && (
              <p className="text-red-500 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <StarRating
                rating={form.rating}
                onChange={r => setForm(prev => ({ ...prev, rating: r }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Software Engineer"
                  className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Company name"
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message *</label>
              <textarea
                value={form.content}
                onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your experience working with Mark..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none resize-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit Testimonial"
                )}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-3 rounded-lg border hover:bg-accent transition-colors text-sm"
                style={{ borderColor: "var(--color-border)" }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}