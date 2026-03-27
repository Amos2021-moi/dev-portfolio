"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Clock, Eye, Calendar, Tag } from "lucide-react";

const posts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  readingTime: string;
  views: number;
  date: string;
  color: string;
}> = {
  "getting-started-with-nextjs": {
    title: "Getting Started with Next.js 14 App Router",
    excerpt: "A comprehensive guide to building modern web applications with Next.js 14.",
    content: `
## Introduction

Next.js 14 introduced a revolutionary new way to build React applications with the App Router. This guide will walk you through everything you need to know to get started.

## What is the App Router?

The App Router is a new paradigm for building Next.js applications. It uses React Server Components by default, which means your components render on the server and send minimal JavaScript to the client.

## Setting Up Your Project

To create a new Next.js 14 project, run the following command:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
\`\`\`

## File Based Routing

With the App Router, routing is based on the file system. Here is how it works:

- \`app/page.tsx\` → renders at \`/\`
- \`app/about/page.tsx\` → renders at \`/about\`
- \`app/blog/[slug]/page.tsx\` → renders at \`/blog/:slug\`

## Server Components vs Client Components

By default, all components in the App Router are Server Components. To use client-side features like useState or useEffect, add the "use client" directive at the top of your file.

\`\`\`tsx
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## Conclusion

The Next.js App Router is a powerful tool for building modern web applications. With Server Components, file-based routing, and built-in optimizations, it is the best way to build React apps today.
    `,
    tags: ["Next.js", "React", "TypeScript"],
    readingTime: "8 min read",
    views: 1240,
    date: "2024-01-15",
    color: "from-blue-500 to-purple-500",
  },
  "mastering-tailwind-css": {
    title: "Mastering Tailwind CSS for Modern UI Design",
    excerpt: "Deep dive into Tailwind CSS utility classes, custom configurations, and animations.",
    content: `
## Why Tailwind CSS?

Tailwind CSS is a utility-first CSS framework that allows you to build modern designs directly in your markup. Instead of writing custom CSS, you compose designs using predefined utility classes.

## Core Concepts

### Utility Classes

Tailwind provides thousands of utility classes for every CSS property:

\`\`\`html
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 class="text-xl font-bold text-gray-900">Hello World</h2>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click Me
  </button>
</div>
\`\`\`

### Responsive Design

Tailwind makes responsive design simple with breakpoint prefixes:

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Responsive grid -->
</div>
\`\`\`

## Custom Configuration

You can customize Tailwind by editing the tailwind.config.ts file to add custom colors, fonts, spacing, and more.

## Conclusion

Tailwind CSS is a game changer for web development. Once you learn the utility classes, you can build beautiful UIs faster than ever before.
    `,
    tags: ["Tailwind CSS", "CSS", "Design"],
    readingTime: "6 min read",
    views: 980,
    date: "2024-01-22",
    color: "from-cyan-500 to-blue-500",
  },
};

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-bold mt-6 mb-3">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={i}
          className="bg-muted rounded-lg p-4 overflow-x-auto my-4 text-sm font-mono"
          style={{ borderColor: "var(--color-border)" }}
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="ml-4 text-muted-foreground mb-1 list-disc">
          {line.replace("- ", "")}
        </li>
      );
    } else if (line.trim() !== "") {
      elements.push(
        <p key={i} className="text-muted-foreground leading-relaxed mb-4">
          {line}
        </p>
      );
    }
    i++;
  }

  return elements;
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts[params.slug];

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container-max section-padding pt-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you are looking for does not exist.
          </p>
          <Link
            href="/blog"
            className="text-primary hover:opacity-80 transition-opacity flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <article className="container-max px-4 sm:px-6 lg:px-8 pt-32 pb-24 max-w-4xl">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Gradient Bar */}
          <div
            className={"h-1 w-24 rounded-full bg-gradient-to-r mb-6 " + post.color}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground"
                style={{ opacity: 0.8 }}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div
            className="flex flex-wrap items-center gap-6 py-4 border-t border-b text-sm text-muted-foreground"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readingTime}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {post.views.toLocaleString()} views
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          {renderContent(post.content)}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-xl border text-center"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3 className="text-xl font-bold mb-2">Enjoyed this post?</h3>
          <p className="text-muted-foreground mb-4">
            Feel free to reach out if you have questions or want to collaborate.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Get In Touch
          </Link>
        </motion.div>

      </article>

      <Footer />
    </main>
  );
}
