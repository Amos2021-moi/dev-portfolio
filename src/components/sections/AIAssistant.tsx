"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What are your main skills?",
  "What projects have you built?",
  "Are you available for hire?",
  "What is your tech stack?",
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I am Mark's AI assistant. I can answer questions about his skills, projects, and experience. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes("skill") || q.includes("know") || q.includes("technology")) {
      return "Mark is skilled in TypeScript, React, Next.js, Node.js, PostgreSQL, Prisma, Tailwind CSS, Python, Git, and Docker. He specializes in full-stack web development with a focus on modern JavaScript frameworks.";
    }
    if (q.includes("project") || q.includes("built") || q.includes("work")) {
      return "Mark has built several impressive projects including a Dev Portfolio Platform, an AI Chat Application, an E-Commerce Dashboard, a Task Management App, a Weather Dashboard, and a URL Shortener Service. You can see all of them at /projects.";
    }
    if (q.includes("hire") || q.includes("available") || q.includes("freelance") || q.includes("job")) {
      return "Yes! Mark is currently available for freelance work and open to full-time opportunities. You can reach him at amosmark2332@gmail.com or use the contact form on this site.";
    }
    if (q.includes("who") || q.includes("about") || q.includes("introduce")) {
      return "Mark Amos Osiemo is a Computer Science student at South Eastern Kenya University (SEKU). He is passionate about building modern web applications and turning ideas into real digital products. Always learning, always building!";
    }
    if (q.includes("contact") || q.includes("email") || q.includes("reach")) {
      return "You can contact Mark via email at amosmark2332@gmail.com or through the contact form at the bottom of this page. He usually responds within 24 hours.";
    }
    if (q.includes("github") || q.includes("code") || q.includes("repository")) {
      return "You can find Mark's code on GitHub at github.com/AMOS2021-MOI. He has several open source projects there that you can explore and contribute to.";
    }
    if (q.includes("blog") || q.includes("write") || q.includes("article")) {
      return "Mark writes about web development topics including Next.js, TypeScript, PostgreSQL, Tailwind CSS, and DevOps. Check out his blog at /blog for tutorials and insights.";
    }
    if (q.includes("education") || q.includes("study") || q.includes("university") || q.includes("school")) {
      return "Mark is currently studying Computer Science at South Eastern Kenya University (SEKU) in Kenya. He combines his academic knowledge with hands-on project building.";
    }
    if (q.includes("stack") || q.includes("tech")) {
      return "Mark's preferred tech stack is Next.js + TypeScript for the frontend, Node.js/Express for the backend, PostgreSQL with Prisma ORM for the database, and Tailwind CSS for styling. He deploys on Vercel with GitHub Actions for CI/CD.";
    }
    return "That is a great question! For more details about Mark, feel free to explore his portfolio or reach out directly at amosmark2332@gmail.com. You can also check his projects at /projects and his blog at /blog.";
  };

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 600)
    );

    const response = getAIResponse(message);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
        style={{ display: isOpen ? "none" : "flex" }}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-border)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b bg-primary"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">
                    Mark's AI Assistant
                  </p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <p className="text-xs text-primary-foreground/70">
                      Online
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors text-primary-foreground"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors text-primary-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    "flex gap-2 " +
                    (message.role === "user" ? "flex-row-reverse" : "flex-row")
                  }
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor:
                        message.role === "assistant"
                          ? "var(--color-primary)"
                          : "var(--color-muted)",
                    }}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className="max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                    style={{
                      backgroundColor:
                        message.role === "assistant"
                          ? "var(--color-muted)"
                          : "var(--color-primary)",
                      color:
                        message.role === "assistant"
                          ? "var(--color-foreground)"
                          : "var(--color-primary-foreground)",
                      borderRadius:
                        message.role === "assistant"
                          ? "4px 16px 16px 16px"
                          : "16px 4px 16px 16px",
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="flex gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{ backgroundColor: "var(--color-muted)" }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: i * 0.15 + "s" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div
                className="px-4 pb-2 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p className="text-xs text-muted-foreground mt-2 mb-2">
                  Suggested questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-xs px-2.5 py-1.5 rounded-full border hover:bg-primary/10 hover:text-primary transition-colors"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div
              className="p-4 border-t flex gap-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}