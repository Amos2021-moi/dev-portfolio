"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, GitBranch, MapPin, Send, CheckCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  setIsSubmitting(false);
  setIsSubmitted(true);
  setFormData({ name: "", email: "", subject: "", message: "" });
};
  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: "var(--color-muted)" }}>
      <div className="container-max">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-2">Get in touch</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Contact Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach
            out. I am always open to discussing new opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <div>
              <h3 className="text-xl font-bold mb-4">Let us work together</h3>
              <p className="text-muted-foreground leading-relaxed">
                I am currently available for freelance work and open to full
                time opportunities. If you have a project that needs some
                creative work, I would love to hear about it.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}>
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={"mailto:" + siteConfig.author.email}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {siteConfig.author.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-background rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}>
                  <GitBranch className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GitHub</p>
                  <a
                    href={"https://github.com/" + siteConfig.author.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {"github.com/" + siteConfig.author.github}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-background rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}>
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">Kenya, East Africa</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8 bg-background rounded-xl border text-center" style={{ borderColor: "var(--color-border)" }}>
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h3 className="text-xl font-bold">Message Sent!</h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. I will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:opacity-80 transition-opacity font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="bg-background rounded-xl border p-6 flex flex-col gap-4" style={{ borderColor: "var(--color-border)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="px-4 py-3 rounded-lg border bg-muted focus:outline-none text-sm"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="px-4 py-3 rounded-lg border bg-muted focus:outline-none text-sm"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Collaboration"
                    className="px-4 py-3 rounded-lg border bg-muted focus:outline-none text-sm"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="px-4 py-3 rounded-lg border bg-muted focus:outline-none text-sm resize-none"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}