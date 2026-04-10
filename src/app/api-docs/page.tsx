"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Copy, Check, Globe, BookOpen, Zap } from "lucide-react";

const baseUrl = "https://markosiemo.vercel.app";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/projects",
    description: "Get all public projects",
    params: [
      { name: "featured", type: "boolean", desc: "Filter featured projects only" },
      { name: "status", type: "string", desc: "Filter by status: ACTIVE, COMPLETED, ARCHIVED" },
      { name: "limit", type: "number", desc: "Results per page (max 50, default 10)" },
      { name: "page", type: "number", desc: "Page number (default 1)" },
    ],
    example: baseUrl + "/api/v1/projects?featured=true&limit=5",
    response: `{
  "data": [
    {
      "id": "cmnbp7b2p...",
      "title": "Dev Portfolio Platform",
      "slug": "dev-portfolio-platform",
      "description": "Full-stack portfolio...",
      "techStack": ["Next.js", "TypeScript"],
      "githubUrl": "https://github.com/...",
      "liveUrl": "https://...",
      "status": "ACTIVE",
      "featured": true,
      "views": 120,
      "likes": 45,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 6,
    "page": 1,
    "limit": 5,
    "totalPages": 2
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/blog",
    description: "Get all published blog posts",
    params: [
      { name: "tag", type: "string", desc: "Filter by tag name" },
      { name: "limit", type: "number", desc: "Results per page (max 50, default 10)" },
      { name: "page", type: "number", desc: "Page number (default 1)" },
    ],
    example: baseUrl + "/api/v1/blog?tag=Next.js&limit=3",
    response: `{
  "data": [
    {
      "id": "cmnc1g94k...",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-with-nextjs",
      "excerpt": "A comprehensive guide...",
      "tags": ["Next.js", "React"],
      "readingTime": "8 min read",
      "views": 1240,
      "featured": true,
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 8,
    "page": 1,
    "limit": 3,
    "totalPages": 3
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/stats",
    description: "Get portfolio statistics",
    params: [],
    example: baseUrl + "/api/v1/stats",
    response: `{
  "projects": 6,
  "blogPosts": 8,
  "pageViews": 3240,
  "subscribers": 124,
  "totalLikes": 89,
  "generatedAt": "2024-04-10T12:00:00.000Z"
}`,
  },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/10 transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <pre
        className="p-4 rounded-xl text-sm overflow-x-auto font-mono leading-relaxed"
        style={{ backgroundColor: "#0d1117", color: "#e6edf3" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ApiDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [testResult, setTestResult] = useState("");
  const [testing, setTesting] = useState(false);

  const testEndpoint = async (url: string) => {
    setTesting(true);
    setTestResult("");
    try {
      const res = await fetch(url);
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch {
      setTestResult('{"error": "Failed to fetch"}');
    } finally {
      setTesting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <span className="text-primary font-mono text-sm">Public API</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A public REST API to access Mark Osiemo's portfolio data.
            No authentication required. Rate limited to 30 requests per minute.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm"
              style={{ borderColor: "var(--color-border)" }}
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Base URL: <code className="font-mono text-primary">{baseUrl}</code></span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm"
              style={{ borderColor: "var(--color-border)" }}
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Rate limit: 30 req/min</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 bg-background rounded-xl border p-4 space-y-1"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Endpoints
              </p>
              {endpoints.map((ep, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveEndpoint(i);
                    setTestResult("");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    backgroundColor: activeEndpoint === i
                      ? "var(--color-primary)"
                      : "transparent",
                    color: activeEndpoint === i
                      ? "var(--color-primary-foreground)"
                      : "var(--color-muted-foreground)",
                  }}
                >
                  <span
                    className="text-xs font-mono mr-2 px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: activeEndpoint === i
                        ? "rgba(255,255,255,0.2)"
                        : "rgb(34 197 94 / 0.1)",
                      color: activeEndpoint === i
                        ? "white"
                        : "rgb(34 197 94)",
                    }}
                  >
                    GET
                  </span>
                  {ep.path.replace("/api/v1/", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {endpoints[activeEndpoint] && (
              <motion.div
                key={activeEndpoint}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Endpoint Header */}
                <div
                  className="bg-background rounded-xl border p-6"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-500/10 text-green-500 text-sm font-mono px-3 py-1 rounded-full font-bold">
                      {endpoints[activeEndpoint].method}
                    </span>
                    <code className="font-mono text-primary text-lg">
                      {endpoints[activeEndpoint].path}
                    </code>
                  </div>
                  <p className="text-muted-foreground">
                    {endpoints[activeEndpoint].description}
                  </p>
                </div>

                {/* Parameters */}
                {endpoints[activeEndpoint].params.length > 0 && (
                  <div
                    className="bg-background rounded-xl border p-6"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <h3 className="font-semibold mb-4">Query Parameters</h3>
                    <div className="space-y-3">
                      {endpoints[activeEndpoint].params.map((param) => (
                        <div
                          key={param.name}
                          className="flex items-start gap-4 p-3 rounded-lg"
                          style={{ backgroundColor: "var(--color-muted)" }}
                        >
                          <code className="text-primary text-sm font-mono flex-shrink-0 mt-0.5">
                            {param.name}
                          </code>
                          <div>
                            <span
                              className="text-xs px-2 py-0.5 rounded font-mono mr-2"
                              style={{
                                backgroundColor: "var(--color-background)",
                                color: "var(--color-muted-foreground)",
                              }}
                            >
                              {param.type}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {param.desc}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Example URL */}
                <div
                  className="bg-background rounded-xl border p-6"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <h3 className="font-semibold mb-4">Example Request</h3>
                  <CodeBlock code={"GET " + endpoints[activeEndpoint].example} />

                  <button
                    onClick={() => testEndpoint(endpoints[activeEndpoint].example)}
                    disabled={testing}
                    className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {testing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Try it live
                      </>
                    )}
                  </button>

                  {testResult && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Live Response:</p>
                      <CodeBlock code={testResult} />
                    </div>
                  )}
                </div>

                {/* Response Format */}
                <div
                  className="bg-background rounded-xl border p-6"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <h3 className="font-semibold mb-4">Response Format</h3>
                  <CodeBlock code={endpoints[activeEndpoint].response} />
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}