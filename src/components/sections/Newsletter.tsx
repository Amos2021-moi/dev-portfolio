"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
  if (!email.trim()) {
    setError("Please enter your email address.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }
  setError("");
  setIsSubmitting(true);

  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data = await res.json();
    setError(data.error || "Failed to subscribe.");
    setIsSubmitting(false);
    return;
  }

  setIsSubmitting(false);
  setIsSubscribed(true);
};

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(221.2 83.2% 53.3% / 0.15), hsl(270 70% 60% / 0.15))",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Background Orbs */}
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "hsl(270 70% 60%)" }}
          />

          <div className="relative z-10">
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h3 className="text-2xl font-bold">You are subscribed!</h3>
                <p className="text-muted-foreground max-w-md">
                  Thank you for subscribing! You will receive updates about new
                  projects, blog posts, and tutorials straight to your inbox.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <Mail className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>

                {/* Text */}
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Stay in the Loop
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
                  Subscribe to get notified about new projects, blog posts,
                  tutorials, and developer tips. No spam, unsubscribe anytime.
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-8 mb-8">
                  {[
                    { value: "500+", label: "Subscribers" },
                    { value: "2x", label: "Monthly" },
                    { value: "0", label: "Spam" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2"
                      style={{
                        borderColor: error
                          ? "rgb(239 68 68)"
                          : "var(--color-border)",
                      }}
                    />
                    {error && (
                      <p className="text-xs text-red-500 mt-1 text-left">
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  By subscribing you agree to receive emails from Mark Osiemo.
                  Unsubscribe at any time.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}